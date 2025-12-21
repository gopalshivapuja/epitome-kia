import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
      <div className="text-center px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-12 h-12 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-kia-midnight mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, the blog post you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-kia-red hover:bg-kia-red-dark">
            <Link href="/blog">Back to Blog</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

