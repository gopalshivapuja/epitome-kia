// Sync manager for orchestrating Kia India data synchronization

import { prisma } from '@/lib/db'
import { scrapeModelPage, scrapeAllModels, type ScrapedModelData } from './kia-scraper'
import { compareModelData, summarizeChanges, type DiffResult } from './diff-checker'

export type SyncStatus = 'idle' | 'scraping' | 'comparing' | 'applying' | 'completed' | 'failed'

export interface SyncResult {
  status: SyncStatus
  startedAt: Date
  completedAt?: Date
  modelsScraped: number
  diffs: DiffResult[]
  changesApplied: number
  errors: string[]
}

// Get current database model data for comparison
async function getDatabaseModels(): Promise<Map<string, unknown>> {
  const models = await prisma.carModel.findMany({
    where: { deletedAt: null },
    include: {
      variants: {
        where: { deletedAt: null },
      },
    },
  })

  const modelMap = new Map()
  for (const model of models) {
    modelMap.set(model.slug, {
      slug: model.slug,
      name: model.name,
      description: model.description,
      variants: model.variants.map((v) => ({
        name: v.name,
        basePrice: v.basePrice ? Number(v.basePrice) : undefined,
      })),
    })
  }

  return modelMap
}

// Perform a sync check (scrape and compare without applying)
export async function checkForUpdates(): Promise<SyncResult> {
  const result: SyncResult = {
    status: 'scraping',
    startedAt: new Date(),
    modelsScraped: 0,
    diffs: [],
    changesApplied: 0,
    errors: [],
  }

  try {
    // Scrape all model pages
    const scrapedData = await scrapeAllModels()
    result.modelsScraped = scrapedData.size
    result.status = 'comparing'

    // Get existing database data
    const dbModels = await getDatabaseModels()

    // Compare each model
    const scrapedEntries = Array.from(scrapedData.entries())
    for (const [slug, scraped] of scrapedEntries) {
      const existing = dbModels.get(slug) as Parameters<typeof compareModelData>[1]
      const diff = compareModelData(scraped, existing)
      result.diffs.push(diff)
    }

    // Log the sync check
    await prisma.syncLog.create({
      data: {
        source: 'kia_india',
        status: 'success',
        changesFound: JSON.parse(
          JSON.stringify({
            diffs: result.diffs,
            summary: summarizeChanges(result.diffs),
          })
        ),
      },
    })

    result.status = 'completed'
    result.completedAt = new Date()
  } catch (error) {
    result.status = 'failed'
    result.errors.push(error instanceof Error ? error.message : 'Unknown error')

    // Log the failure
    await prisma.syncLog.create({
      data: {
        source: 'kia_india',
        status: 'failed',
        error: result.errors.join(', '),
      },
    })
  }

  return result
}

// Apply changes to database (admin approval required)
export async function applyChanges(
  diffs: DiffResult[],
  _approvedBy: string
): Promise<{ applied: number; errors: string[] }> {
  const result = { applied: 0, errors: [] as string[] }

  for (const diff of diffs) {
    if (!diff.hasChanges) continue

    try {
      for (const change of diff.changes) {
        // Handle description changes
        if (change.field === 'description' && change.type === 'modified') {
          await prisma.carModel.updateMany({
            where: { slug: diff.modelSlug },
            data: { description: change.newValue as string },
          })
          result.applied++
        }

        // Handle variant price changes
        if (change.field.startsWith('variants.') && change.field.endsWith('.price')) {
          const variantName = change.field.split('.')[1]

          // Find the variant by name and model slug
          const model = await prisma.carModel.findUnique({
            where: { slug: diff.modelSlug },
          })

          if (model) {
            await prisma.variant.updateMany({
              where: {
                name: variantName,
                carModelId: model.id,
              },
              data: { basePrice: change.newValue as number },
            })
            result.applied++
          }
        }

        // Note: Adding/removing variants/colors requires more careful handling
        // and should probably be done manually or with admin review
      }
    } catch (error) {
      result.errors.push(
        `Error applying changes to ${diff.modelSlug}: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  // Log the apply action
  await prisma.syncLog.create({
    data: {
      source: 'kia_india',
      status: result.errors.length > 0 ? 'partial' : 'success',
      changesFound: JSON.parse(JSON.stringify({ diffs })),
      appliedAt: new Date(),
      error: result.errors.length > 0 ? result.errors.join(', ') : null,
    },
  })

  return result
}

// Get recent sync logs
export async function getSyncLogs(limit: number = 10) {
  return prisma.syncLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

// Get last successful sync
export async function getLastSuccessfulSync() {
  return prisma.syncLog.findFirst({
    where: { status: 'success' },
    orderBy: { createdAt: 'desc' },
  })
}

// Sync a single model
export async function syncSingleModel(modelSlug: string): Promise<DiffResult | null> {
  try {
    const scraped = await scrapeModelPage(modelSlug)
    if (!scraped) return null

    const dbModels = await getDatabaseModels()
    const existing = dbModels.get(modelSlug) as Parameters<typeof compareModelData>[1]

    return compareModelData(scraped, existing)
  } catch (error) {
    console.error(`Error syncing ${modelSlug}:`, error)
    return null
  }
}
