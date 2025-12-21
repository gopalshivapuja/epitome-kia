import { Suspense } from 'react'
import { prisma } from '@/lib/db'

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Tag,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Car,
} from 'lucide-react'
import Link from 'next/link'

async function getOffers() {
  try {
    const offers = await prisma.offer.findMany({
      where: { deletedAt: null },
      include: {
        carModel: true,
        variant: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return offers
  } catch (error) {
    console.error('Error fetching offers:', error)
    return []
  }
}

async function getOfferStats() {
  try {
    const now = new Date()
    const [total, active, expired, upcoming] = await Promise.all([
      prisma.offer.count({ where: { deletedAt: null } }),
      prisma.offer.count({
        where: {
          deletedAt: null,
          isActive: true,
          startAt: { lte: now },
          OR: [{ endAt: null }, { endAt: { gte: now } }],
        },
      }),
      prisma.offer.count({
        where: {
          deletedAt: null,
          endAt: { lt: now },
        },
      }),
      prisma.offer.count({
        where: {
          deletedAt: null,
          startAt: { gt: now },
        },
      }),
    ])
    return { total, active, expired, upcoming }
  } catch (error) {
    console.error('Error fetching offer stats:', error)
    return { total: 0, active: 0, expired: 0, upcoming: 0 }
  }
}

function getOfferStatus(offer: {
  isActive: boolean
  startAt: Date
  endAt: Date | null
}) {
  const now = new Date()
  if (!offer.isActive) {
    return { label: 'Inactive', color: 'bg-gray-100 text-gray-800' }
  }
  if (offer.startAt > now) {
    return { label: 'Upcoming', color: 'bg-blue-100 text-blue-800' }
  }
  if (offer.endAt && offer.endAt < now) {
    return { label: 'Expired', color: 'bg-red-100 text-red-800' }
  }
  return { label: 'Active', color: 'bg-green-100 text-green-800' }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

async function OffersTable() {
  const offers = await getOffers()

  if (offers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Tag className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No offers yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first promotional offer to get started.
        </p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Offer
        </Button>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Applies To</TableHead>
          <TableHead>Validity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {offers.map((offer) => {
          const status = getOfferStatus(offer)
          return (
            <TableRow key={offer.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{offer.title}</span>
                  {offer.description && (
                    <span className="text-sm text-muted-foreground line-clamp-1">
                      {offer.description}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {offer.carModel ? (
                  <span className="flex items-center gap-1">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    {offer.carModel.name}
                  </span>
                ) : (
                  <span className="text-muted-foreground">All Models</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(offer.startAt)}
                  </span>
                  {offer.endAt && (
                    <span className="text-muted-foreground">
                      to {formatDate(offer.endAt)}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={status.color}>{status.label}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Link href={`/offers/${offer.slug}`} target="_blank">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

async function OfferStats() {
  const stats = await getOfferStats()

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
          <Tag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active</CardTitle>
          <Eye className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          <Calendar className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expired</CardTitle>
          <EyeOff className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function OffersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Offers</h1>
          <p className="text-muted-foreground">
            Manage promotional offers and discounts.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Offer
        </Button>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <OfferStats />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>All Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading offers...</div>}>
            <OffersTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
