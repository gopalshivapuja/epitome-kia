import { Metadata } from 'next'
import Image from 'next/image'
import { Building2, Award, Users, MapPin } from 'lucide-react'
import { COMPANY_INFO, LOCATIONS } from '@/lib/company-data'

export const metadata: Metadata = {
    title: 'About Us | Epitome Kia',
    description: 'Learn about Epitome Automobiles, your authorized Kia sales, service, and spares dealer in Bangalore.',
}

export default function AboutPage() {
    return (
        <div className="flex flex-col bg-black text-white min-h-screen">
            {/* Hero */}
            <section className="pt-32 pb-16 relative">
                <div className="container text-center relative z-10">
                    <span className="text-kia-red text-sm uppercase tracking-widest font-medium">Our Story</span>
                    <h1 className="mt-4 text-4xl font-heading font-bold md:text-6xl">
                        Driving Excellence<br />in Bangalore
                    </h1>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20">
                <div className="container grid gap-16 lg:grid-cols-2 lg:items-center">
                    <div>
                        <h2 className="mb-6 text-3xl font-bold font-heading">
                            Welcome to {COMPANY_INFO.brand}
                        </h2>
                        <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
                            <p>
                                <strong className="text-white">{COMPANY_INFO.name}</strong> is an authorized sales, service &amp; spares dealer for Kia India.
                                We are a promising dealer present across multiple prime locations in Bangalore and beyond.
                            </p>
                            <p>
                                With showrooms in{' '}
                                <strong className="text-white">
                                    {LOCATIONS.map(l => l.name).join(', ')}
                                </strong>,
                                we are committed to providing world-class automotive services to our valued customers.
                            </p>
                            <p>
                                Our mission is to deliver the &quot;{COMPANY_INFO.tagline}&quot; philosophy through exceptional customer service,
                                transparency, and a passion for automotive innovation. Whether you are looking for the latest Kia Seltos,
                                Sonet, Carens, or the futuristic EV6, {COMPANY_INFO.brand} is your trusted partner for every journey.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="bg-zinc-900 p-8 rounded-2xl text-center">
                            <Building2 className="mx-auto h-12 w-12 text-kia-red mb-4" />
                            <h3 className="text-2xl font-bold mb-2">{LOCATIONS.length}+</h3>
                            <p className="text-gray-400">Showrooms</p>
                        </div>
                        <div className="bg-zinc-900 p-8 rounded-2xl text-center">
                            <Award className="mx-auto h-12 w-12 text-kia-red mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Authorized</h3>
                            <p className="text-gray-400">Kia Dealer</p>
                        </div>
                        <div className="bg-zinc-900 p-8 rounded-2xl text-center sm:col-span-2">
                            <Users className="mx-auto h-12 w-12 text-kia-red mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Customer First</h3>
                            <p className="text-gray-400">Dedicated to your satisfaction</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Locations Preview */}
            <section className="py-20 bg-zinc-900">
                <div className="container">
                    <h2 className="text-3xl font-bold font-heading text-center mb-12">Our Locations</h2>
                    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                        {LOCATIONS.map((loc) => (
                            <div key={loc.id} className="bg-zinc-800 p-6 rounded-xl text-center hover:bg-zinc-700 transition-colors">
                                <MapPin className="mx-auto h-8 w-8 text-kia-red mb-3" />
                                <h3 className="font-bold text-lg">{loc.name}</h3>
                                {'label' in loc && (
                                    <span className="text-xs text-kia-red">{loc.label}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
