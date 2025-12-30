import { NextRequest, NextResponse } from 'next/server'
import { openai, MODELS } from '@/lib/ai/client'
import { retrieveContext } from '@/lib/ai/retriever'
import { COMPANY_INFO, LOCATIONS } from '@/lib/company-data'

const SYSTEM_PROMPT = `You are a helpful customer service assistant for ${COMPANY_INFO.name}, an authorized Kia dealership in Bangalore, India. You help customers with:

- Information about Kia vehicles (Seltos, Sonet, Carens, Carnival, EV6, EV9, Syros)
- Test drive bookings
- Service appointments
- Dealership locations and contact information
- Vehicle features, specifications, and pricing
- General automotive queries related to Kia

Guidelines:
1. Be friendly, professional, and helpful
2. Provide accurate information based on the context provided
3. If you don't have specific information, say so and suggest contacting the dealership
4. For pricing, always mention that prices are ex-showroom and may vary
5. Encourage customers to book test drives for a hands-on experience
6. For service-related queries, suggest booking through the website or calling the service center
7. Keep responses concise but informative
8. Use Indian English conventions (e.g., "lakh" for currency)

Contact Information:
- Main Sales: 08047363737
- WhatsApp: +91 7022317666
- Website: epitomekia.com
- Service: 08047363838

Locations: ${LOCATIONS.map(l => l.name).join(', ')}
`

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  message: string
  history?: ChatMessage[]
}

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Chat service not configured' },
        { status: 503 }
      )
    }

    const body: ChatRequest = await request.json()
    const { message, history = [] } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // Retrieve relevant context using RAG
    const { context, sources, modelDetected } = await retrieveContext(message)

    // Build messages array
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ]

    // Add context if available
    if (context) {
      messages.push({
        role: 'system',
        content: `Here is relevant information to help answer the user's question:\n\n${context}\n\nUse this information to provide an accurate and helpful response.`,
      })
    }

    // Add conversation history (limited to last 10 messages)
    const recentHistory = history.slice(-10)
    for (const msg of recentHistory) {
      messages.push({ role: msg.role, content: msg.content })
    }

    // Add current user message
    messages.push({ role: 'user', content: message })

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: MODELS.chat,
      messages,
      max_tokens: 500,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again or contact our team directly.'

    return NextResponse.json({
      success: true,
      data: {
        message: response,
        sources: sources.length > 0 ? sources : undefined,
        modelDetected: modelDetected || undefined,
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)

    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { success: false, error: 'Chat service not configured' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { success: false, error: 'Failed to process your message. Please try again.' },
      { status: 500 }
    )
  }
}
