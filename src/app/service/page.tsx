'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Wrench,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Car,
  MapPin,
  CheckCircle2,
  Loader2,
  Shield,
  Droplet,
  Battery,
  Wind,
  Cog,
  FileSearch,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface FormData {
  fullName: string
  email: string
  phone: string
  carModelId: string
  vehicleRegNumber: string
  serviceType: string
  serviceDate: string
  serviceTime: string
  preferredContact: 'email' | 'phone' | 'whatsapp'
  notes: string
}

interface FormErrors {
  [key: string]: string
}

interface Model {
  id: string
  name: string
  slug: string
  modelYear: number
}

const serviceTypes = [
  { value: 'regular_service', label: 'Regular Service', icon: Cog, description: 'Scheduled maintenance' },
  { value: 'oil_change', label: 'Oil Change', icon: Droplet, description: 'Engine oil & filter' },
  { value: 'tire_service', label: 'Tire Service', icon: Shield, description: 'Rotation & alignment' },
  { value: 'battery', label: 'Battery Service', icon: Battery, description: 'Check & replacement' },
  { value: 'ac_service', label: 'AC Service', icon: Wind, description: 'Cooling system' },
  { value: 'inspection', label: 'Vehicle Inspection', icon: FileSearch, description: 'Full checkup' },
  { value: 'repair', label: 'Repairs', icon: Wrench, description: 'General repairs' },
  { value: 'other', label: 'Other', icon: Cog, description: 'Other services' },
]

const timeSlots = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
]

export default function ServicePage() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    carModelId: '',
    vehicleRegNumber: '',
    serviceType: '',
    serviceDate: '',
    serviceTime: '',
    preferredContact: 'phone',
    notes: '',
  })

  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch('/api/models')
        const data = await res.json()
        if (data.data) {
          setModels(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch models:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchModels()
  }, [])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName || formData.fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters'
    }

    if (!formData.email && !formData.phone) {
      newErrors.email = 'Either email or phone is required'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }

    if (formData.phone && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number'
    }

    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service type'
    }

    if (!formData.serviceDate) {
      newErrors.serviceDate = 'Please select a date'
    } else {
      const selectedDate = new Date(formData.serviceDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.serviceDate = 'Date must be today or in the future'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)

    try {
      const res = await fetch('/api/service-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'website',
        }),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json()
        setErrors({ submit: data.error || 'Something went wrong. Please try again.' })
      }
    } catch {
      setErrors({ submit: 'Failed to submit. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const today = new Date().toISOString().split('T')[0]

  if (submitted) {
    return (
      <div className="py-12">
        <div className="container max-w-lg">
          <Card className="text-center">
            <CardContent className="pt-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold">Service Booked!</h1>
              <p className="mt-2 text-muted-foreground">
                Your service appointment has been scheduled. We&apos;ll send you a confirmation
                shortly.
              </p>
              <div className="mt-6 rounded-lg bg-muted p-4 text-left">
                <h3 className="font-semibold">Appointment Details</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>
                    <strong>Service:</strong>{' '}
                    {serviceTypes.find((s) => s.value === formData.serviceType)?.label}
                  </li>
                  <li>
                    <strong>Date:</strong>{' '}
                    {new Date(formData.serviceDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </li>
                  {formData.serviceTime && (
                    <li>
                      <strong>Time:</strong> {formData.serviceTime}
                    </li>
                  )}
                  {formData.vehicleRegNumber && (
                    <li>
                      <strong>Vehicle:</strong> {formData.vehicleRegNumber}
                    </li>
                  )}
                </ul>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <Button variant="kia" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-10 text-center">
          <Badge variant="kia" className="mb-4">
            <Wrench className="mr-1 h-3 w-3" />
            Service Center
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Service & Maintenance
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Keep your Kia running at its best. Book a service appointment with our expert
            technicians.
          </p>
        </div>

        {!showForm ? (
          <>
            {/* Service Types Grid */}
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-center text-xl font-semibold">Our Services</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {serviceTypes.slice(0, -1).map((service) => (
                  <Card
                    key={service.value}
                    className="cursor-pointer transition-all hover:border-kia-red hover:shadow-md"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, serviceType: service.value }))
                      setShowForm(true)
                    }}
                  >
                    <CardContent className="pt-6 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-kia-red/10">
                        <service.icon className="h-6 w-6 text-kia-red" />
                      </div>
                      <h3 className="font-semibold">{service.label}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button variant="kia" size="lg" onClick={() => setShowForm(true)}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Service Appointment
                </Button>
              </div>
            </div>

            {/* Benefits */}
            <div className="mx-auto mt-16 max-w-4xl">
              <h2 className="mb-6 text-center text-xl font-semibold">Why Service with Us?</h2>
              <div className="grid gap-6 sm:grid-cols-3">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold">Genuine Parts</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      We only use genuine Kia parts for all repairs and replacements.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <Wrench className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold">Expert Technicians</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Kia-certified technicians with specialized training and tools.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold">Quick Turnaround</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Efficient service to get you back on the road quickly.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <div className="mx-auto max-w-2xl">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => setShowForm(false)}
            >
              &larr; Back to Services
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>Book Service Appointment</CardTitle>
                <CardDescription>
                  Fill in your details and we&apos;ll schedule your service appointment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="fullName" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                        className={errors.fullName ? 'border-destructive' : ''}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-destructive">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        className={errors.phone ? 'border-destructive' : ''}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-destructive">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="you@example.com"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  {/* Vehicle Info */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        Vehicle Model
                      </Label>
                      <Select
                        value={formData.carModelId}
                        onValueChange={(value) => handleChange('carModelId', value)}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={loading ? 'Loading...' : 'Select model'} />
                        </SelectTrigger>
                        <SelectContent>
                          {models.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.name} ({model.modelYear})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="vehicleRegNumber">Vehicle Registration</Label>
                      <Input
                        id="vehicleRegNumber"
                        value={formData.vehicleRegNumber}
                        onChange={(e) => handleChange('vehicleRegNumber', e.target.value)}
                        placeholder="MH 01 AB 1234"
                      />
                    </div>
                  </div>

                  {/* Service Type */}
                  <div>
                    <Label className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      Service Type *
                    </Label>
                    <Select
                      value={formData.serviceType}
                      onValueChange={(value) => handleChange('serviceType', value)}
                    >
                      <SelectTrigger className={errors.serviceType ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            {service.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.serviceType && (
                      <p className="mt-1 text-sm text-destructive">{errors.serviceType}</p>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="serviceDate" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Preferred Date *
                      </Label>
                      <Input
                        id="serviceDate"
                        type="date"
                        value={formData.serviceDate}
                        onChange={(e) => handleChange('serviceDate', e.target.value)}
                        min={today}
                        className={errors.serviceDate ? 'border-destructive' : ''}
                      />
                      {errors.serviceDate && (
                        <p className="mt-1 text-sm text-destructive">{errors.serviceDate}</p>
                      )}
                    </div>

                    <div>
                      <Label className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Preferred Time
                      </Label>
                      <Select
                        value={formData.serviceTime}
                        onValueChange={(value) => handleChange('serviceTime', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      placeholder="Describe any issues or specific requirements"
                      rows={3}
                    />
                  </div>

                  {errors.submit && (
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                      {errors.submit}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="kia"
                    size="lg"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Appointment
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
