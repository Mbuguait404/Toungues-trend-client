'use client'

import TeachTopbar from '@/components/teach-topbar'
import { Upload, FileText, Music, Video, File, Trash2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { getMyMaterials, uploadMaterial } from '@/lib/api/teacher'
import { deleteMaterial, type Material } from '@/lib/api/materials'
import { ApiException } from '@/lib/api'

function getFileIcon(type: string) {
  const t = type.toLowerCase()
  if (t.includes('pdf')) return <FileText size={24} className="text-red-500" />
  if (t.includes('audio') || t.includes('mp3')) return <Music size={24} className="text-blue-500" />
  if (t.includes('video') || t.includes('mp4')) return <Video size={24} className="text-purple-500" />
  return <File size={24} className="text-gray-500" />
}

export default function TeachMaterials() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getMyMaterials()
      .then(setMaterials)
      .catch((err) => setLoadError(err instanceof ApiException ? err.message : 'Failed to load materials'))
      .finally(() => setIsLoading(false))
  }, [])

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) setUploadFile(files[0])
  }

  const handleUpload = async () => {
    if (!uploadFile || !title.trim()) {
      setUploadError('Please provide a title and select a file.')
      return
    }
    setUploadError(null)
    setUploading(true)
    setUploadSuccess(false)
    try {
      const fd = new FormData()
      fd.append('file', uploadFile)
      fd.append('title', title)
      const newMaterial = await uploadMaterial(fd)
      setMaterials((prev) => [newMaterial, ...prev])
      setUploadFile(null)
      setTitle('')
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (err) {
      setUploadError(err instanceof ApiException ? err.message : 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this material?')) return
    setDeletingId(id)
    try {
      await deleteMaterial(id)
      setMaterials((prev) => prev.filter((m) => m._id !== id))
    } catch {
      alert('Failed to delete material.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TeachTopbar title="Materials" />
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6 max-w-7xl">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-navy mb-6" style={{ fontFamily: 'Poppins' }}>
              Upload New Material
            </h2>

            {uploadSuccess && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm mb-4">
                <CheckCircle2 size={18} />
                Material uploaded successfully!
              </div>
            )}
            {uploadError && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">
                <AlertCircle size={18} />
                {uploadError}
              </div>
            )}

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gold rounded-lg p-12 text-center hover:bg-gold-50 transition-colors cursor-pointer mb-6"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.mp3,.mp4,.docx,.pptx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setUploadFile(e.target.files[0])
                }}
              />
              {uploadFile ? (
                <div>
                  <p className="text-navy font-semibold mb-2 text-lg">{uploadFile.name}</p>
                  <p className="text-sm text-gray-600">{(uploadFile.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto text-gold mb-3" size={40} />
                  <p className="text-navy font-semibold mb-1 text-lg">Drag & click to upload</p>
                  <p className="text-sm text-gray-600">PDF, MP3, MP4, DOCX supported</p>
                </div>
              )}
            </div>

            {uploadFile && (
              <div className="space-y-4 bg-gray-50 rounded-lg p-6">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">Material Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter material title"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-gold hover:bg-gold-light text-navy font-semibold rounded-full transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                  {uploading ? 'Uploading…' : 'Upload Material'}
                </button>
              </div>
            )}
          </div>

          {/* Materials Library */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
              Uploaded Materials ({materials.length})
            </h3>

            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-gray-400">
                <Loader2 size={28} className="animate-spin mr-2" />
                Loading…
              </div>
            ) : loadError ? (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <AlertCircle size={18} />
                {loadError}
              </div>
            ) : materials.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No materials uploaded yet. Upload your first material above.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((m) => (
                  <div key={m._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-150">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">{getFileIcon(m.fileType)}</div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gold-50 text-gold uppercase">
                        {m.fileType}
                      </span>
                    </div>

                    <h4 className="font-semibold text-navy mb-2" style={{ fontFamily: 'Poppins' }}>
                      {m.title}
                    </h4>

                    <p className="text-xs text-gray-500 mb-4">
                      Uploaded {new Date(m.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </p>

                    <div className="flex gap-2">
                      <a
                        href={m.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold text-navy"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(m._id)}
                        disabled={deletingId === m._id}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm font-semibold text-red-600 disabled:opacity-50"
                      >
                        {deletingId === m._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
