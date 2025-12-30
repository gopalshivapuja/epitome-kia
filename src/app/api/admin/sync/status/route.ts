import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'
import { getSyncLogs, getLastSuccessfulSync } from '@/lib/sync/sync-manager'

// GET - Get sync status and logs
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const session = await auth()
    if (!session?.user?.role) {
      return errorResponse('Unauthorized', 401)
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    // Get sync logs and last successful sync
    const [logs, lastSuccess] = await Promise.all([
      getSyncLogs(limit),
      getLastSuccessfulSync(),
    ])

    return successResponse({
      lastSuccessfulSync: lastSuccess
        ? {
            id: lastSuccess.id,
            date: lastSuccess.createdAt,
            changesFound: lastSuccess.changesFound,
          }
        : null,
      recentLogs: logs.map((log) => ({
        id: log.id,
        source: log.source,
        status: log.status,
        modelSlug: log.modelSlug,
        changesFound: log.changesFound,
        appliedAt: log.appliedAt,
        error: log.error,
        createdAt: log.createdAt,
      })),
    })
  } catch (error) {
    return handleApiError(error)
  }
}
