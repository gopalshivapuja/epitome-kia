'use client'

import { useState } from 'react'
import { GlassModal } from '@/components/ui/glass-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface TestDriveModalProps {
    isOpen: boolean
    onClose: () => void
    modelName?: string
}

export function TestDriveModal({ isOpen, onClose, modelName = 'Kia Vehicle' }: TestDriveModalProps) {
    const [date, setDate] = useState<Date>()
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Simulate API call
        setTimeout(() => {
            setSubmitted(true)
        }, 1000)
    }

    return (
        <GlassModal
            isOpen={isOpen}
            onClose={onClose}
            title={submitted ? 'Request Received' : `Test Drive - ${modelName}`}
            className="max-w-md"
        >
            {submitted ? (
                <div className="text-center space-y-4 py-8">
                    <div className="h-16 w-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Thank You!</h3>
                    <p className="text-gray-300">Our sales consultant will contact you shortly to confirm your test drive for the {modelName}.</p>
                    <Button className="mt-6 bg-white text-black hover:bg-gray-200" onClick={onClose}>
                        Close
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                        <Input id="name" placeholder="John Doe" required className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+91 98765 43210" required className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-300">Preferred Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-800" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    className="bg-gray-900 text-white"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Button type="submit" className="w-full bg-kia-red hover:bg-kia-red-dark text-white mt-4">
                        Request Test Drive
                    </Button>
                </form>
            )}
        </GlassModal>
    )
}
