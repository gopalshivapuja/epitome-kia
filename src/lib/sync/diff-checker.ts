// Diff checker for comparing scraped data with database

import type { ScrapedModelData, ScrapedVariant, ScrapedColor } from './kia-scraper'

export interface DiffResult {
  modelSlug: string
  hasChanges: boolean
  changes: Change[]
}

export interface Change {
  field: string
  oldValue: unknown
  newValue: unknown
  type: 'added' | 'removed' | 'modified'
  severity: 'low' | 'medium' | 'high'
}

// Database model type (simplified)
interface DatabaseModel {
  slug: string
  name: string
  description?: string
  variants?: Array<{
    name: string
    basePrice?: number
  }>
  colors?: Array<{
    name: string
    code?: string
  }>
}

// Compare scraped data with database record
export function compareModelData(
  scraped: ScrapedModelData,
  existing: DatabaseModel | null
): DiffResult {
  const changes: Change[] = []

  if (!existing) {
    // New model - mark all fields as added
    return {
      modelSlug: scraped.slug,
      hasChanges: true,
      changes: [
        {
          field: 'model',
          oldValue: null,
          newValue: scraped.name,
          type: 'added',
          severity: 'high',
        },
      ],
    }
  }

  // Compare basic fields
  if (scraped.name && scraped.name !== existing.name) {
    changes.push({
      field: 'name',
      oldValue: existing.name,
      newValue: scraped.name,
      type: 'modified',
      severity: 'low',
    })
  }

  if (scraped.tagline && scraped.tagline !== existing.description) {
    changes.push({
      field: 'description',
      oldValue: existing.description,
      newValue: scraped.tagline,
      type: 'modified',
      severity: 'low',
    })
  }

  // Compare variants
  if (scraped.variants.length > 0 && existing.variants) {
    const variantChanges = compareVariants(scraped.variants, existing.variants)
    changes.push(...variantChanges)
  }

  // Compare colors
  if (scraped.colors.length > 0 && existing.colors) {
    const colorChanges = compareColors(scraped.colors, existing.colors)
    changes.push(...colorChanges)
  }

  return {
    modelSlug: scraped.slug,
    hasChanges: changes.length > 0,
    changes,
  }
}

// Compare variant arrays
function compareVariants(
  scraped: ScrapedVariant[],
  existing: DatabaseModel['variants']
): Change[] {
  const changes: Change[] = []
  const existingMap = new Map(existing?.map((v) => [v.name, v]) || [])
  const scrapedMap = new Map(scraped.map((v) => [v.name, v]))

  // Check for new variants
  const scrapedEntries = Array.from(scrapedMap.entries())
  for (const [name, variant] of scrapedEntries) {
    if (!existingMap.has(name)) {
      changes.push({
        field: `variants.${name}`,
        oldValue: null,
        newValue: variant,
        type: 'added',
        severity: 'high',
      })
    }
  }

  // Check for removed variants
  const existingEntries = Array.from(existingMap.entries())
  for (const [name, variant] of existingEntries) {
    if (!scrapedMap.has(name)) {
      changes.push({
        field: `variants.${name}`,
        oldValue: variant,
        newValue: null,
        type: 'removed',
        severity: 'high',
      })
    }
  }

  // Check for modified variants
  for (const [name, scrapedVariant] of scrapedEntries) {
    const existingVariant = existingMap.get(name)
    if (existingVariant) {
      // Compare prices
      if (scrapedVariant.price && scrapedVariant.price !== existingVariant.basePrice) {
        changes.push({
          field: `variants.${name}.price`,
          oldValue: existingVariant.basePrice,
          newValue: scrapedVariant.price,
          type: 'modified',
          severity: 'high',
        })
      }
    }
  }

  return changes
}

// Compare color arrays
function compareColors(
  scraped: ScrapedColor[],
  existing: DatabaseModel['colors']
): Change[] {
  const changes: Change[] = []
  const existingNames = new Set(existing?.map((c) => c.name) || [])
  const scrapedNames = new Set(scraped.map((c) => c.name))

  // Check for new colors
  for (const color of scraped) {
    if (!existingNames.has(color.name)) {
      changes.push({
        field: `colors.${color.name}`,
        oldValue: null,
        newValue: color,
        type: 'added',
        severity: 'medium',
      })
    }
  }

  // Check for removed colors
  for (const color of existing || []) {
    if (!scrapedNames.has(color.name)) {
      changes.push({
        field: `colors.${color.name}`,
        oldValue: color,
        newValue: null,
        type: 'removed',
        severity: 'medium',
      })
    }
  }

  return changes
}

// Format changes for display
export function formatChanges(diff: DiffResult): string[] {
  return diff.changes.map((change) => {
    const emoji =
      change.type === 'added' ? '+' : change.type === 'removed' ? '-' : '~'
    const severity =
      change.severity === 'high' ? '[HIGH]' : change.severity === 'medium' ? '[MED]' : '[LOW]'

    if (change.type === 'added') {
      return `${emoji} ${severity} Added ${change.field}: ${JSON.stringify(change.newValue)}`
    }
    if (change.type === 'removed') {
      return `${emoji} ${severity} Removed ${change.field}: ${JSON.stringify(change.oldValue)}`
    }
    return `${emoji} ${severity} Changed ${change.field}: ${JSON.stringify(change.oldValue)} -> ${JSON.stringify(change.newValue)}`
  })
}

// Summarize changes across all models
export function summarizeChanges(diffs: DiffResult[]): {
  totalChanges: number
  highSeverity: number
  modelsAffected: number
  summary: string
} {
  let totalChanges = 0
  let highSeverity = 0
  let modelsAffected = 0

  for (const diff of diffs) {
    if (diff.hasChanges) {
      modelsAffected++
      totalChanges += diff.changes.length
      highSeverity += diff.changes.filter((c) => c.severity === 'high').length
    }
  }

  let summary = ''
  if (totalChanges === 0) {
    summary = 'No changes detected - data is up to date.'
  } else {
    summary = `Found ${totalChanges} change${totalChanges !== 1 ? 's' : ''} across ${modelsAffected} model${modelsAffected !== 1 ? 's' : ''}.`
    if (highSeverity > 0) {
      summary += ` ${highSeverity} high-severity change${highSeverity !== 1 ? 's' : ''} require attention.`
    }
  }

  return {
    totalChanges,
    highSeverity,
    modelsAffected,
    summary,
  }
}
