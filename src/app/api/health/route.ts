import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: 'unknown',
    },
  }

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    healthCheck.checks.database = 'healthy'
  } catch (error) {
    healthCheck.status = 'degraded'
    healthCheck.checks.database = 'unhealthy'
    console.error('Health check - Database error:', error)
  }

  const statusCode = healthCheck.status === 'ok' ? 200 : 503

  return NextResponse.json(healthCheck, { status: statusCode })
}
