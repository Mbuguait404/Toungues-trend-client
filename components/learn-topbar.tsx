import { Bell } from 'lucide-react'

interface LearnTopbarProps {
  title: string
}

export default function LearnTopbar({ title }: LearnTopbarProps) {
  return (
    <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
        {title}
      </h1>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} className="text-gray-600" />
        </button>
        <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-navy font-bold text-sm">
          AJ
        </div>
      </div>
    </div>
  )
}
