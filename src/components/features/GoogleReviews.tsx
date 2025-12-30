'use client'

import { ReactGoogleReviews } from 'react-google-reviews'
import 'react-google-reviews/dist/index.css'

interface GoogleReviewsProps {
    featurableWidgetId?: string
}

export function GoogleReviews({ featurableWidgetId }: GoogleReviewsProps) {
    // If no widget ID provided, show placeholder
    if (!featurableWidgetId) {
        return (
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="container">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            What Our Customers Say
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            See why thousands of customers trust Epitome Kia for their automotive needs
                        </p>
                    </div>
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-sm">
                            Customer reviews coming soon.
                        </p>
                        <p className="text-xs mt-2">
                            Configure Featurable Widget ID to display Google Reviews.
                        </p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 md:py-20 bg-gray-50">
            <div className="container">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        See why thousands of customers trust Epitome Kia for their automotive needs
                    </p>
                </div>
                <div className="max-w-6xl mx-auto">
                    <ReactGoogleReviews
                        layout="carousel"
                        featurableId={featurableWidgetId}
                        carouselSpeed={5000}
                        carouselAutoplay={true}
                        maxCharacters={200}
                        dateDisplay="relative"
                        reviewVariant="card"
                        theme="light"
                    />
                </div>
            </div>
        </section>
    )
}
