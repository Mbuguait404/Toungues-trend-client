import TeachSidebar from '@/components/teach-sidebar'

export const metadata = {
  title: 'Teacher Portal | Tongues Trend',
  description: 'Manage your learners and teaching materials',
}

export default function TeachLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-light">
      <TeachSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
