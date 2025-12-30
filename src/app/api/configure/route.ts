import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'
import { generateShareCode, calculateConfiguration } from '@/lib/configurator'

// Validation schema for configuration
const configurationSchema = z.object({
  modelSlug: z.string().min(1),
  variantId: z.string().min(1),
  colorCode: z.string().min(1),
  accessories: z.array(z.string()).default([]),
  customerId: z.string().uuid().optional(),
})

// POST - Save a configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = configurationSchema.parse(body)

    // Calculate the configuration to get total price
    const config = calculateConfiguration(
      validatedData.modelSlug,
      validatedData.variantId,
      validatedData.colorCode,
      validatedData.accessories
    )

    if (!config) {
      return errorResponse('Invalid configuration', 400)
    }

    // Generate a unique share code
    let shareCode = generateShareCode()
    let attempts = 0

    // Ensure share code is unique
    while (attempts < 5) {
      const existing = await prisma.vehicleConfiguration.findUnique({
        where: { shareCode },
      })
      if (!existing) break
      shareCode = generateShareCode()
      attempts++
    }

    // Calculate expiration date (30 days from now)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    // Save configuration to database
    const savedConfig = await prisma.vehicleConfiguration.create({
      data: {
        modelSlug: validatedData.modelSlug,
        variantId: validatedData.variantId,
        colorCode: validatedData.colorCode,
        accessories: validatedData.accessories,
        totalPrice: config.totalPrice,
        shareCode,
        customerId: validatedData.customerId || null,
        expiresAt,
      },
    })

    return successResponse({
      id: savedConfig.id,
      shareCode: savedConfig.shareCode,
      totalPrice: config.totalPrice,
      expiresAt: savedConfig.expiresAt,
    }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}

// GET - Retrieve a configuration by share code
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shareCode = searchParams.get('code')

    if (!shareCode) {
      return errorResponse('Share code is required', 400)
    }

    const config = await prisma.vehicleConfiguration.findUnique({
      where: { shareCode },
    })

    if (!config) {
      return errorResponse('Configuration not found', 404)
    }

    // Check if configuration has expired
    if (new Date() > config.expiresAt) {
      return errorResponse('Configuration has expired', 410)
    }

    // Calculate the full configuration details
    const fullConfig = calculateConfiguration(
      config.modelSlug,
      config.variantId,
      config.colorCode,
      config.accessories
    )

    return successResponse({
      ...config,
      details: fullConfig,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
