import { NextRequest } from 'next/server'
import { z } from 'zod'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'
import { openai } from '@/lib/ai/client'

// Input schema for recommendation request
const recommendationInputSchema = z.object({
  viewedModels: z.array(
    z.object({
      slug: z.string(),
      name: z.string(),
      timeSpent: z.number().optional(),
    })
  ),
  interests: z
    .object({
      budget: z
        .object({
          min: z.number().optional(),
          max: z.number().optional(),
        })
        .optional(),
      fuelType: z.array(z.string()).optional(),
      bodyType: z.array(z.string()).optional(),
      features: z.array(z.string()).optional(),
    })
    .optional(),
  currentModel: z.string().optional(),
})

// Kia India model catalog for context
const KIA_CATALOG = `
Available Kia Models in India:

1. Kia Seltos (Compact SUV)
   - Price: ₹10.99 - 19.99 Lakh
   - Engines: 1.5L Petrol, 1.5L Diesel, 1.4L Turbo Petrol
   - Key Features: ADAS Level 2, Panoramic Sunroof, 360° Camera, BOSE Audio
   - Best For: Tech enthusiasts, families wanting premium features

2. Kia Sonet (Sub-compact SUV)
   - Price: ₹7.99 - 15.99 Lakh
   - Engines: 1.2L Petrol, 1.0L Turbo, 1.5L Diesel
   - Key Features: Clutchless Manual (iMT), Sunroof, Connected Car Tech
   - Best For: City commuters, first-time SUV buyers

3. Kia Carens (MPV)
   - Price: ₹10.99 - 20.99 Lakh
   - Engines: 1.5L Petrol, 1.5L Diesel, 1.4L Turbo
   - Seating: 6 or 7 seats
   - Key Features: 64-color Ambient Lighting, Captain Seats, BOSE Audio
   - Best For: Large families, those needing space and versatility

4. Kia Carnival (Premium MPV)
   - Price: ₹33.00 - 36.50 Lakh
   - Engine: 2.2L Diesel
   - Key Features: VIP Seats, Premium Interior, Sliding Doors
   - Best For: Executives, luxury MPV seekers

5. Kia EV6 (Electric SUV)
   - Price: ₹60.00 - 65.00 Lakh
   - Range: 528 km
   - Key Features: 800V Architecture, Fast Charging (10-80% in 18 mins)
   - Best For: Premium EV buyers, performance enthusiasts

6. Kia EV9 (Electric SUV - Flagship)
   - Price: ₹1.25 Crore
   - Range: 500+ km
   - Key Features: 3-row seating, Flagship technology, Level 3 autonomy
   - Best For: Ultra-luxury EV buyers

All Kia vehicles come with:
- 7-year/unlimited km warranty (best in segment)
- Connected car features (Kia Connect)
- RSA (Roadside Assistance)
`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input = recommendationInputSchema.parse(body)

    // Build the prompt based on user behavior
    let userContext = 'User browsing behavior:\n'

    if (input.viewedModels.length > 0) {
      userContext += '\nViewed Models:\n'
      input.viewedModels.forEach((model) => {
        userContext += `- ${model.name}${model.timeSpent ? ` (spent ${model.timeSpent}s)` : ''}\n`
      })
    }

    if (input.interests) {
      userContext += '\nInferred Interests:\n'
      if (input.interests.budget) {
        userContext += `- Budget: ₹${(input.interests.budget.min || 0) / 100000} - ${(input.interests.budget.max || 0) / 100000} Lakh\n`
      }
      if (input.interests.fuelType?.length) {
        userContext += `- Fuel preference: ${input.interests.fuelType.join(', ')}\n`
      }
      if (input.interests.bodyType?.length) {
        userContext += `- Body type preference: ${input.interests.bodyType.join(', ')}\n`
      }
    }

    if (input.currentModel) {
      userContext += `\nCurrently viewing: ${input.currentModel}\n`
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a Kia India sales assistant helping customers find the perfect car.
Based on the user's browsing behavior and interests, recommend the most suitable Kia models.

${KIA_CATALOG}

Provide recommendations in JSON format with the following structure:
{
  "recommendations": [
    {
      "modelSlug": "seltos",
      "reason": "Short reason why this model suits them",
      "highlights": ["feature1", "feature2"]
    }
  ],
  "insight": "A brief personalized insight about their car search"
}

Rules:
- Recommend 1-3 models, ordered by relevance
- Use exact slugs: seltos, sonet, carens, carnival, ev6, ev9
- Don't recommend a model they're currently viewing
- Keep reasons concise (under 15 words)
- Be helpful but not pushy`,
        },
        {
          role: 'user',
          content: userContext,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 500,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return errorResponse('Failed to generate recommendations', 500)
    }

    const result = JSON.parse(content)

    return successResponse(result)
  } catch (error) {
    console.error('Recommendation API error:', error)
    return handleApiError(error)
  }
}
