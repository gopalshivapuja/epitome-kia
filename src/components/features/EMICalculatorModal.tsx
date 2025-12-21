'use client'

import { useState, useEffect } from 'react'
import { GlassModal } from '@/components/ui/glass-modal'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface EMICalculatorModalProps {
    isOpen: boolean
    onClose: () => void
    basePrice?: number
    modelName?: string
}

export function EMICalculatorModal({ isOpen, onClose, basePrice = 1000000, modelName = 'Kia Vehicle' }: EMICalculatorModalProps) {
    const [loanAmount, setLoanAmount] = useState(basePrice * 0.8)
    const [interestRate, setInterestRate] = useState(9.5)
    const [tenure, setTenure] = useState(60) // months
    const [emi, setEmi] = useState(0)

    useEffect(() => {
        // EMI Calculation: P * r * (1+r)^n / ((1+r)^n - 1)
        const r = interestRate / 12 / 100
        const n = tenure
        const calculatedEmi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
        setEmi(Math.round(calculatedEmi))
    }, [loanAmount, interestRate, tenure])

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value)
    }

    return (
        <GlassModal
            isOpen={isOpen}
            onClose={onClose}
            title={`EMI Calculator - ${modelName}`}
            className="max-w-md"
        >
            <div className="space-y-8">
                {/* Results Display */}
                <div className="text-center space-y-2 p-6 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-sm text-gray-400">Estimated Monthly EMI</p>
                    <div className="text-4xl font-heading font-bold text-kia-red">
                        {formatCurrency(emi)}
                    </div>
                    <p className="text-xs text-gray-500">*Excluding taxes & insurance</p>
                </div>

                {/* Sliders */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <Label className="text-gray-300">Loan Amount</Label>
                            <span className="font-mono text-white">{formatCurrency(loanAmount)}</span>
                        </div>
                        <Slider
                            value={[loanAmount]}
                            min={100000}
                            max={3000000}
                            step={10000}
                            onValueChange={(val) => setLoanAmount(val[0])}
                            className="py-2"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <Label className="text-gray-300">Interest Rate</Label>
                            <span className="font-mono text-white">{interestRate}%</span>
                        </div>
                        <Slider
                            value={[interestRate]}
                            min={5}
                            max={20}
                            step={0.1}
                            onValueChange={(val) => setInterestRate(val[0])}
                            className="py-2"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <Label className="text-gray-300">Tenure</Label>
                            <span className="font-mono text-white">{tenure} Months</span>
                        </div>
                        <Slider
                            value={[tenure]}
                            min={12}
                            max={84}
                            step={12}
                            onValueChange={(val) => setTenure(val[0])}
                            className="py-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500 px-1">
                            <span>1 Yr</span>
                            <span>7 Yrs</span>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="pt-4">
                    <Button className="w-full bg-white text-black hover:bg-gray-200" onClick={onClose}>
                        Apply for Finance
                    </Button>
                </div>
            </div>
        </GlassModal>
    )
}
