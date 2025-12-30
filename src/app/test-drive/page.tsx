'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { testDriveSchema, type TestDriveInput } from '@/lib/validations'
import { Calendar, Car, Clock, User, Mail, Phone, CheckCircle2, Loader2 } from 'lucide-react'
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
import { Skeleton } from '@/components/ui/skeleton'

interface Model {
  id: string
  name: string
  slug: string
  modelYear: number
}

const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
]

function TestDriveFormSkeleton() {
  return (
    <div className="py-12">
      <div className="container max-w-4xl">
        <div className="mb-10 text-center">
          <Skeleton className="mx-auto h-6 w-24" />
          <Skeleton className="mx-auto mt-4 h-10 w-64" />
          <Skeleton className="mx-auto mt-4 h-6 w-96 max-w-full" />
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-[600px] w-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

function TestDriveForm() {
  const searchParams = useSearchParams()
  const preselectedModel = searchParams.get('model')

  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TestDriveInput>({
    resolver: zodResolver(testDriveSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      carModelId: '',
      preferredDate: '',
      preferredTime: '',
      preferredContact: 'phone',
      locationNotes: '',
    },
  })

  const formValues = watch()

  // Fetch models on mount
  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch('/api/models')
        const data = await res.json()
        if (data.data?.models) {
          setModels(data.data.models)
          // Set preselected model if provided
          if (preselectedModel) {
            const model = data.data.models.find((m: Model) => m.slug === preselectedModel)
            if (model) {
              setValue('carModelId', model.id)
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch models:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchModels()
  }, [preselectedModel, setValue])

  const onSubmit = async (data: TestDriveInput) => {
    setSubmitError(null)

    try {
      const res = await fetch('/api/test-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: 'website',
        }),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        const responseData = await res.json()
        setSubmitError(responseData.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setSubmitError('Failed to submit. Please try again.')
    }
  }

  // Get minimum date (today)
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
              <h1 className="text-2xl font-bold">Test Drive Booked!</h1>
              <p className="mt-2 text-muted-foreground">
                Thank you for booking a test drive. Our team will contact you shortly to confirm
                your appointment.
              </p>
              <div className="mt-6 rounded-lg bg-muted p-4 text-left">
                <h3 className="font-semibold">Booking Details</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>
                    <strong>Model:</strong>{' '}
                    {models.find((m) => m.id === formValues.carModelId)?.name}
                  </li>
                  <li>
                    <strong>Date:</strong>{' '}
                    {new Date(formValues.preferredDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </li>
                  {formValues.preferredTime && (
                    <li>
                      <strong>Time:</strong> {formValues.preferredTime}
                    </li>
                  )}
                </ul>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <Button variant="kia" asChild>
                  <Link href="/models">Explore More Models</Link>
                </Button>
                <Button variant="outline" asChild>
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
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <Badge variant="kia" className="mb-4">
            <Calendar className="mr-1 h-3 w-3" />
            Book Now
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Book a Test Drive</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Experience the Kia difference. Schedule a test drive at your convenience.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Details</CardTitle>
                <CardDescription>
                  Fill in your details and we&apos;ll get back to you to confirm your test drive.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Info */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        {...register('fullName')}
                        placeholder="Enter your full name"
                        className={errors.fullName ? 'border-destructive' : ''}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-destructive">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email')}
                          placeholder="you@example.com"
                          className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          {...register('phone')}
                          placeholder="+91 98765 43210"
                          className={errors.phone ? 'border-destructive' : ''}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Model Selection */}
                  <div>
                    <Label className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      Select Model *
                    </Label>
                    <Select
                      value={formValues.carModelId}
                      onValueChange={(value) => setValue('carModelId', value)}
                      disabled={loading}
                    >
                      <SelectTrigger className={errors.carModelId ? 'border-destructive' : ''}>
                        <SelectValue placeholder={loading ? 'Loading models...' : 'Select a model'} />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name} ({model.modelYear})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.carModelId && (
                      <p className="mt-1 text-sm text-destructive">{errors.carModelId.message}</p>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="preferredDate" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Preferred Date *
                      </Label>
                      <Input
                        id="preferredDate"
                        type="date"
                        {...register('preferredDate')}
                        min={today}
                        className={errors.preferredDate ? 'border-destructive' : ''}
                      />
                      {errors.preferredDate && (
                        <p className="mt-1 text-sm text-destructive">{errors.preferredDate.message}</p>
                      )}
                    </div>

                    <div>
                      <Label className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Preferred Time
                      </Label>
                      <Select
                        value={formValues.preferredTime}
                        onValueChange={(value) => setValue('preferredTime', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time" />
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

                  {/* Contact Preference */}
                  <div>
                    <Label>Preferred Contact Method</Label>
                    <Select
                      value={formValues.preferredContact}
                      onValueChange={(value) => setValue('preferredContact', value as 'email' | 'phone' | 'whatsapp')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor="locationNotes">Additional Notes</Label>
                    <Textarea
                      id="locationNotes"
                      {...register('locationNotes')}
                      placeholder="Any specific requirements or questions?"
                      rows={3}
                    />
                  </div>

                  {/* Submit Error */}
                  {submitError && (
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                      {submitError}
                    </div>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    variant="kia"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Test Drive
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What to Expect</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-kia-red/10 text-xs font-bold text-kia-red">
                      1
                    </span>
                    <span>Our team will confirm your booking within 24 hours</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-kia-red/10 text-xs font-bold text-kia-red">
                      2
                    </span>
                    <span>Bring a valid driving license for the test drive</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-kia-red/10 text-xs font-bold text-kia-red">
                      3
                    </span>
                    <span>Test drives typically last 30-45 minutes</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-kia-red/10 text-xs font-bold text-kia-red">
                      4
                    </span>
                    <span>A sales consultant will assist you throughout</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Call us for immediate assistance:</p>
                <p className="font-semibold text-foreground">080-4736-3737</p>
                <p className="text-xs">Mon-Sat: 9:00 AM - 6:00 PM</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TestDrivePage() {
  return (
    <Suspense fallback={<TestDriveFormSkeleton />}>
      <TestDriveForm />
    </Suspense>
  )
}
