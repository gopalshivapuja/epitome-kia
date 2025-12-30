import { searchSimilarDocuments, DocumentChunk } from './vector-store'
import { CAR_MODELS, LOCATIONS, COMPANY_INFO } from '@/lib/company-data'

/**
 * Detect which Kia model the query is about (if any)
 */
function detectKiaModel(query: string): string | null {
  const lowerQuery = query.toLowerCase()

  for (const model of CAR_MODELS) {
    if (lowerQuery.includes(model.slug) || lowerQuery.includes(model.name.toLowerCase())) {
      return model.slug
    }
  }

  return null
}

/**
 * Build context string from retrieved documents
 */
function buildContext(documents: DocumentChunk[]): string {
  if (documents.length === 0) {
    return ''
  }

  return documents
    .map((doc, i) => {
      const header = doc.modelSlug
        ? `[Source: ${doc.source} - ${doc.modelSlug.toUpperCase()}]`
        : `[Source: ${doc.source}]`
      return `${header}\n${doc.content}`
    })
    .join('\n\n---\n\n')
}

/**
 * Get dealership context (always include for location/contact questions)
 */
function getDealershipContext(): string {
  const locations = LOCATIONS.map(loc => {
    return `- ${loc.name}${loc.label ? ` (${loc.label})` : ''}: ${loc.address}
  Sales: ${loc.salesPhone.join(', ')}
  Service: ${loc.servicePhone.join(', ')}
  Email: ${loc.email}`
  }).join('\n')

  return `
Epitome Kia Dealership Information:
${COMPANY_INFO.name} - ${COMPANY_INFO.tagline}
${COMPANY_INFO.description}

Showroom Locations:
${locations}
`
}

/**
 * Get car models context
 */
function getCarModelsContext(): string {
  return CAR_MODELS
    .filter(m => !m.isComingSoon)
    .map(m => `- ${m.name}: ${m.tagline} - Starting from ${m.startingPrice}`)
    .join('\n')
}

/**
 * Determine if query needs dealership context
 */
function needsDealershipContext(query: string): boolean {
  const keywords = [
    'location', 'address', 'showroom', 'dealership', 'contact',
    'phone', 'number', 'email', 'where', 'visit', 'hours',
    'open', 'close', 'direction', 'yelahanka', 'whitefield',
    'avalahalli', 'kolar', 'varthur', 'bangalore', 'bengaluru'
  ]
  const lowerQuery = query.toLowerCase()
  return keywords.some(k => lowerQuery.includes(k))
}

/**
 * Determine if query needs car models context
 */
function needsCarModelsContext(query: string): boolean {
  const keywords = [
    'price', 'cost', 'model', 'car', 'vehicle', 'buy', 'purchase',
    'available', 'lineup', 'range', 'starting', 'which', 'compare'
  ]
  const lowerQuery = query.toLowerCase()
  return keywords.some(k => lowerQuery.includes(k))
}

export interface RetrievalResult {
  context: string
  sources: string[]
  modelDetected: string | null
}

/**
 * Retrieve relevant context for a user query
 */
export async function retrieveContext(
  query: string,
  maxDocuments: number = 5
): Promise<RetrievalResult> {
  const contexts: string[] = []
  const sources: Set<string> = new Set()

  // Detect if query is about a specific model
  const modelDetected = detectKiaModel(query)

  // Always try to get relevant documents from vector store
  try {
    const documents = await searchSimilarDocuments(query, maxDocuments, modelDetected || undefined)

    // Filter by similarity threshold
    const relevantDocs = documents.filter(d => d.similarity > 0.7)

    if (relevantDocs.length > 0) {
      contexts.push(buildContext(relevantDocs))
      relevantDocs.forEach(d => sources.add(d.source))
    }
  } catch (error) {
    // Vector store might not be available (no documents ingested)
    console.log('Vector search not available:', error)
  }

  // Add dealership context if relevant
  if (needsDealershipContext(query)) {
    contexts.push(getDealershipContext())
    sources.add('dealership-info')
  }

  // Add car models context if relevant
  if (needsCarModelsContext(query)) {
    contexts.push('Kia India Models:\n' + getCarModelsContext())
    sources.add('kia-models')
  }

  return {
    context: contexts.join('\n\n---\n\n'),
    sources: Array.from(sources),
    modelDetected,
  }
}
