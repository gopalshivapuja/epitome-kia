import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/db'

// Force dynamic rendering - no static generation at build time
export const dynamic = 'force-dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog | Epitome Kia',
  description: 'Stay updated with the latest news, tips, and stories from Epitome Kia. Expert insights on Kia vehicles, maintenance, and more.',
}

async function getBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      deletedAt: null,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      authorName: true,
      publishedAt: true,
    },
  })
  return posts
}

function formatDate(date: Date | null) {
  if (!date) return 'Draft'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-kia-midnight via-kia-midnight to-gray-900 text-white py-20 pt-36 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(187,22,43,0.15),transparent_50%)]" />
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-kia-red/20 text-kia-red px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Epitome Kia Blog
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Insights, Tips &<br />
              <span className="text-kia-red">Kia Stories</span>
            </h1>
            <p className="text-xl text-gray-300">
              Your go-to source for everything Kia – from maintenance tips to the latest model updates, 
              driving experiences, and industry insights.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-600 mb-2">No Posts Yet</h2>
              <p className="text-gray-500">
                We&apos;re working on some great content. Check back soon!
              </p>
            </div>
          ) : (
            <>
              {/* Featured Post (first post) */}
              {posts[0] && (
                <Link href={`/blog/${posts[0].slug}`} className="block mb-12 group">
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/2 bg-gradient-to-br from-kia-midnight to-gray-800 p-8 flex items-center justify-center">
                        <div className="text-center text-white">
                          <BookOpen className="w-24 h-24 mx-auto mb-4 opacity-50" />
                          <Badge className="bg-kia-red">Featured</Badge>
                        </div>
                      </div>
                      <div className="md:w-1/2 p-8">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(posts[0].publishedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {posts[0].authorName}
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-kia-midnight mb-4 group-hover:text-kia-red transition-colors">
                          {posts[0].title}
                        </h2>
                        <p className="text-gray-600 mb-6 line-clamp-3">
                          {posts[0].summary}
                        </p>
                        <span className="inline-flex items-center text-kia-red font-semibold group-hover:gap-3 transition-all gap-2">
                          Read More <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              )}

              {/* Rest of the posts */}
              {posts.length > 1 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.slice(1).map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-gray-400" />
                        </div>
                        <CardHeader>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(post.publishedAt)}
                            </span>
                          </div>
                          <CardTitle className="group-hover:text-kia-red transition-colors line-clamp-2">
                            {post.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {post.authorName}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 line-clamp-3 mb-4">
                            {post.summary}
                          </p>
                          <span className="inline-flex items-center text-kia-red font-semibold text-sm group-hover:gap-2 transition-all gap-1">
                            Read More <ArrowRight className="w-4 h-4" />
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-kia-midnight text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay in the Loop
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest updates on Kia models, 
            maintenance tips, exclusive offers, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-kia-red"
            />
            <button className="bg-kia-red hover:bg-kia-red-dark px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

