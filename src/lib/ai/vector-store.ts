import { prisma } from '@/lib/db'
import { generateEmbedding } from './embeddings'
import { Prisma } from '@prisma/client'

export interface DocumentChunk {
  id: string
  title: string
  content: string
  source: string
  modelSlug: string | null
  similarity: number
}

/**
 * Store a document with its embedding
 */
export async function storeDocument(
  title: string,
  content: string,
  source: string,
  modelSlug?: string,
  metadata?: Record<string, unknown>,
  chunkIndex: number = 0
): Promise<string> {
  const embedding = await generateEmbedding(content)

  // Use raw SQL to insert with vector type
  const result = await prisma.$queryRaw<{ id: string }[]>`
    INSERT INTO documents (id, title, content, source, model_slug, metadata, chunk_index, embedding, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      ${title},
      ${content},
      ${source},
      ${modelSlug || null},
      ${JSON.stringify(metadata || {})}::jsonb,
      ${chunkIndex},
      ${embedding}::vector,
      NOW(),
      NOW()
    )
    RETURNING id::text
  `

  return result[0].id
}

/**
 * Search for similar documents using vector similarity
 */
export async function searchSimilarDocuments(
  query: string,
  limit: number = 5,
  modelSlug?: string
): Promise<DocumentChunk[]> {
  const queryEmbedding = await generateEmbedding(query)

  // Use cosine distance for similarity search
  // pgvector uses <=> for cosine distance (1 - cosine_similarity)
  let results: DocumentChunk[]

  if (modelSlug) {
    results = await prisma.$queryRaw<DocumentChunk[]>`
      SELECT
        id::text,
        title,
        content,
        source,
        model_slug as "modelSlug",
        1 - (embedding <=> ${queryEmbedding}::vector) as similarity
      FROM documents
      WHERE deleted_at IS NULL
        AND model_slug = ${modelSlug}
        AND embedding IS NOT NULL
      ORDER BY embedding <=> ${queryEmbedding}::vector
      LIMIT ${limit}
    `
  } else {
    results = await prisma.$queryRaw<DocumentChunk[]>`
      SELECT
        id::text,
        title,
        content,
        source,
        model_slug as "modelSlug",
        1 - (embedding <=> ${queryEmbedding}::vector) as similarity
      FROM documents
      WHERE deleted_at IS NULL
        AND embedding IS NOT NULL
      ORDER BY embedding <=> ${queryEmbedding}::vector
      LIMIT ${limit}
    `
  }

  return results
}

/**
 * Delete all documents for a specific source
 */
export async function deleteDocumentsBySource(source: string): Promise<number> {
  const result = await prisma.document.updateMany({
    where: { source, deletedAt: null },
    data: { deletedAt: new Date() },
  })

  return result.count
}

/**
 * Get document count by source
 */
export async function getDocumentStats(): Promise<Record<string, number>> {
  const stats = await prisma.$queryRaw<{ source: string; count: bigint }[]>`
    SELECT source, COUNT(*) as count
    FROM documents
    WHERE deleted_at IS NULL
    GROUP BY source
  `

  return stats.reduce((acc, { source, count }) => {
    acc[source] = Number(count)
    return acc
  }, {} as Record<string, number>)
}
