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
  Users,
  Mail,
  Phone,
  Calendar,
  Eye,
  Filter,
} from 'lucide-react'
import Link from 'next/link'
import { ExportLeadsButton } from '@/components/admin/actions'

async function getLeads() {
  try {
    const leads = await prisma.customerLead.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return leads
  } catch (error) {
    console.error('Error fetching leads:', error)
    return []
  }
}

async function getLeadStats() {
  try {
    const [total, today, thisWeek, thisMonth] = await Promise.all([
      prisma.customerLead.count({ where: { deletedAt: null } }),
      prisma.customerLead.count({
        where: {
          deletedAt: null,
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.customerLead.count({
        where: {
          deletedAt: null,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.customerLead.count({
        where: {
          deletedAt: null,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ])
    return { total, today, thisWeek, thisMonth }
  } catch (error) {
    console.error('Error fetching lead stats:', error)
    return { total: 0, today: 0, thisWeek: 0, thisMonth: 0 }
  }
}

function getSourceColor(source: string | null) {
  switch (source) {
    case 'test_drive':
      return 'bg-blue-100 text-blue-800'
    case 'service_booking':
      return 'bg-green-100 text-green-800'
    case 'contact_form':
      return 'bg-purple-100 text-purple-800'
    case 'website':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function formatSource(source: string | null) {
  switch (source) {
    case 'test_drive':
      return 'Test Drive'
    case 'service_booking':
      return 'Service'
    case 'contact_form':
      return 'Contact'
    default:
      return source || 'Website'
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

async function LeadsTable() {
  const leads = await getLeads()

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No leads yet</h3>
        <p className="text-muted-foreground">
          Leads from your website forms will appear here.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell className="font-medium">{lead.fullName}</TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                {lead.email && (
                  <span className="flex items-center gap-1 text-sm">
                    <Mail className="h-3 w-3" />
                    {lead.email}
                  </span>
                )}
                {lead.phone && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {lead.phone}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge className={getSourceColor(lead.source)}>
                {formatSource(lead.source)}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(lead.createdAt)}
            </TableCell>
            <TableCell className="text-right">
              <Link href={`/admin/leads/${lead.id}`}>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

async function LeadStats() {
  const stats = await getLeadStats()

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.today}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Week</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.thisWeek}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.thisMonth}</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            Manage customer inquiries and leads from your website.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <ExportLeadsButton />
        </div>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <LeadStats />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading leads...</div>}>
            <LeadsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
