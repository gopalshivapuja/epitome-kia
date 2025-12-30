import { NextRequest } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'
import {
  checkForUpdates,
  applyChanges,
  syncSingleModel,
} from '@/lib/sync/sync-manager'
import { summarizeChanges, type DiffResult } from '@/lib/sync/diff-checker'

// POST - Trigger a sync check or apply changes
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const session = await auth()
    if (!session?.user?.role) {
      return errorResponse('Unauthorized', 401)
    }

    const body = await request.json().catch(() => ({}))
    const action = body.action || 'check'

    switch (action) {
      case 'check': {
        // Run sync check for all models
        console.log(`[${new Date().toISOString()}] Sync check triggered by: ${session.user.email}`)

        const result = await checkForUpdates()
        const summary = summarizeChanges(result.diffs)

        return successResponse({
          status: result.status,
          startedAt: result.startedAt,
          completedAt: result.completedAt,
          modelsScraped: result.modelsScraped,
          summary,
          diffs: result.diffs,
          errors: result.errors,
        })
      }

      case 'check-single': {
        // Check a single model
        const modelSlug = z.string().min(1).parse(body.modelSlug)
        console.log(`[${new Date().toISOString()}] Single model sync check for ${modelSlug} by: ${session.user.email}`)

        const diff = await syncSingleModel(modelSlug)

        if (!diff) {
          return errorResponse('Failed to sync model', 500)
        }

        return successResponse({
          modelSlug,
          hasChanges: diff.hasChanges,
          changes: diff.changes,
        })
      }

      case 'apply': {
        // Apply approved changes
        const diffsSchema = z.array(
          z.object({
            modelSlug: z.string(),
            hasChanges: z.boolean(),
            changes: z.array(z.unknown()),
          })
        )

        const diffs = diffsSchema.parse(body.diffs) as DiffResult[]
        const approvedBy = session.user.email || 'unknown'

        console.log(`[${new Date().toISOString()}] Applying sync changes by: ${approvedBy}`)

        const result = await applyChanges(diffs, approvedBy)

        return successResponse({
          applied: result.applied,
          errors: result.errors,
          message: result.applied > 0
            ? `Successfully applied ${result.applied} change(s)`
            : 'No changes applied',
        })
      }

      default:
        return errorResponse('Invalid action. Use: check, check-single, or apply', 400)
    }
  } catch (error) {
    return handleApiError(error)
  }
}
