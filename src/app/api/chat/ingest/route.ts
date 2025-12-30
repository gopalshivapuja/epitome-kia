import { NextRequest, NextResponse } from 'next/server'
import { storeDocument, getDocumentStats, deleteDocumentsBySource } from '@/lib/ai/vector-store'

interface IngestRequest {
  title: string
  content: string
  source: string
  modelSlug?: string
  metadata?: Record<string, unknown>
  chunkIndex?: number
}

// POST /api/chat/ingest - Add a document to the knowledge base
export async function POST(request: NextRequest) {
  try {
    // Basic auth check (should be improved for production)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: IngestRequest = await request.json()
    const { title, content, source, modelSlug, metadata, chunkIndex } = body

    if (!title || !content || !source) {
      return NextResponse.json(
        { success: false, error: 'Title, content, and source are required' },
        { status: 400 }
      )
    }

    const id = await storeDocument(
      title,
      content,
      source,
      modelSlug,
      metadata,
      chunkIndex
    )

    return NextResponse.json({
      success: true,
      data: { id },
    })
  } catch (error) {
    console.error('Ingest error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to ingest document' },
      { status: 500 }
    )
  }
}

// GET /api/chat/ingest - Get document stats
export async function GET() {
  try {
    const stats = await getDocumentStats()
    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({
      success: true,
      data: {},
    })
  }
}

// DELETE /api/chat/ingest - Delete documents by source
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { source } = await request.json()

    if (!source) {
      return NextResponse.json(
        { success: false, error: 'Source is required' },
        { status: 400 }
      )
    }

    const count = await deleteDocumentsBySource(source)

    return NextResponse.json({
      success: true,
      data: { deleted: count },
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete documents' },
      { status: 500 }
    )
  }
}
