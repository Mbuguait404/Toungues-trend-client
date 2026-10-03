'use client'

import { useEffect, useState } from 'react'
import TeachTopbar from '@/components/teach-topbar'
import { Reveal } from '@/components/motion'
import {
  Loader2, AlertCircle, CheckCircle2, Plus, ChevronDown, ChevronRight,
  Edit3, Trash2, BookOpen, Clock, FileText, Save, X,
} from 'lucide-react'
import { getAllCourses, type Course } from '@/lib/api/courses'
import { getModules, createModule, updateModule, deleteModule, type CourseModule } from '@/lib/api/modules'
import { getMaterialsByCourse, type Material } from '@/lib/api/materials'
import { ApiException } from '@/lib/api'

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export default function TeachModules() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')
  const [modules, setModules] = useState<CourseModule[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const [formTitle, setFormTitle] = useState('')
  const [formLevel, setFormLevel] = useState('A1')
  const [formOrder, setFormOrder] = useState(0)
  const [formDescription, setFormDescription] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formParts, setFormParts] = useState<Array<{ title: string; content: string; order: number; accessType: 'free' | 'premium' }>>([])
  const [formAccessType, setFormAccessType] = useState<'free' | 'premium'>('premium')
  const [formObjectives, setFormObjectives] = useState('')
  const [formDuration, setFormDuration] = useState(0)
  const [formNotes, setFormNotes] = useState('')
  const [formPublished, setFormPublished] = useState(true)

  useEffect(() => {
    getAllCourses()
      .then((courses) => {
        setCourses(courses.filter(c => c.isActive))
      })
      .catch((err) => setLoadError(err instanceof ApiException ? err.message : 'Failed to load courses'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedCourseId) {
      setModules([])
      setMaterials([])
      return
    }
    Promise.all([
      getModules({ courseId: selectedCourseId }),
      getMaterialsByCourse(selectedCourseId),
    ]).then(([mods, mats]) => {
      setModules(mods)
      setMaterials(mats)
    }).catch(() => {})
  }, [selectedCourseId])

  const modulesByLevel: Record<string, CourseModule[]> = {}
  for (const mod of modules) {
    if (!modulesByLevel[mod.level]) modulesByLevel[mod.level] = []
    modulesByLevel[mod.level].push(mod)
  }
  for (const levels of Object.values(modulesByLevel)) {
    levels.sort((a, b) => a.order - b.order)
  }

  const toggleLevel = (level: string) => {
    setExpandedLevels(prev => ({ ...prev, [level]: !prev[level] }))
  }

  const getMaterialsForModule = (moduleId: string) => {
    return materials.filter(m => m.moduleId === moduleId)
  }

  const openCreateForm = (level: string) => {
    const existing = modulesByLevel[level] || []
    const hasFreePart = modules.some((module) => module.parts?.some((part) => part.accessType === 'free'))
    setEditingId(null)
    setFormTitle('')
    setFormLevel(level)
    setFormOrder(existing.length + 1)
    setFormDescription('')
    setFormContent('')
    setFormParts([{ title: 'Introduction', content: '', order: 0, accessType: hasFreePart ? 'premium' : 'free' }])
    setFormAccessType('premium')
    setFormObjectives('')
    setFormDuration(0)
    setFormNotes('')
    setFormPublished(true)
    setFormError(null)
    setShowCreateForm(true)
  }

  const openEditForm = (mod: CourseModule) => {
    setEditingId(mod._id)
    setFormTitle(mod.title)
    setFormLevel(mod.level)
    setFormOrder(mod.order)
    setFormDescription(mod.description || '')
    setFormContent(mod.content || '')
    setFormParts(mod.parts?.length
      ? mod.parts.map((part) => ({
          title: part.title,
          content: part.content ?? '',
          order: part.order,
          accessType: part.accessType,
        }))
      : [])
    setFormAccessType(mod.accessType ?? 'premium')
    setFormObjectives((mod.objectives || []).join('\n'))
    setFormDuration(mod.estimatedDuration || 0)
    setFormNotes(mod.notes || '')
    setFormPublished(mod.isPublished !== false)
    setFormError(null)
    setShowCreateForm(true)
  }

  const cancelForm = () => {
    setShowCreateForm(false)
    setEditingId(null)
    setFormError(null)
  }

  const handleSave = async () => {
    if (!formTitle.trim()) {
      setFormError('Title is required.')
      return
    }
    setFormError(null)
    setSaving(true)
    try {
      const payload = {
        courseId: selectedCourseId,
        title: formTitle,
        level: formLevel,
        order: formOrder,
        description: formDescription,
        content: formContent,
        parts: formParts,
        accessType: formAccessType,
        objectives: formObjectives.split('\n').map(s => s.trim()).filter(Boolean),
        estimatedDuration: formDuration,
        notes: formNotes,
        isPublished: formPublished,
      }
      if (editingId) {
        const updated = await updateModule(editingId, payload)
        setModules(prev => prev.map(m => m._id === editingId ? updated : m))
      } else {
        const created = await createModule(payload)
        setModules(prev => [...prev, created])
      }
      cancelForm()
    } catch (err) {
      setFormError(err instanceof ApiException ? err.message : 'Failed to save module')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this module? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await deleteModule(id)
      setModules(prev => prev.filter(m => m._id !== id))
    } catch {
      alert('Failed to delete module')
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <TeachTopbar title="Modules" />
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 size={32} className="animate-spin mr-3" />
          Loading…
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TeachTopbar title="Modules" />
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6 max-w-7xl">
          {loadError && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle size={18} />
              {loadError}
            </div>
          )}

          <Reveal className="bg-white rounded-2xl border border-gray-100 p-6" direction="up" duration={0.5} distance={20}>
            <label className="block text-sm font-semibold text-navy mb-3">Select Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full md:w-96 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-navy"
            >
              <option value="">— Choose a course —</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.title} ({c.language})</option>
              ))}
            </select>
          </Reveal>

          {!selectedCourseId ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
              <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Select a course to manage its modules</p>
            </div>
          ) : showCreateForm ? (
            <Reveal className="bg-white rounded-2xl border border-gray-100 p-6" direction="up" duration={0.5} distance={20} amount={0.05}>
              <h3 className="text-lg font-bold text-navy mb-4">
                {editingId ? 'Edit Module' : 'Create New Module'}
              </h3>
              {formError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">
                  <AlertCircle size={16} /> {formError}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Title *</label>
                  <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Level</label>
                  <select value={formLevel} onChange={(e) => setFormLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-sm">
                    {CEFR_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Order</label>
                  <input type="number" value={formOrder} onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-sm" min={0} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Duration (minutes)</label>
                  <input type="number" value={formDuration} onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-sm" min={0} />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-navy mb-1">Description</label>
                <input type="text" value={formDescription} onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-sm" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-navy mb-1">Content / Lesson Body</label>
                <textarea value={formContent} onChange={(e) => setFormContent(e.target.value)} rows={6}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-sm resize-y" />
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-semibold text-navy">Lesson parts</h4>
                    <p className="text-xs text-gray-500">Only free parts are visible before course payment.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormParts((parts) => [...parts, {
                      title: '', content: '', order: parts.length,
                      accessType: 'premium',
                    }])}
                    className="flex items-center gap-1 text-xs font-semibold text-navy hover:text-gold"
                  >
                    <Plus size={14} /> Add part
                  </button>
                </div>
                <div className="space-y-3">
                  {formParts.map((part, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 p-3 space-y-2">
                      <div className="grid grid-cols-[1fr_auto_auto] gap-2">
                        <input
                          value={part.title}
                          onChange={(e) => setFormParts((parts) => parts.map((item, i) => i === index ? { ...item, title: e.target.value } : item))}
                          placeholder={`Part ${index + 1} title`}
                          className="min-w-0 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                        <select
                          value={part.accessType}
                          onChange={(e) => setFormParts((parts) => parts.map((item, i) => i === index ? { ...item, accessType: e.target.value as 'free' | 'premium' } : item))}
                          className="rounded-lg border border-gray-200 bg-white px-2 text-sm"
                        >
                          <option value="free">Free preview</option>
                          <option value="premium">Premium</option>
                        </select>
                        <button type="button" onClick={() => setFormParts((parts) => parts.filter((_, i) => i !== index))} className="px-2 text-red-500" aria-label="Remove lesson part">×</button>
                      </div>
                      <textarea
                        value={part.content}
                        onChange={(e) => setFormParts((parts) => parts.map((item, i) => i === index ? { ...item, content: e.target.value } : item))}
                        rows={3}
                        placeholder="Part content"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-navy mb-1">Whole module access</label>
                <select value={formAccessType} onChange={(e) => setFormAccessType(e.target.value as 'free' | 'premium')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm">
                  <option value="premium">Premium (use part access above)</option>
                  <option value="free">Free module</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-navy mb-1">Learning Objectives (one per line)</label>
                <textarea value={formObjectives} onChange={(e) => setFormObjectives(e.target.value)} rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-sm resize-y" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-navy mb-1">Teacher Notes</label>
                <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-sm resize-y" />
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm text-navy">
                  <input type="checkbox" checked={formPublished} onChange={(e) => setFormPublished(e.target.checked)} />
                  Published (visible to learners)
                </label>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gold hover:bg-gold-light text-navy font-semibold rounded-full transition-all disabled:opacity-50">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingId ? 'Update Module' : 'Create Module'}
                </button>
                <button onClick={cancelForm}
                  className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-full hover:bg-gray-50 transition-all">
                  <X size={16} /> Cancel
                </button>
              </div>
            </Reveal>
          ) : null}

          {selectedCourseId && !showCreateForm && (
            <Reveal className="space-y-6" direction="up" duration={0.5} distance={20} delay={0.1} amount={0.05}>
              {CEFR_LEVELS.map((level) => {
                const levelModules = modulesByLevel[level] || []
                if (levelModules.length === 0) {
                  return (
                    <div key={level} className="bg-white rounded-2xl border border-gray-100 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-navy bg-gray-100 px-3 py-1 rounded-full">
                            {level}
                          </span>
                          <span className="text-xs text-gray-400">No modules yet</span>
                        </div>
                        <button onClick={() => openCreateForm(level)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gold text-navy text-xs font-semibold rounded-full hover:bg-gold-light transition-all">
                          <Plus size={14} /> Add Module
                        </button>
                      </div>
                    </div>
                  )
                }

                const isExpanded = expandedLevels[level] !== false
                return (
                  <div key={level} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => toggleLevel(level)}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
                        <span className="text-sm font-bold text-navy bg-navy/5 px-3 py-1 rounded-full">
                          {level}
                        </span>
                        <span className="text-xs text-gray-500">{levelModules.length} module{levelModules.length !== 1 ? 's' : ''}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); openCreateForm(level) }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gold text-navy text-xs font-semibold rounded-full hover:bg-gold-light transition-all"
                      >
                        <Plus size={14} /> Add
                      </button>
                    </button>
                    {isExpanded && (
                      <div className="border-t border-gray-100">
                        {levelModules.map((mod, idx) => {
                          const modMaterials = getMaterialsForModule(mod._id)
                          return (
                            <div key={mod._id} className={`p-4 flex items-start gap-4 ${idx < levelModules.length - 1 ? 'border-b border-gray-50' : ''}`}>
                              <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                {mod.order || idx + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="font-semibold text-navy text-sm">
                                      {mod.title}
                                      {mod.isPublished === false && (
                                        <span className="ml-2 text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Draft</span>
                                      )}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                      {mod.description && <p className="text-xs text-gray-500 truncate max-w-md">{mod.description}</p>}
                                      {(mod.estimatedDuration ?? 0) > 0 && (
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                          <Clock size={12} /> {mod.estimatedDuration} min
                                        </span>
                                      )}
                                      <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <FileText size={12} /> {modMaterials.length} material{modMaterials.length !== 1 ? 's' : ''}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <button onClick={() => openEditForm(mod)}
                                      className="p-1.5 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors">
                                      <Edit3 size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(mod._id)} disabled={deletingId === mod._id}
                                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                      {deletingId === mod._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                    </button>
                                  </div>
                                </div>
                                {mod.objectives && mod.objectives.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {mod.objectives.slice(0, 3).map((obj, i) => (
                                      <span key={i} className="text-[10px] bg-gold-50 text-navy px-2 py-0.5 rounded-full">
                                        {obj}
                                      </span>
                                    ))}
                                    {mod.objectives.length > 3 && (
                                      <span className="text-[10px] text-gray-400">+{mod.objectives.length - 3} more</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </Reveal>
          )}
        </div>
      </div>
    </div>
  )
}
