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
import {
  Wrench,
  Calendar,
  Clock,
  Phone,
  Car,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
} from 'lucide-react'
import { ServiceBookingStatusActions } from '@/components/admin/actions'

async function getServiceBookings() {
  try {
    const bookings = await prisma.serviceBooking.findMany({
      where: { deletedAt: null },
      include: {
        customerLead: true,
        dealerLocation: true,
        carModel: true,
      },
      orderBy: { serviceDate: 'asc' },
      take: 100,
    })
    return bookings
  } catch (error) {
    console.error('Error fetching service bookings:', error)
    return []
  }
}

async function getServiceStats() {
  try {
    const [total, pending, scheduled, completed, cancelled] = await Promise.all([
      prisma.serviceBooking.count({ where: { deletedAt: null } }),
      prisma.serviceBooking.count({
        where: { deletedAt: null, status: 'pending' },
      }),
      prisma.serviceBooking.count({
        where: { deletedAt: null, status: 'scheduled' },
      }),
      prisma.serviceBooking.count({
        where: { deletedAt: null, status: 'completed' },
      }),
      prisma.serviceBooking.count({
        where: { deletedAt: null, status: 'cancelled' },
      }),
    ])
    return { total, pending, scheduled, completed, cancelled }
  } catch (error) {
    console.error('Error fetching service stats:', error)
    return { total: 0, pending: 0, scheduled: 0, completed: 0, cancelled: 0 }
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'scheduled':
      return 'bg-blue-100 text-blue-800'
    case 'in_progress':
      return 'bg-purple-100 text-purple-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getServiceTypeLabel(type: string) {
  const types: Record<string, string> = {
    regular_service: 'Regular Service',
    oil_change: 'Oil Change',
    brake_service: 'Brake Service',
    tire_service: 'Tire Service',
    ac_service: 'AC Service',
    battery_check: 'Battery Check',
    general_repair: 'General Repair',
    inspection: 'Inspection',
  }
  return types[type] || type
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

async function ServiceBookingsTable() {
  const bookings = await getServiceBookings()

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No service bookings</h3>
        <p className="text-muted-foreground">
          Service booking requests will appear here.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Vehicle</TableHead>
          <TableHead>Service Type</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">
                  {booking.customerLead?.fullName || 'Unknown'}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {booking.customerLead?.phone || 'N/A'}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span>{booking.carModel?.name || 'Not specified'}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {getServiceTypeLabel(booking.serviceType)}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(booking.serviceDate)}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {booking.serviceTime || 'Any'}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <span className="flex items-center gap-1 text-sm">
                <MapPin className="h-3 w-3" />
                {booking.dealerLocation?.name || 'Main Dealership'}
              </span>
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <ServiceBookingStatusActions id={booking.id} currentStatus={booking.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

async function ServiceStats() {
  const stats = await getServiceStats()

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
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

export default function ServiceBookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Service Bookings</h1>
          <p className="text-muted-foreground">
            Manage vehicle service appointments and requests.
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <ServiceStats />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>All Service Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading bookings...</div>}>
            <ServiceBookingsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
