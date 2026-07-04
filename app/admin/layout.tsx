import AdminSidebar from '@/components/admin-sidebar'

export const metadata = {
  title: 'Admin Portal | Tongues Trend',
  description: 'Manage users, courses, and platform settings',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-light">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
