import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Clock } from 'lucide-react'

type Props = {
  params: Promise<{ slug: string }>
}

async function getBlogPost(slug: string) {
  const post = await db.blogPost.findFirst({
    where: {
      slug,
      isPublished: true,
      deletedAt: null,
    },
  })
  return post
}

async function getRelatedPosts(currentSlug: string) {
  const posts = await db.blogPost.findMany({
    where: {
      slug: { not: currentSlug },
      isPublished: true,
      deletedAt: null,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      publishedAt: true,
    },
  })
  return posts
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: 'Post Not Found | Epitome Kia Blog',
    }
  }

  return {
    title: post.seoTitle || `${post.title} | Epitome Kia Blog`,
    description: post.seoDescription || post.summary || undefined,
  }
}

function formatDate(date: Date | null) {
  if (!date) return 'Draft'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

function estimateReadTime(content: string | null): number {
  if (!content) return 1
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(slug)
  const readTime = estimateReadTime(post.content)
  const shareUrl = `https://epitomekia.in/blog/${slug}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-kia-midnight via-kia-midnight to-gray-900 text-white py-20 pt-36">
        <div className="container max-w-4xl mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.authorName}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {readTime} min read
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {post.title}
          </h1>

          {post.summary && (
            <p className="text-xl text-gray-300 leading-relaxed">
              {post.summary}
            </p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            {/* Split content by newlines and render paragraphs */}
            {post.content?.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </article>

          {/* Share Section */}
          <div className="border-t border-gray-200 mt-12 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Share2 className="w-5 h-5" />
                <span className="font-semibold">Share this article</span>
              </div>
              <div className="flex gap-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-kia-midnight mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200" />
                  <div className="p-5">
                    <p className="text-sm text-gray-500 mb-2">
                      {formatDate(relatedPost.publishedAt)}
                    </p>
                    <h3 className="font-bold text-kia-midnight group-hover:text-kia-red transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-kia-midnight text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Experience Kia?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Book a test drive today and discover why Kia is the choice of thousands of satisfied customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-kia-red hover:bg-kia-red-dark" asChild>
              <Link href="/test-drive">Book Test Drive</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/models">Explore Models</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

