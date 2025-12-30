import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = newsletterSchema.parse(body)

    // Check if email already exists as a newsletter subscriber
    const existingLead = await prisma.customerLead.findFirst({
      where: {
        email,
        source: 'newsletter',
        deletedAt: null,
      },
    })

    if (existingLead) {
      return NextResponse.json(
        successResponse({ message: 'Already subscribed' }),
        { status: 200 }
      )
    }

    // Create a new customer lead with newsletter source
    await prisma.customerLead.create({
      data: {
        email,
        source: 'newsletter',
        notes: 'Newsletter subscription from website footer',
      },
    })

    return NextResponse.json(
      successResponse({ message: 'Successfully subscribed to newsletter' }),
      { status: 201 }
    )
  } catch (error) {
    return handleApiError(error)
  }
}
