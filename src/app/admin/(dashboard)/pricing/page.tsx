import { Suspense } from 'react'
import { prisma } from '@/lib/db'

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DollarSign,
  Car,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

async function getModelsWithVariants() {
  try {
    const models = await prisma.carModel.findMany({
      where: { deletedAt: null, isActive: true },
      include: {
        variants: {
          where: { deletedAt: null },
          orderBy: { basePrice: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    })
    return models
  } catch (error) {
    console.error('Error fetching models:', error)
    return []
  }
}

async function getPricingStats() {
  try {
    const [totalModels, totalVariants, variantsWithPrice, variantsWithoutPrice] =
      await Promise.all([
        prisma.carModel.count({ where: { deletedAt: null, isActive: true } }),
        prisma.variant.count({ where: { deletedAt: null } }),
        prisma.variant.count({ where: { deletedAt: null, basePrice: { not: null } } }),
        prisma.variant.count({ where: { deletedAt: null, basePrice: null } }),
      ])
    return { totalModels, totalVariants, variantsWithPrice, variantsWithoutPrice }
  } catch (error) {
    console.error('Error fetching pricing stats:', error)
    return { totalModels: 0, totalVariants: 0, variantsWithPrice: 0, variantsWithoutPrice: 0 }
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

async function PricingStats() {
  const stats = await getPricingStats()

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Models</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalModels}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Variants</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalVariants}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Priced Variants</CardTitle>
          <DollarSign className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.variantsWithPrice}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Missing Prices</CardTitle>
          <AlertCircle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">{stats.variantsWithoutPrice}</div>
        </CardContent>
      </Card>
    </div>
  )
}

async function PricingTable() {
  const models = await getModelsWithVariants()

  if (models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Car className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No models found</h3>
        <p className="text-muted-foreground mb-4">
          Add car models first to manage pricing.
        </p>
        <Button asChild>
          <Link href="/admin/models">
            <Car className="h-4 w-4 mr-2" />
            Manage Models
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {models.map((model) => (
        <Card key={model.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{model.name}</CardTitle>
                <CardDescription>
                  {model.variants.length} variant{model.variants.length !== 1 ? 's' : ''} •
                  Model Year {model.modelYear}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/models/${model.slug}`} target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {model.variants.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No variants added for this model.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variant</TableHead>
                    <TableHead>Trim Level</TableHead>
                    <TableHead>Ex-Showroom Price</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {model.variants.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell>
                        <span className="font-medium">{variant.name}</span>
                      </TableCell>
                      <TableCell>
                        {variant.trimLevel || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {variant.basePrice ? (
                          <span className="font-semibold text-gray-900">
                            {formatPrice(Number(variant.basePrice))}
                          </span>
                        ) : (
                          <span className="text-amber-600 font-medium">Not set</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(variant.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        {variant.basePrice ? (
                          <Badge className="bg-green-100 text-green-800">Priced</Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800">Missing</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pricing Management</h1>
          <p className="text-muted-foreground">
            View and manage ex-showroom prices for all variants.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync from Kia India
          </Button>
          <Button asChild>
            <Link href="/price-calculator" target="_blank">
              <DollarSign className="h-4 w-4 mr-2" />
              Price Calculator
            </Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <PricingStats />
      </Suspense>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Karnataka On-Road Pricing</p>
              <p className="text-sm text-blue-700 mt-1">
                The public price calculator automatically adds Karnataka road tax (13-20%),
                registration, insurance, and other charges to ex-showroom prices.
                <Link href="/price-calculator" className="underline ml-1" target="_blank">
                  View Calculator →
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Suspense fallback={<div>Loading pricing data...</div>}>
        <PricingTable />
      </Suspense>
    </div>
  )
}
