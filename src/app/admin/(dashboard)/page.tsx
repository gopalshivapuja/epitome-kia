import { Suspense } from 'react'
import Link from 'next/link'
import {
  Users,
  Calendar,
  Wrench,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { prisma } from '@/lib/db'

async function getStats() {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [
      totalLeads,
      leadsThisMonth,
      leadsLastMonth,
      testDrives,
      testDrivesThisMonth,
      serviceBookings,
      serviceBookingsThisMonth,
      pendingTestDrives,
      pendingServiceBookings,
    ] = await Promise.all([
      prisma.customerLead.count({ where: { deletedAt: null } }),
      prisma.customerLead.count({
        where: { createdAt: { gte: startOfMonth }, deletedAt: null },
      }),
      prisma.customerLead.count({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
          deletedAt: null,
        },
      }),
      prisma.testDriveRequest.count({ where: { deletedAt: null } }),
      prisma.testDriveRequest.count({
        where: { createdAt: { gte: startOfMonth }, deletedAt: null },
      }),
      prisma.serviceBooking.count({ where: { deletedAt: null } }),
      prisma.serviceBooking.count({
        where: { createdAt: { gte: startOfMonth }, deletedAt: null },
      }),
      prisma.testDriveRequest.count({
        where: { status: 'pending', deletedAt: null },
      }),
      prisma.serviceBooking.count({
        where: { status: 'requested', deletedAt: null },
      }),
    ])

    const leadsChange =
      leadsLastMonth > 0
        ? ((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100
        : 0

    return {
      totalLeads,
      leadsThisMonth,
      leadsChange,
      testDrives,
      testDrivesThisMonth,
      serviceBookings,
      serviceBookingsThisMonth,
      pendingTestDrives,
      pendingServiceBookings,
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      totalLeads: 0,
      leadsThisMonth: 0,
      leadsChange: 0,
      testDrives: 0,
      testDrivesThisMonth: 0,
      serviceBookings: 0,
      serviceBookingsThisMonth: 0,
      pendingTestDrives: 0,
      pendingServiceBookings: 0,
    }
  }
}

async function getRecentLeads() {
  try {
    return await prisma.customerLead.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        source: true,
        createdAt: true,
      },
    })
  } catch {
    return []
  }
}

async function getRecentTestDrives() {
  try {
    return await prisma.testDriveRequest.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        customerLead: {
          select: { fullName: true, phone: true },
        },
        carModel: {
          select: { name: true },
        },
      },
    })
  } catch {
    return []
  }
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  href,
}: {
  title: string
  value: number
  change?: number
  icon: React.ElementType
  href: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-1 text-3xl font-bold">{value}</p>
            {change !== undefined && (
              <div className="mt-2 flex items-center gap-1 text-sm">
                {change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
                <span className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(change).toFixed(1)}%
                </span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          <div className="rounded-lg bg-kia-red/10 p-3">
            <Icon className="h-6 w-6 text-kia-red" />
          </div>
        </div>
        <Link href={href}>
          <Button variant="link" className="mt-4 h-auto p-0 text-kia-red">
            View all &rarr;
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

async function DashboardStats() {
  const stats = await getStats()

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Leads"
        value={stats.totalLeads}
        change={stats.leadsChange}
        icon={Users}
        href="/admin/leads"
      />
      <StatCard
        title="Test Drives This Month"
        value={stats.testDrivesThisMonth}
        icon={Calendar}
        href="/admin/test-drives"
      />
      <StatCard
        title="Service Bookings"
        value={stats.serviceBookingsThisMonth}
        icon={Wrench}
        href="/admin/service-bookings"
      />
      <StatCard
        title="Pending Actions"
        value={stats.pendingTestDrives + stats.pendingServiceBookings}
        icon={Clock}
        href="/admin/leads"
      />
    </div>
  )
}

async function RecentLeadsTable() {
  const leads = await getRecentLeads()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>Latest customer inquiries</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/leads">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No leads yet</p>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{lead.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {lead.email || lead.phone}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{lead.source || 'website'}</Badge>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

async function RecentTestDrivesTable() {
  const testDrives = await getRecentTestDrives()

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Test Drives</CardTitle>
          <CardDescription>Latest booking requests</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/test-drives">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {testDrives.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No test drives yet</p>
        ) : (
          <div className="space-y-4">
            {testDrives.map((td) => (
              <div
                key={td.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{td.customerLead.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {td.carModel?.name || 'Any model'} •{' '}
                    {new Date(td.preferredDate).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={statusColors[td.status] || 'bg-gray-100'}>
                  {td.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StatsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-2 h-8 w-16" />
            <Skeleton className="mt-4 h-4 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between border-b pb-4">
              <div>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-1 h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your dealership.
        </p>
      </div>

      {/* Stats */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<TableSkeleton />}>
          <RecentLeadsTable />
        </Suspense>
        <Suspense fallback={<TableSkeleton />}>
          <RecentTestDrivesTable />
        </Suspense>
      </div>
    </div>
  )
}
