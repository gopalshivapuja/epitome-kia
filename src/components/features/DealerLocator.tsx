'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, ExternalLink, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LOCATIONS } from '@/lib/company-data'
import { cn } from '@/lib/utils'

type LocationType = typeof LOCATIONS[number]

export function DealerLocator() {
  const [selectedLocation, setSelectedLocation] = useState<LocationType>(LOCATIONS[0])

  // Convert Google Maps place URL to embed URL
  const getEmbedUrl = (mapUrl: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      // Fallback to static map link if no API key configured
      return ''
    }
    // Extract the place name from the URL for embedding
    const placeMatch = mapUrl.match(/place\/([^/@]+)/)
    if (placeMatch) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
      return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(placeName)}`
    }
    // Fallback to search by address
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(selectedLocation.address)}`
  }

  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden">
      <div className="grid lg:grid-cols-3 gap-0">
        {/* Location List */}
        <div className="bg-white lg:border-r border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Our Showrooms</h3>
            <p className="text-sm text-gray-500">5 locations across Bangalore</p>
          </div>
          <div className="divide-y divide-gray-100 max-h-[400px] lg:max-h-[500px] overflow-y-auto">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className={cn(
                  'w-full text-left p-4 transition-colors hover:bg-gray-50',
                  selectedLocation.id === loc.id && 'bg-gray-900 text-white hover:bg-gray-800'
                )}
              >
                <div className="flex items-start gap-3">
                  <MapPin className={cn(
                    'w-5 h-5 mt-0.5 shrink-0',
                    selectedLocation.id === loc.id ? 'text-white' : 'text-gray-400'
                  )} />
                  <div>
                    <div className="font-medium">
                      {loc.name}
                      {'label' in loc && loc.label && (
                        <span className={cn(
                          'ml-2 text-xs px-2 py-0.5 rounded-full',
                          selectedLocation.id === loc.id
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-100 text-gray-600'
                        )}>
                          {loc.label}
                        </span>
                      )}
                    </div>
                    <p className={cn(
                      'text-sm mt-1 line-clamp-2',
                      selectedLocation.id === loc.id ? 'text-gray-300' : 'text-gray-500'
                    )}>
                      {loc.address}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Map & Details */}
        <div className="lg:col-span-2">
          {/* Map */}
          <div className="aspect-video lg:aspect-auto lg:h-[300px] bg-gray-200">
            <iframe
              src={getEmbedUrl(selectedLocation.mapUrl)}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
              title={`${selectedLocation.name} Location Map`}
            />
          </div>

          {/* Location Details */}
          <div className="p-6 bg-white">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Epitome Kia - {selectedLocation.name}
            </h4>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-600 mt-0.5">{selectedLocation.address}</p>
                </div>
              </div>

              {/* Sales Phone */}
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Sales</p>
                  <div className="mt-0.5 space-y-0.5">
                    {selectedLocation.salesPhone.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone}`}
                        className="block text-sm text-gray-600 hover:text-gray-900"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Service Phone */}
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Service</p>
                  <div className="mt-0.5 space-y-0.5">
                    {selectedLocation.servicePhone.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone}`}
                        className="block text-sm text-gray-600 hover:text-gray-900"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <a
                    href={`mailto:${selectedLocation.email}`}
                    className="text-sm text-gray-600 hover:text-gray-900 mt-0.5 block"
                  >
                    {selectedLocation.email}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3 sm:col-span-2">
                <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Working Hours</p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Monday - Saturday: 9:00 AM - 7:00 PM | Sunday: 10:00 AM - 5:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
              <Button variant="default" size="sm" asChild>
                <a href={selectedLocation.mapUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={`tel:${selectedLocation.salesPhone[0]}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://wa.me/91${selectedLocation.salesPhone[0].replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
