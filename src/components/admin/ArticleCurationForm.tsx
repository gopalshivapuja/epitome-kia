'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Link2, Check, X, ExternalLink, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScrapedArticle {
  title: string
  source: string
  sourceUrl: string
  thumbnailUrl?: string
  publishedDate?: string
  description?: string
  kiaTags: string[]
  sentiment: string
}

const KIA_MODELS = [
  'seltos',
  'sonet',
  'carens',
  'carnival',
  'ev6',
  'ev9',
  'syros',
  'clavis',
  'kia',
]

export function ArticleCurationForm() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scrapedData, setScrapedData] = useState<ScrapedArticle | null>(null)

  // Editable fields
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [kiaTags, setKiaTags] = useState<string[]>([])
  const [sentiment, setSentiment] = useState('positive')

  const handleScrape = async () => {
    if (!url.trim()) return

    setLoading(true)
    setError(null)
    setScrapedData(null)

    try {
      const response = await fetch('/api/articles/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.error || 'Failed to scrape article')
        return
      }

      const data = result.data as ScrapedArticle
      setScrapedData(data)
      setTitle(data.title)
      setSummary(data.description || '')
      setKiaTags(data.kiaTags || [])
      setSentiment(data.sentiment || 'positive')
    } catch (err) {
      setError('Failed to scrape article. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (approve: boolean) => {
    if (!scrapedData) return

    setSaving(true)
    setError(null)

    try {
      // First create the article
      const createResponse = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          source: scrapedData.source,
          sourceUrl: scrapedData.sourceUrl,
          summary,
          thumbnailUrl: scrapedData.thumbnailUrl,
          publishedDate: scrapedData.publishedDate,
          kiaTags,
          sentiment,
        }),
      })

      const createResult = await createResponse.json()

      if (!createResult.success) {
        setError(createResult.error || 'Failed to save article')
        return
      }

      // If approve is true, also approve the article
      if (approve && createResult.data?.id) {
        await fetch(`/api/articles/${createResult.data.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isApproved: true }),
        })
      }

      // Reset form
      setUrl('')
      setScrapedData(null)
      setTitle('')
      setSummary('')
      setKiaTags([])
      setSentiment('positive')

      // Refresh the page to show new article
      router.refresh()
    } catch (err) {
      setError('Failed to save article. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const toggleTag = (tag: string) => {
    if (kiaTags.includes(tag)) {
      setKiaTags(kiaTags.filter((t) => t !== tag))
    } else {
      setKiaTags([...kiaTags, tag])
    }
  }

  const handleReset = () => {
    setScrapedData(null)
    setTitle('')
    setSummary('')
    setKiaTags([])
    setSentiment('positive')
    setError(null)
  }

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            placeholder="Paste article URL (e.g., https://www.autocarindia.com/...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading || !!scrapedData}
          />
        </div>
        {!scrapedData ? (
          <Button onClick={handleScrape} disabled={loading || !url.trim()}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4 mr-2" />
                Fetch Article
              </>
            )}
          </Button>
        ) : (
          <Button variant="outline" onClick={handleReset}>
            <X className="h-4 w-4 mr-2" />
            Reset
          </Button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Scraped Data Preview */}
      {scrapedData && (
        <div className="border rounded-lg p-6 space-y-6 bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="outline">{scrapedData.source}</Badge>
              <a
                href={scrapedData.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                View Original <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            {scrapedData.thumbnailUrl && (
              <img
                src={scrapedData.thumbnailUrl}
                alt="Thumbnail"
                className="w-24 h-16 object-cover rounded"
              />
            )}
          </div>

          {/* Editable Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white"
            />
          </div>

          {/* Editable Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary">Summary / Brief</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Add a 2-3 sentence summary of the article..."
              rows={3}
              className="bg-white"
            />
            <p className="text-xs text-muted-foreground">
              This summary will appear on the blog page. Keep it brief and informative.
            </p>
          </div>

          {/* Kia Model Tags */}
          <div className="space-y-2">
            <Label>
              <Tag className="h-4 w-4 inline mr-2" />
              Kia Model Tags
            </Label>
            <div className="flex flex-wrap gap-2">
              {KIA_MODELS.map((model) => (
                <Badge
                  key={model}
                  variant={kiaTags.includes(model) ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer capitalize transition-colors',
                    kiaTags.includes(model)
                      ? 'bg-kia-red hover:bg-kia-red-dark'
                      : 'hover:bg-gray-100'
                  )}
                  onClick={() => toggleTag(model)}
                >
                  {kiaTags.includes(model) && <Check className="h-3 w-3 mr-1" />}
                  {model}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sentiment */}
          <div className="space-y-2">
            <Label htmlFor="sentiment">Sentiment</Label>
            <Select value={sentiment} onValueChange={setSentiment}>
              <SelectTrigger className="w-48 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={() => handleSave(true)}
              disabled={saving || !title.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Save & Approve
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={saving || !title.trim()}
            >
              Save as Draft
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
