import { Suspense } from 'react'
import { prisma } from '@/lib/db'

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FileText,
  Newspaper,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
} from 'lucide-react'
import Link from 'next/link'

async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return posts
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

async function getPages() {
  try {
    const pages = await prisma.page.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    })
    return pages
  } catch (error) {
    console.error('Error fetching pages:', error)
    return []
  }
}

async function getContentStats() {
  try {
    const [totalPosts, publishedPosts, draftPosts, totalPages] =
      await Promise.all([
        prisma.blogPost.count({ where: { deletedAt: null } }),
        prisma.blogPost.count({
          where: { deletedAt: null, isPublished: true },
        }),
        prisma.blogPost.count({
          where: { deletedAt: null, isPublished: false },
        }),
        prisma.page.count({ where: { deletedAt: null } }),
      ])
    return { totalPosts, publishedPosts, draftPosts, totalPages }
  } catch (error) {
    console.error('Error fetching content stats:', error)
    return { totalPosts: 0, publishedPosts: 0, draftPosts: 0, totalPages: 0 }
  }
}

function formatDate(date: Date | null) {
  if (!date) return 'Not set'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

async function BlogPostsTable() {
  const posts = await getBlogPosts()

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No blog posts yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first blog post to engage with customers.
        </p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Published</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{post.title}</span>
                <span className="text-sm text-muted-foreground">
                  /{post.slug}
                </span>
              </div>
            </TableCell>
            <TableCell>{post.authorName || 'Unknown'}</TableCell>
            <TableCell>
              {post.isPublished ? (
                <Badge className="bg-green-100 text-green-800">Published</Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
              )}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDate(post.publishedAt)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                {post.isPublished && (
                  <Link href={`/blog/${post.slug}`} target="_blank">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

async function PagesTable() {
  const pages = await getPages()

  if (pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No pages yet</h3>
        <p className="text-muted-foreground mb-4">
          Create custom pages for your website.
        </p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Page
        </Button>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pages.map((page) => (
          <TableRow key={page.id}>
            <TableCell className="font-medium">{page.title}</TableCell>
            <TableCell className="text-muted-foreground">/{page.slug}</TableCell>
            <TableCell>
              {page.isPublished ? (
                <Badge className="bg-green-100 text-green-800">Published</Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
              )}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDate(page.updatedAt)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                {page.isPublished && (
                  <Link href={`/${page.slug}`} target="_blank">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

async function ContentStats() {
  const stats = await getContentStats()

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          <Newspaper className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPosts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Published</CardTitle>
          <Eye className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.publishedPosts}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          <EyeOff className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {stats.draftPosts}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pages</CardTitle>
          <FileText className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalPages}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content</h1>
          <p className="text-muted-foreground">
            Manage blog posts, pages, and other content.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Content
        </Button>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <ContentStats />
      </Suspense>

      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="posts">Blog Posts</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Blog Posts</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading posts...</div>}>
                <BlogPostsTable />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pages</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Page
              </Button>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading pages...</div>}>
                <PagesTable />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
