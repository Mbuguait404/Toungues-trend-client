'use client'

import { useEffect, useState, use } from 'react'
import { useSearchParams } from 'next/navigation'
import LearnTopbar from '@/components/learn-topbar'
import { Download, FileText, Volume2, Video, File, Loader2, AlertCircle, CheckCircle2, Clock, Target } from 'lucide-react'
import { getModuleById, type CourseModule } from '@/lib/api/modules'
import { getMaterials, type Material } from '@/lib/api/materials'
import { getEnrollmentProgress, updateProgress, type Progress } from '@/lib/api/progress'
import QuizWidget from '@/components/quiz-widget'
import { ApiException } from '@/lib/api'

function getFileIcon(type: string) {
  const t = type.toLowerCase()
  if (t.includes('pdf')) return <FileText size={20} className="text-red-500" />
  if (t.includes('audio') || t.includes('mp3')) return <Volume2 size={20} className="text-blue-500" />
  if (t.includes('video') || t.includes('mp4')) return <Video size={20} className="text-purple-500" />
  if (t.includes('youtube')) return <Video size={20} className="text-red-600" />
  return <File size={20} className="text-gray-500" />
}

export default function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: moduleId } = use(params)
  const searchParams = useSearchParams()
  const enrollmentId = searchParams.get('enrollmentId')

  const [mod, setModule] = useState<CourseModule | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [progress, setProgress] = useState<Progress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleting, setIsCompleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isCompleted = progress?.isCompleted ?? false

  useEffect(() => {
    async function load() {
      try {
        const modData = await getModuleById(moduleId)
        setModule(modData)

        const mats = await getMaterials(undefined, moduleId)
        setMaterials(mats)

        if (enrollmentId) {
          const progList = await getEnrollmentProgress(enrollmentId)
          const found = progList.find((p) => p.moduleId === moduleId)
          if (found) setProgress(found)
        }
      } catch (err) {
        setError(err instanceof ApiException ? err.message : 'Failed to load module')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [moduleId, enrollmentId])

  const handleMarkComplete = async () => {
    if (!enrollmentId || isCompleting || isCompleted) return
    setIsCompleting(true)
    try {
      const result = await updateProgress(enrollmentId, { moduleId, isCompleted: true })
      setProgress(result)
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to mark as complete')
    } finally {
      setIsCompleting(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <LearnTopbar title="Module" />
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 size={32} className="animate-spin mr-3" />
          Loading module…
        </div>
      </>
    )
  }

  if (error || !mod) {
    return (
      <>
        <LearnTopbar title="Module" />
        <div className="p-6">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle size={20} />
            {error || 'Module not found'}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <LearnTopbar title={mod.title} />
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl">
        <div className="bg-navy rounded-2xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Poppins' }}>
            {mod.title}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm mt-3">
            <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">Level: {mod.level}</span>
            {mod.estimatedDuration > 0 && (
              <span className="flex items-center gap-1">
                <Clock size={14} /> {mod.estimatedDuration} min
              </span>
            )}
          </div>
          {mod.description && (
            <p className="mt-3 text-gray-300">{mod.description}</p>
          )}
        </div>

        <div className="space-y-6">
          {mod.objectives && mod.objectives.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-navy mb-3 flex items-center gap-2">
                <Target size={20} className="text-gold" />
                Learning Objectives
              </h3>
              <ul className="space-y-2">
                {mod.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-gold-50 text-gold flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {mod.content && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-navy mb-4">Lesson Content</h3>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {mod.content}
              </div>
            </div>
          )}

          {mod.notes && (
            <div className="bg-gold-50 rounded-2xl p-6 border border-gold/20">
              <h3 className="text-lg font-bold text-navy mb-3">Teacher Notes</h3>
              <p className="text-sm text-navy/80 whitespace-pre-wrap">{mod.notes}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-navy mb-4">Learning Materials</h3>

            {materials.length === 0 ? (
              <p className="text-gray-500 text-sm">No materials available for this module yet.</p>
            ) : (
              <div className="space-y-3">
                {materials.map((m) => (
                  <div key={m._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gold-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
                        {getFileIcon(m.fileType)}
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-sm">{m.title}</p>
                        <p className="text-xs text-gray-500 uppercase">{m.type || m.fileType}</p>
                      </div>
                    </div>
                    {m.fileUrl ? (
                      <a href={m.fileUrl} target="_blank" rel="noreferrer" className="p-2 text-gold hover:bg-gold-100 rounded-lg transition-colors">
                        <Download size={20} />
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">No link</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <QuizWidget moduleId={moduleId} enrollmentId={enrollmentId ?? undefined} />

          {enrollmentId && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex justify-end">
                {isCompleted ? (
                  <div className="flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 font-semibold rounded-full">
                    <CheckCircle2 size={20} />
                    Completed
                  </div>
                ) : (
                  <button
                    disabled={isCompleting}
                    onClick={handleMarkComplete}
                    className="px-6 py-3 bg-gold hover:bg-gold-light text-navy font-semibold rounded-full transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCompleting ? (
                      <>
                        <Loader2 size={16} className="animate-spin inline mr-2" />
                        Saving...
                      </>
                    ) : (
                      'Mark as Complete'
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
