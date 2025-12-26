'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, MapPin, Calendar, Clock, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LOCATIONS } from '@/lib/company-data'

interface ConsultationModalProps {
  isOpen: boolean
  onClose: () => void
  modelName?: string
}

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
]

function getAvailableDates(): { value: string; label: string }[] {
  const dates: { value: string; label: string }[] = []
  const today = new Date()

  for (let i = 1; i <= 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' })
    const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    dates.push({
      value: date.toISOString().split('T')[0],
      label: `${dayName}, ${dateStr}`
    })
  }
  return dates
}

export function ConsultationModal({ isOpen, onClose, modelName }: ConsultationModalProps) {
  const [consultationType, setConsultationType] = useState<'callback' | 'showroom'>('callback')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    location: LOCATIONS[0].id as string,
    notes: ''
  })

  const availableDates = getAvailableDates()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email || undefined,
          source: 'consultation',
          notes: `Consultation Type: ${consultationType === 'callback' ? 'Phone Callback' : 'Showroom Visit'}
Model Interest: ${modelName || 'General Inquiry'}
Preferred Date: ${formData.preferredDate}
Preferred Time: ${formData.preferredTime}
${consultationType === 'showroom' ? `Location: ${LOCATIONS.find(l => l.id === formData.location)?.name}` : ''}
${formData.notes ? `Additional Notes: ${formData.notes}` : ''}`
        })
      })

      if (response.ok) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error('Failed to submit consultation:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSubmitted(false)
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      preferredDate: '',
      preferredTime: '',
      location: LOCATIONS[0].id,
      notes: ''
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            /* Success State */
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
              >
                <Check className="w-8 h-8 text-green-600" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Consultation Scheduled!
              </h3>
              <p className="text-gray-600 mb-6">
                {consultationType === 'callback'
                  ? "We'll call you at your preferred time."
                  : "We look forward to seeing you at our showroom."}
              </p>
              <Button onClick={handleClose} className="w-full">
                Done
              </Button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Schedule a Consultation
                </h2>
                {modelName && (
                  <p className="text-sm text-gray-500 mt-1">
                    Interested in: {modelName}
                  </p>
                )}
              </div>

              {/* Consultation Type Toggle */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setConsultationType('callback')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                    consultationType === 'callback'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  Phone Callback
                </button>
                <button
                  type="button"
                  onClick={() => setConsultationType('showroom')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                    consultationType === 'showroom'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  Showroom Visit
                </button>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Email (Optional) */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>

              {/* Location (for showroom visits) */}
              {consultationType === 'showroom' && (
                <div className="space-y-1.5">
                  <Label htmlFor="location">Select Showroom *</Label>
                  <select
                    id="location"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} - {loc.address.split(',')[0]}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date Selection */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Preferred Date *
                </Label>
                <select
                  required
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Select a date</option>
                  {availableDates.map((date) => (
                    <option key={date.value} value={date.value}>
                      {date.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Slot Selection */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Preferred Time *
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredTime: slot })}
                      className={`py-2 px-3 text-xs font-medium rounded-md border transition-all ${
                        formData.preferredTime === slot
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !formData.preferredTime || !formData.preferredDate}
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Consultation'}
              </Button>

              <p className="text-xs text-center text-gray-500">
                {consultationType === 'callback'
                  ? "Our team will call you at your preferred time."
                  : "Visit our showroom for a personalized experience."}
              </p>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
