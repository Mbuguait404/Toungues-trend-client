import LearnSidebar from '@/components/learn-sidebar'

export const metadata = {
  title: 'Learner Portal | Tongues Trend',
  description: 'Your personal learning dashboard',
}

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-light">
      <LearnSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
