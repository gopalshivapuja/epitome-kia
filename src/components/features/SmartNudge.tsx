'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, GitCompare, ArrowRight, Sparkles, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type NudgeType } from '@/lib/tracking/recommendations'
import { getViewedModels } from '@/lib/tracking/storage'

interface SmartNudgeProps {
  nudgeType: NudgeType
  show: boolean
  onDismiss: () => void
  currentModelSlug?: string
  currentModelName?: string
}

export function SmartNudge({
  nudgeType,
  show,
  onDismiss,
  currentModelSlug,
  currentModelName,
}: SmartNudgeProps) {
  const [viewedModels, setViewedModels] = useState<{ slug: string; name: string }[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const models = getViewedModels().slice(0, 3)
      setViewedModels(models.map((m) => ({ slug: m.slug, name: m.name })))
    }
  }, [])

  const getNudgeContent = () => {
    switch (nudgeType) {
      case 'exit_intent':
        return {
          icon: <Calendar className="h-6 w-6 text-kia-red" />,
          title: 'Wait! Schedule a Test Drive',
          description: currentModelName
            ? `Experience the Kia ${currentModelName} in person before you leave.`
            : 'Experience your favorite Kia model in person.',
          cta: {
            text: 'Book Test Drive',
            href: currentModelSlug
              ? `/test-drive?model=${currentModelSlug}`
              : '/test-drive',
          },
          secondaryCta: null,
        }

      case 'scroll_cta':
        return {
          icon: <Sparkles className="h-6 w-6 text-kia-red" />,
          title: 'Interested in the ' + (currentModelName || 'this model') + '?',
          description: 'Schedule a test drive to experience it firsthand.',
          cta: {
            text: 'Book Test Drive',
            href: currentModelSlug
              ? `/test-drive?model=${currentModelSlug}`
              : '/test-drive',
          },
          secondaryCta: {
            text: 'Configure',
            href: currentModelSlug
              ? `/configure/${currentModelSlug}`
              : '/configure',
          },
        }

      case 'returning_visitor':
        const lastViewed = viewedModels[0]
        return {
          icon: <Clock className="h-6 w-6 text-kia-red" />,
          title: 'Welcome Back!',
          description: lastViewed
            ? `Still interested in the Kia ${lastViewed.name}? Pick up where you left off.`
            : 'Continue exploring our lineup.',
          cta: {
            text: lastViewed ? `View ${lastViewed.name}` : 'Explore Models',
            href: lastViewed ? `/models/${lastViewed.slug}` : '/models',
          },
          secondaryCta: {
            text: 'Book Test Drive',
            href: '/test-drive',
          },
        }

      case 'comparison_suggestion':
        const recentModels = viewedModels.slice(0, 2)
        return {
          icon: <GitCompare className="h-6 w-6 text-kia-red" />,
          title: 'Compare Your Options',
          description:
            recentModels.length >= 2
              ? `Compare the ${recentModels[0].name} and ${recentModels[1].name} side by side.`
              : 'Compare models to find your perfect match.',
          cta: {
            text: 'Compare Now',
            href:
              recentModels.length >= 2
                ? `/compare?models=${recentModels.map((m) => m.slug).join(',')}`
                : '/compare',
          },
          secondaryCta: null,
        }

      case 'test_drive_reminder':
        return {
          icon: <Calendar className="h-6 w-6 text-kia-red" />,
          title: 'Ready for a Test Drive?',
          description: 'The best way to know if a car is right for you is to drive it.',
          cta: {
            text: 'Schedule Now',
            href: '/test-drive',
          },
          secondaryCta: null,
        }

      default:
        return null
    }
  }

  const content = getNudgeContent()
  if (!content) return null

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop for exit intent */}
          {nudgeType === 'exit_intent' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={onDismiss}
            />
          )}

          {/* Modal for exit intent */}
          {nudgeType === 'exit_intent' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
            >
              <button
                onClick={onDismiss}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-kia-red/10 flex items-center justify-center mx-auto mb-4">
                  {content.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{content.title}</h3>
                <p className="text-gray-600 mb-6">{content.description}</p>

                <div className="flex flex-col gap-3">
                  <Link href={content.cta.href}>
                    <Button className="w-full bg-kia-red hover:bg-kia-red-dark">
                      {content.cta.text}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <button
                    onClick={onDismiss}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    No thanks, I&apos;ll keep browsing
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Slide-up banner for other nudges */
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-40 bg-white rounded-xl shadow-lg border p-4"
            >
              <button
                onClick={onDismiss}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-kia-red/10 flex items-center justify-center">
                  {content.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{content.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5 mb-3">{content.description}</p>

                  <div className="flex gap-2">
                    <Link href={content.cta.href}>
                      <Button size="sm" className="bg-kia-red hover:bg-kia-red-dark text-xs">
                        {content.cta.text}
                      </Button>
                    </Link>
                    {content.secondaryCta && (
                      <Link href={content.secondaryCta.href}>
                        <Button size="sm" variant="outline" className="text-xs">
                          {content.secondaryCta.text}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}
