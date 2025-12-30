import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { AdminHeader } from '@/components/admin/header'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader user={session.user} />
      <main className="flex-1 p-6 lg:ml-64">{children}</main>
    </div>
  )
}
