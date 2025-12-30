'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, RotateCcw, ChevronLeft, ChevronRight, Maximize2, Hand } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Vehicle360ViewerProps {
  modelSlug: string
  modelName: string
  images?: string[] // Array of image URLs for 360° rotation
  galleryImages?: string[] // Additional gallery images
  className?: string
}

export function Vehicle360Viewer({
  modelSlug,
  modelName,
  images,
  galleryImages,
  className,
}: Vehicle360ViewerProps) {
  // For 360° rotation: array of images at different angles
  // If not provided, use single hero image
  const rotationImages = images || [`/models/${modelSlug}.png`]
  const allGalleryImages = galleryImages || []

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const has360Images = rotationImages.length > 1
  const hasGallery = allGalleryImages.length > 0

  // Handle mouse/touch drag for rotation
  const handleDragStart = useCallback((clientX: number) => {
    if (!has360Images) return
    setIsDragging(true)
    setStartX(clientX)
  }, [has360Images])

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging || !has360Images) return

    const delta = clientX - startX
    const sensitivity = 5 // Pixels needed to trigger one step

    if (Math.abs(delta) > sensitivity) {
      const direction = delta > 0 ? 1 : -1
      setCurrentIndex((prev) => {
        const newIndex = prev + direction
        if (newIndex < 0) return rotationImages.length - 1
        if (newIndex >= rotationImages.length) return 0
        return newIndex
      })
      setStartX(clientX)
    }
  }, [isDragging, startX, has360Images, rotationImages.length])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX)
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX)
  const onMouseUp = () => handleDragEnd()
  const onMouseLeave = () => handleDragEnd()

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX)
  const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX)
  const onTouchEnd = () => handleDragEnd()

  // Auto-rotate demo
  const [isAutoRotating, setIsAutoRotating] = useState(false)
  useEffect(() => {
    if (!isAutoRotating || !has360Images) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % rotationImages.length)
    }, 100)
    return () => clearInterval(interval)
  }, [isAutoRotating, has360Images, rotationImages.length])

  // Gallery navigation
  const prevGallery = () => setGalleryIndex((prev) => Math.max(0, prev - 1))
  const nextGallery = () => setGalleryIndex((prev) => Math.min(allGalleryImages.length - 1, prev + 1))

  return (
    <div className={cn('relative', className)}>
      {/* Main Viewer */}
      <div
        ref={containerRef}
        className={cn(
          'relative aspect-[16/10] w-full bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl overflow-hidden',
          has360Images && 'cursor-grab',
          isDragging && 'cursor-grabbing'
        )}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Car Image */}
        <div className="relative w-full h-full">
          <Image
            src={rotationImages[currentIndex]}
            alt={`${modelName} - View ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
            draggable={false}
          />
        </div>

        {/* 360° Indicator */}
        {has360Images && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <Hand className="h-4 w-4" />
            <span>Drag to rotate</span>
          </div>
        )}

        {/* Progress indicator for 360° */}
        {has360Images && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1">
            {rotationImages.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-colors',
                  index === currentIndex ? 'bg-white' : 'bg-white/40'
                )}
              />
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          {has360Images && (
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 bg-white/90 hover:bg-white"
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              title={isAutoRotating ? 'Stop rotation' : 'Auto-rotate'}
            >
              <RotateCcw className={cn('h-4 w-4', isAutoRotating && 'animate-spin')} />
            </Button>
          )}
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 bg-white/90 hover:bg-white"
            onClick={() => setIsFullscreen(true)}
            title="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Gallery Thumbnails */}
      {hasGallery && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Gallery</h3>
            <span className="text-xs text-gray-500">
              {allGalleryImages.length} images
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allGalleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setGalleryIndex(index)
                  setShowGallery(true)
                }}
                className={cn(
                  'flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors',
                  'hover:border-kia-red focus:border-kia-red focus:outline-none'
                )}
              >
                <Image
                  src={image}
                  alt={`${modelName} gallery ${index + 1}`}
                  width={80}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Mode */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="w-full h-full flex items-center justify-center p-8">
              <div
                className={cn(
                  'relative w-full max-w-5xl aspect-video',
                  has360Images && 'cursor-grab',
                  isDragging && 'cursor-grabbing'
                )}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <Image
                  src={rotationImages[currentIndex]}
                  alt={`${modelName} - View ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  draggable={false}
                />
              </div>
            </div>

            {has360Images && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
                <Hand className="h-4 w-4" />
                <span>Drag to rotate • {currentIndex + 1} / {rotationImages.length}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Lightbox */}
      <AnimatePresence>
        {showGallery && hasGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full z-10"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation */}
            {galleryIndex > 0 && (
              <button
                onClick={prevGallery}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/10 rounded-full"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
            )}
            {galleryIndex < allGalleryImages.length - 1 && (
              <button
                onClick={nextGallery}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/10 rounded-full"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            )}

            <div className="w-full h-full flex items-center justify-center p-8">
              <div className="relative w-full max-w-5xl aspect-video">
                <Image
                  src={allGalleryImages[galleryIndex]}
                  alt={`${modelName} gallery ${galleryIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-sm">
              {galleryIndex + 1} / {allGalleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
