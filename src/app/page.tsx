import { Suspense } from 'react'
import { FullscreenSection } from '@/components/layout/FullscreenSection'
import { Footer } from '@/components/layout/footer'
import { GoogleReviews } from '@/components/features/GoogleReviews'
import { getHomepageSections } from '@/lib/data'

// Loading skeleton for homepage sections
function HomepageSkeleton() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center py-20">
      <div className="container mx-auto px-6 text-center animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto mb-4" />
        <div className="h-6 bg-gray-200 rounded-lg w-48 mx-auto mb-8" />
        <div className="h-6 bg-gray-200 rounded-lg w-32 mx-auto" />
      </div>
    </div>
  )
}

// Async component that fetches homepage sections from database
async function HomeContent() {
  const sections = await getHomepageSections()

  return (
    <>
      {sections.map((section, idx) => (
        <FullscreenSection
          key={section.id}
          title={section.title}
          subtitle={section.subtitle}
          price={section.price ?? undefined}
          imageSrc={section.imageSrc}
          buttons={section.buttons}
          isFirst={idx === 0}
        />
      ))}
    </>
  )
}

export default function Home() {
  return (
    <main className="bg-white">
      <Suspense fallback={<HomepageSkeleton />}>
        <HomeContent />
      </Suspense>

      {/* Customer Reviews Section - fetches from Google Places API */}
      <GoogleReviews />

      <Footer />
    </main>
  )
}
