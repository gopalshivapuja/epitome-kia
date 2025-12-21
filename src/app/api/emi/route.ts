import { NextRequest } from 'next/server'
import { successResponse, handleApiError } from '@/lib/api-utils'
import { emiCalculationSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const data = emiCalculationSchema.parse(body)

    // Calculate EMI using reducing balance method
    const loanAmount = data.principal - data.downPayment
    const monthlyRate = data.interestRate / 100 / 12
    const tenure = data.tenure

    let emi: number
    let totalInterest: number
    let totalPayment: number

    if (monthlyRate === 0) {
      // No interest case
      emi = loanAmount / tenure
      totalInterest = 0
      totalPayment = loanAmount
    } else {
      // Standard EMI formula: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
      const numerator = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)
      const denominator = Math.pow(1 + monthlyRate, tenure) - 1
      emi = numerator / denominator
      totalPayment = emi * tenure
      totalInterest = totalPayment - loanAmount
    }

    // Generate amortization schedule (first 12 months and last payment)
    const schedule = []
    let balance = loanAmount

    for (let month = 1; month <= Math.min(tenure, 12); month++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = emi - interestPayment
      balance -= principalPayment

      schedule.push({
        month,
        emi: Math.round(emi),
        principal: Math.round(principalPayment),
        interest: Math.round(interestPayment),
        balance: Math.max(0, Math.round(balance)),
      })
    }

    return successResponse({
      input: {
        principal: data.principal,
        downPayment: data.downPayment,
        loanAmount,
        interestRate: data.interestRate,
        tenure: data.tenure,
      },
      result: {
        emi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalPayment),
        effectiveRate: ((totalInterest / loanAmount) * 100).toFixed(2),
      },
      schedule,
      disclaimer:
        'This is an indicative calculation. Actual EMI may vary based on processing fees, insurance, and other charges. Please contact our sales team for accurate financing options.',
    })
  } catch (error) {
    return handleApiError(error)
  }
}
