'use client'

import { useState, useMemo, useCallback } from 'react'
import { Calculator, IndianRupee, Percent, Calendar, PieChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { formatPrice } from '@/lib/utils'

interface EMICalculatorProps {
  initialPrice?: number
  modelName?: string
  onCalculate?: (result: EMIResult) => void
}

export interface EMIResult {
  emi: number
  totalPayment: number
  totalInterest: number
  principal: number
  loanAmount: number
  tenure: number
  interestRate: number
}

const MIN_PRICE = 500000
const MAX_PRICE = 10000000
const MIN_DOWN_PAYMENT_PERCENT = 10
const MAX_DOWN_PAYMENT_PERCENT = 90
const MIN_TENURE = 12
const MAX_TENURE = 84
const MIN_INTEREST = 7
const MAX_INTEREST = 15
const DEFAULT_INTEREST = 8.5

export function EMICalculator({ initialPrice = 1500000, modelName, onCalculate }: EMICalculatorProps) {
  const [price, setPrice] = useState(initialPrice)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [tenure, setTenure] = useState(60)
  const [interestRate, setInterestRate] = useState(DEFAULT_INTEREST)

  const downPayment = useMemo(() => Math.round((price * downPaymentPercent) / 100), [price, downPaymentPercent])
  const loanAmount = useMemo(() => price - downPayment, [price, downPayment])

  const emiResult = useMemo((): EMIResult => {
    const monthlyRate = interestRate / 12 / 100
    const n = tenure

    // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emi =
      monthlyRate > 0
        ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
        : loanAmount / n

    const totalPayment = emi * tenure
    const totalInterest = totalPayment - loanAmount

    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      principal: loanAmount,
      loanAmount,
      tenure,
      interestRate,
    }
  }, [loanAmount, tenure, interestRate])

  const handlePriceChange = useCallback((value: number) => {
    setPrice(Math.max(MIN_PRICE, Math.min(MAX_PRICE, value)))
  }, [])

  const principalPercentage = useMemo(
    () => Math.round((emiResult.principal / emiResult.totalPayment) * 100),
    [emiResult]
  )

  const interestPercentage = 100 - principalPercentage

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-kia-red" />
          EMI Calculator
        </CardTitle>
        <CardDescription>
          {modelName
            ? `Calculate your monthly EMI for ${modelName}`
            : 'Plan your car purchase with our easy EMI calculator'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vehicle Price */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4" />
              Vehicle Price
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={price}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-32 text-right"
                min={MIN_PRICE}
                max={MAX_PRICE}
              />
            </div>
          </div>
          <Slider
            value={[price]}
            onValueChange={([value]) => setPrice(value)}
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={50000}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatPrice(MIN_PRICE)}</span>
            <span>{formatPrice(MAX_PRICE)}</span>
          </div>
        </div>

        {/* Down Payment */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Down Payment ({downPaymentPercent}%)
            </Label>
            <span className="font-semibold">{formatPrice(downPayment)}</span>
          </div>
          <Slider
            value={[downPaymentPercent]}
            onValueChange={([value]) => setDownPaymentPercent(value)}
            min={MIN_DOWN_PAYMENT_PERCENT}
            max={MAX_DOWN_PAYMENT_PERCENT}
            step={5}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{MIN_DOWN_PAYMENT_PERCENT}%</span>
            <span>{MAX_DOWN_PAYMENT_PERCENT}%</span>
          </div>
        </div>

        {/* Loan Tenure */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Loan Tenure
            </Label>
            <span className="font-semibold">
              {tenure} months ({(tenure / 12).toFixed(1)} years)
            </span>
          </div>
          <Slider
            value={[tenure]}
            onValueChange={([value]) => setTenure(value)}
            min={MIN_TENURE}
            max={MAX_TENURE}
            step={6}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{MIN_TENURE} months</span>
            <span>{MAX_TENURE} months</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Interest Rate (p.a.)
            </Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(MIN_INTEREST, Math.min(MAX_INTEREST, Number(e.target.value))))}
                className="w-20 text-right"
                min={MIN_INTEREST}
                max={MAX_INTEREST}
                step={0.1}
              />
              <span className="text-muted-foreground">%</span>
            </div>
          </div>
          <Slider
            value={[interestRate]}
            onValueChange={([value]) => setInterestRate(value)}
            min={MIN_INTEREST}
            max={MAX_INTEREST}
            step={0.1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{MIN_INTEREST}%</span>
            <span>{MAX_INTEREST}%</span>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="mb-4 text-center">
            <p className="text-sm text-muted-foreground">Monthly EMI</p>
            <p className="text-3xl font-bold text-kia-red">{formatPrice(emiResult.emi)}</p>
          </div>

          {/* Breakdown Chart */}
          <div className="mb-4 flex items-center gap-4">
            <div className="relative h-20 w-20">
              <PieChart className="h-20 w-20 text-muted-foreground/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Principal</p>
                  <p className="font-bold">{principalPercentage}%</p>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-kia-red" />
                  Principal
                </span>
                <span className="font-medium">{formatPrice(emiResult.principal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-orange-500" />
                  Interest
                </span>
                <span className="font-medium">{formatPrice(emiResult.totalInterest)}</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Loan Amount</span>
              <span className="font-medium">{formatPrice(loanAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Interest</span>
              <span className="font-medium">{formatPrice(emiResult.totalInterest)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total Payment</span>
              <span>{formatPrice(emiResult.totalPayment)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {onCalculate && (
          <Button variant="kia" className="w-full" onClick={() => onCalculate(emiResult)}>
            Apply for Loan
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default EMICalculator
