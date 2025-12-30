import OpenAI from 'openai'

// Initialize OpenAI client
// Uses OPENAI_API_KEY environment variable
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Model configurations
export const MODELS = {
  chat: 'gpt-4o-mini', // Fast and cost-effective for chat
  embedding: 'text-embedding-3-small', // 1536 dimensions
} as const

// Embedding dimension (must match Prisma schema)
export const EMBEDDING_DIMENSION = 1536
