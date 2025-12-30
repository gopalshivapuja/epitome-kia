import OpenAI from 'openai'

// Lazy-loaded OpenAI client to prevent build-time errors when API key is not set
let _openai: OpenAI | null = null

export function getOpenAI(): OpenAI {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set')
    }
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return _openai
}

// Legacy export for backward compatibility (lazy getter)
export const openai = {
  get chat() {
    return getOpenAI().chat
  },
  get embeddings() {
    return getOpenAI().embeddings
  },
}

// Model configurations
export const MODELS = {
  chat: 'gpt-4o-mini', // Fast and cost-effective for chat
  embedding: 'text-embedding-3-small', // 1536 dimensions
} as const

// Embedding dimension (must match Prisma schema)
export const EMBEDDING_DIMENSION = 1536
