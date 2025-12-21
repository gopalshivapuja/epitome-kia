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
  Car,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'

async function getTestDrives() {
  try {
    const testDrives = await prisma.testDriveRequest.findMany({
      where: { deletedAt: null },
      include: {
        customerLead: true,
        carModel: true,
        variant: true,
      },
      orderBy: { preferredDate: 'asc' },
      take: 100,
    })
    return testDrives
  } catch (error) {
    console.error('Error fetching test drives:', error)
    return []
  }
}

async function getTestDriveStats() {
  try {
    const [total, pending, scheduled, completed, cancelled] = await Promise.all([
      prisma.testDriveRequest.count({ where: { deletedAt: null } }),
      prisma.testDriveRequest.count({
        where: { deletedAt: null, status: 'pending' },
      }),
      prisma.testDriveRequest.count({
        where: { deletedAt: null, status: 'scheduled' },
      }),
      prisma.testDriveRequest.count({
        where: { deletedAt: null, status: 'completed' },
      }),
      prisma.testDriveRequest.count({
        where: { deletedAt: null, status: 'cancelled' },
      }),
    ])
    return { total, pending, scheduled, completed, cancelled }
  } catch (error) {
    console.error('Error fetching test drive stats:', error)
    return { total: 0, pending: 0, scheduled: 0, completed: 0, cancelled: 0 }
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'scheduled':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

async function TestDrivesTable() {
  const testDrives = await getTestDrives()

  if (testDrives.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Car className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No test drive requests</h3>
        <p className="text-muted-foreground">
          Test drive bookings from your website will appear here.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Model</TableHead>
          <TableHead>Preferred Date</TableHead>
          <TableHead>Time Slot</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {testDrives.map((td) => (
          <TableRow key={td.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{td.customerLead?.fullName || 'Unknown'}</span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {td.customerLead?.phone || 'N/A'}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{td.carModel?.name || 'Unknown'}</span>
                {td.variant && (
                  <span className="text-sm text-muted-foreground">
                    {td.variant.name}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {formatDate(td.preferredDate)}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {td.preferredTime || 'Any'}
              </div>
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(td.status)}>{td.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                {td.status === 'pending' && (
                  <>
                    <Button variant="ghost" size="sm" className="text-green-600">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

async function TestDriveStats() {
  const stats = await getTestDriveStats()

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          <Calendar className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TestDrivesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Test Drives</h1>
          <p className="text-muted-foreground">
            Manage test drive requests and bookings.
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <TestDriveStats />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>All Test Drive Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading test drives...</div>}>
            <TestDrivesTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
