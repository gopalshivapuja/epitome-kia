'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Shield, Clock, Phone, CheckCircle, Car, FileText, RefreshCw, HeadphonesIcon } from 'lucide-react'
import { CAR_MODELS, COMPANY_INFO, LOCATIONS } from '@/lib/company-data'

const insuranceServices = [
  {
    icon: RefreshCw,
    title: 'Insurance Renewal',
    description: 'Hassle-free renewal of your existing car insurance policy with competitive rates.',
  },
  {
    icon: Shield,
    title: 'Comprehensive Coverage',
    description: 'Full protection against theft, accidents, natural disasters, and third-party liabilities.',
  },
  {
    icon: FileText,
    title: 'Claim Assistance',
    description: 'Expert support for filing and processing insurance claims quickly and efficiently.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Round-the-clock assistance for roadside emergencies and insurance queries.',
  },
]

const insuranceBenefits = [
  'Competitive premium rates',
  'Quick policy issuance',
  'Cashless claim settlement',
  'Network garage access',
  'No claim bonus protection',
  'Personal accident cover',
  'Roadside assistance',
  'Zero depreciation options',
]

export default function InsurancePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      carModel: formData.get('carModel'),
      registrationNumber: formData.get('registrationNumber'),
      insuranceType: formData.get('insuranceType'),
      notes: formData.get('notes'),
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          notes: `Insurance inquiry - Type: ${data.insuranceType}, Model: ${data.carModel}, Reg: ${data.registrationNumber}. ${data.notes || ''}`,
          source: 'insurance_form',
        }),
      })
      if (res.ok) {
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error('Failed to submit form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-kia-midnight via-kia-midnight to-gray-900 text-white py-20 pt-36 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(187,22,43,0.15),transparent_50%)]" />
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-kia-red/20 text-kia-red px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Insurance Services
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Protect Your<br />
                <span className="text-kia-red">Kia Investment</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Comprehensive insurance solutions for your Kia vehicle. Quick renewals, 
                hassle-free claims, and 24/7 support – all under one roof.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-kia-red hover:bg-kia-red-dark" asChild>
                  <a href="#insurance-form">Get a Quote</a>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <a href={`tel:${LOCATIONS[0].salesPhone[0]}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Us
                  </a>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-kia-red/20 rounded-full flex items-center justify-center">
                  <Shield className="w-32 h-32 text-kia-red" />
                </div>
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  Best Rates
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-kia-midnight mb-4">
              Our Insurance Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete insurance solutions tailored for Kia owners
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insuranceServices.map((service) => (
              <Card key={service.title} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-kia-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-8 h-8 text-kia-red" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-kia-midnight mb-6">
                Why Choose {COMPANY_INFO.brand} for Insurance?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                As an authorized Kia dealer, we understand your vehicle better than anyone. 
                Our insurance services are designed specifically for Kia owners.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {insuranceBenefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-kia-midnight to-gray-800 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-kia-red rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Quick Turnaround</h3>
                  <p className="text-gray-300">Policy issued within 30 minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-kia-red rounded-full flex items-center justify-center">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Doorstep Service</h3>
                  <p className="text-gray-300">We come to you for inspections</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-kia-red rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Dedicated Support</h3>
                  <p className="text-gray-300">Personal relationship manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="insurance-form" className="py-20 bg-gray-50">
        <div className="container max-w-3xl mx-auto px-4">
          {isSubmitted ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-kia-midnight mb-4">Request Received!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for your insurance inquiry. Our team will contact you within 24 hours 
                  with the best insurance quotes for your vehicle.
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline">
                  Submit Another Request
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-kia-midnight">Get Insurance Quote</CardTitle>
                <CardDescription className="text-lg">
                  Fill in your details and we&apos;ll get back to you with the best rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="carModel">Car Model *</Label>
                      <Select name="carModel" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your Kia model" />
                        </SelectTrigger>
                        <SelectContent>
                          {CAR_MODELS.map((model) => (
                            <SelectItem key={model.slug} value={model.name}>
                              {model.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insuranceType">Insurance Type *</Label>
                      <Select name="insuranceType" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select insurance type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New Insurance</SelectItem>
                          <SelectItem value="renewal">Policy Renewal</SelectItem>
                          <SelectItem value="transfer">Ownership Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Registration Number (if applicable)</Label>
                    <Input
                      id="registrationNumber"
                      name="registrationNumber"
                      placeholder="KA 01 AB 1234"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Any specific requirements or questions?"
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-kia-red hover:bg-kia-red-dark"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Get Quote'}
                  </Button>

                  <p className="text-center text-sm text-gray-500">
                    By submitting, you agree to our{' '}
                    <a href="/privacy" className="text-kia-red hover:underline">Privacy Policy</a>
                    {' '}and{' '}
                    <a href="/terms" className="text-kia-red hover:underline">Terms of Service</a>
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}

