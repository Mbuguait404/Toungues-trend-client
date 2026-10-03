'use client'

import { useEffect, useState, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import LearnTopbar from '@/components/learn-topbar'
import { Download, FileText, Volume2, Video, File, Loader2, AlertCircle, CheckCircle2, Clock, Target, LockKeyhole } from 'lucide-react'
import { getModuleById, type CourseModule } from '@/lib/api/modules'
import { getMaterials, type Material } from '@/lib/api/materials'
import { getEnrollmentProgress, updateProgress, type Progress } from '@/lib/api/progress'
import QuizWidget from '@/components/quiz-widget'
import { ApiException } from '@/lib/api'
import { Reveal } from '@/components/motion'

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
  const router = useRouter()
  const enrollmentId = searchParams.get('enrollmentId')

  const [mod, setModule] = useState<CourseModule | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [progress, setProgress] = useState<Progress | null>(null)
  const [partProgress, setPartProgress] = useState<Record<string, Progress>>({})
  const [materialProgress, setMaterialProgress] = useState<Record<string, Progress>>({})
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
          const found = progList.find((p) => p.moduleId === moduleId && !p.partId && !p.materialId)
          if (found) setProgress(found)
          const partMap: Record<string, Progress> = {}
          const materialMap: Record<string, Progress> = {}
          for (const item of progList) {
            if (item.moduleId === moduleId && item.partId) partMap[item.partId] = item
            if (item.moduleId === moduleId && item.materialId) materialMap[item.materialId] = item
          }
          setPartProgress(partMap)
          setMaterialProgress(materialMap)
          for (const part of modData.parts ?? []) {
            if (!part.locked && part._id && !partMap[part._id]) {
              void updateProgress(enrollmentId, { moduleId, partId: part._id }).catch(() => {})
            }
          }
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

  const handlePartComplete = async (partId: string) => {
    if (!enrollmentId || partProgress[partId]?.isCompleted) return
    try {
      const result = await updateProgress(enrollmentId, { moduleId, partId, isCompleted: true })
      setPartProgress((current) => ({ ...current, [partId]: result }))
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to save lesson progress')
    }
  }

  const handleMaterialView = async (materialId: string) => {
    if (!enrollmentId || materialProgress[materialId]) return
    try {
      const result = await updateProgress(enrollmentId, { moduleId, materialId })
      setMaterialProgress((current) => ({ ...current, [materialId]: result }))
    } catch {
      setError('Could not save resource view progress.')
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
        <Reveal className="bg-navy rounded-2xl p-8 text-white mb-8" amount={0.1} duration={0.5} distance={20}>
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Poppins' }}>
            {mod.title}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm mt-3">
            <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">Level: {mod.level}</span>
            {(mod.estimatedDuration ?? 0) > 0 && (
              <span className="flex items-center gap-1">
                <Clock size={14} /> {mod.estimatedDuration} min
              </span>
            )}
          </div>
          {mod.description && (
            <p className="mt-3 text-gray-300">{mod.description}</p>
          )}
        </Reveal>

        <div className="space-y-6">
          {mod.objectives && mod.objectives.length > 0 && (
            <Reveal className="bg-white rounded-2xl p-6 border border-gray-100" amount={0.1} duration={0.5} distance={18}>
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
            </Reveal>
          )}

          {mod.content && (
            <Reveal className="bg-white rounded-2xl p-6 border border-gray-100" amount={0.1} duration={0.5} distance={18}>
              <h3 className="text-lg font-bold text-navy mb-4">Lesson Content</h3>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {mod.content}
              </div>
            </Reveal>
          )}

          {mod.parts && mod.parts.length > 0 && (
            <div className="space-y-4">
              {mod.parts.map((part) => (
                <Reveal key={part._id ?? part.order} className="bg-white rounded-2xl p-6 border border-gray-100" amount={0.1} duration={0.5} distance={18}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-navy">{part.title}</h3>
                      <span className={`mt-1 inline-block text-xs font-semibold ${part.locked ? 'text-amber-700' : 'text-green-700'}`}>
                        {part.locked ? 'Premium lesson part' : 'Free preview'}
                      </span>
                    </div>
                    {part.locked && <LockKeyhole size={20} className="text-amber-600" />}
                    {!part.locked && part._id && partProgress[part._id]?.isCompleted && <CheckCircle2 size={20} className="text-green-600" />}
                  </div>
                  {part.locked ? (
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-sm text-gray-600 mb-3">Unlock the course to continue this lesson.</p>
                      <button
                        onClick={() => router.push(`/courses?checkout=${mod.courseId}&level=${mod.level}`)}
                        className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy hover:bg-gold-light"
                      >
                        Pay to unlock course
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{part.content}</div>
                      {enrollmentId && part._id && !partProgress[part._id]?.isCompleted && (
                        <button onClick={() => handlePartComplete(part._id!)} className="mt-4 text-sm font-semibold text-gold hover:text-gold-light">
                          Mark part complete
                        </button>
                      )}
                    </>
                  )}
                </Reveal>
              ))}
            </div>
          )}

          {mod.notes && (
            <Reveal className="bg-gold-50 rounded-2xl p-6 border border-gold/20" amount={0.1} duration={0.5} distance={18}>
              <h3 className="text-lg font-bold text-navy mb-3">Teacher Notes</h3>
              <p className="text-sm text-navy/80 whitespace-pre-wrap">{mod.notes}</p>
            </Reveal>
          )}

          <Reveal className="bg-white rounded-2xl p-6 border border-gray-100" amount={0.1} duration={0.5} distance={18}>
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
                        {materialProgress[m._id]?.eventType === 'viewed' && <p className="text-xs font-semibold text-green-700">Viewed</p>}
                      </div>
                    </div>
                    {m.fileUrl && !m.locked ? (
                      <a
                        href={m.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => void handleMaterialView(m._id)}
                        className="p-2 text-gold hover:bg-gold-100 rounded-lg transition-colors"
                      >
                        <Download size={20} />
                      </a>
                    ) : m.locked ? (
                      <button onClick={() => router.push(`/courses?checkout=${mod.courseId}&level=${mod.level}`)} className="text-xs font-semibold text-amber-700">
                        Unlock
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">No link</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Reveal>

          {!mod.locked && (
            <QuizWidget
              moduleId={moduleId}
              enrollmentId={enrollmentId ?? undefined}
              unlockHref={`/courses?checkout=${mod.courseId}&level=${mod.level}`}
            />
          )}

          {enrollmentId && !mod.locked && (mod.accessLevel === 'full' || mod.accessType === 'free') && (
            <Reveal className="bg-white rounded-2xl p-6 border border-gray-100" amount={0.1} duration={0.5} distance={18}>
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
            </Reveal>
          )}
        </div>
      </div>
    </>
  )
}
