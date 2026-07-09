'use client'

import LearnTopbar from '@/components/learn-topbar'
import { useEffect, useState } from 'react'
import { Download, FileText, Volume2, Video, File, Loader2, AlertCircle } from 'lucide-react'
import { getEnrollmentById, type Enrollment } from '@/lib/api/enrollments'
import { getMaterials, type Material } from '@/lib/api/materials'
import { ApiException } from '@/lib/api'

function getFileIcon(type: string) {
  const t = type.toLowerCase()
  if (t.includes('pdf')) return <FileText size={20} className="text-red-500" />
  if (t.includes('audio') || t.includes('mp3')) return <Volume2 size={20} className="text-blue-500" />
  if (t.includes('video') || t.includes('mp4')) return <Video size={20} className="text-purple-500" />
  return <File size={20} className="text-gray-500" />
}

export default function ModulePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'materials' | 'quiz' | 'notes'>('materials')
  const [materialsViewed, setMaterialsViewed] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const enr = await getEnrollmentById(params.id)
        setEnrollment(enr)
        if (enr.courseId) {
          const mats = await getMaterials(enr.courseId)
          setMaterials(mats)
        }
      } catch (err) {
        setError(err instanceof ApiException ? err.message : 'Failed to load module')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [params.id])

  if (isLoading) {
    return (
      <>
        <LearnTopbar title="Module Details" />
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 size={32} className="animate-spin mr-3" />
          Loading module…
        </div>
      </>
    )
  }

  if (error || !enrollment) {
    return (
      <>
        <LearnTopbar title="Module Details" />
        <div className="p-6">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle size={20} />
            {error || 'Enrollment not found'}
          </div>
        </div>
      </>
    )
  }

  const quizQuestions = [
    {
      id: 1,
      question: 'How do you say "Good morning" in French?',
      options: ['Bonsoir', 'Bonjour', 'Bonne nuit', 'Au revoir'],
      correct: 1,
    },
  ] // mockup quiz for now until Quiz module is built

  return (
    <>
      <LearnTopbar title={enrollment.language ?? enrollment.courseName ?? 'Module Details'} />
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl">
        <div className="bg-navy rounded-2xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Poppins' }}>
            {enrollment.language ?? enrollment.courseName}
          </h2>
          <p className="text-gray-300">Level: {enrollment.level ?? 'General'}</p>
        </div>

        <div className="flex items-center gap-4 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('materials')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'materials' ? 'border-gold text-navy' : 'border-transparent text-gray-500 hover:text-navy'}`}
          >
            Learning Materials
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'quiz' ? 'border-gold text-navy' : 'border-transparent text-gray-500 hover:text-navy'}`}
          >
            Practice Quiz
          </button>
        </div>

        {activeTab === 'materials' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            {materials.length === 0 ? (
              <p className="text-gray-500 text-sm">No materials available for this course yet.</p>
            ) : (
              <div className="space-y-4">
                {materials.map((m) => (
                  <div key={m._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gold-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
                        {getFileIcon(m.fileType)}
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-sm">{m.title}</p>
                        <p className="text-xs text-gray-500 uppercase">{m.fileType}</p>
                      </div>
                    </div>
                    {m.fileUrl ? (
                      <a href={m.fileUrl} target="_blank" rel="noreferrer" className="p-2 text-gold hover:bg-gold-100 rounded-lg transition-colors" onClick={() => setMaterialsViewed(true)}>
                        <Download size={20} />
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">No link</span>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 flex justify-end">
              <button
                disabled={!materialsViewed || isCompleted}
                onClick={() => {
                  setIsCompleted(true)
                  // Next step: call progress update API here
                }}
                className="px-6 py-3 bg-gold hover:bg-gold-light text-navy font-semibold rounded-full transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCompleted ? 'Completed' : 'Mark as Complete'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-navy mb-6">Knowledge Check</h3>
            <div className="space-y-8">
              {quizQuestions.map((q, qIdx) => (
                <div key={q.id}>
                  <p className="font-semibold text-navy mb-4">{qIdx + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => (
                      <label key={oIdx} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="radio" name={`q-${q.id}`} className="w-4 h-4 text-gold focus:ring-gold border-gray-300" />
                        <span className="ml-3 text-sm text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
