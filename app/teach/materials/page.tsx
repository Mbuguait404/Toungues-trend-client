'use client'

import TeachTopbar from '@/components/teach-topbar'
import { Upload, FileText, Music, Video, File, Eye, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function TeachMaterials() {
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [courseFilter, setCourseFilter] = useState('all')
  const [moduleFilter, setModuleFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const allMaterials = [
    {
      id: 1,
      title: 'A1 Vocabulary List',
      course: 'French',
      module: 'A1',
      type: 'PDF',
      uploadDate: '2024-06-15',
      views: 12,
    },
    {
      id: 2,
      title: 'Conversation Practice Audio',
      course: 'French',
      module: 'A2',
      type: 'Audio',
      uploadDate: '2024-06-14',
      views: 8,
    },
    {
      id: 3,
      title: 'B1 Grammar Review',
      course: 'English',
      module: 'B1',
      type: 'PDF',
      uploadDate: '2024-06-13',
      views: 15,
    },
    {
      id: 4,
      title: 'Business English Tutorial',
      course: 'English',
      module: 'B2',
      type: 'Video',
      uploadDate: '2024-06-12',
      views: 22,
    },
    {
      id: 5,
      title: 'Beginner German Phrases',
      course: 'German',
      module: 'A1',
      type: 'Audio',
      uploadDate: '2024-06-11',
      views: 5,
    },
    {
      id: 6,
      title: 'Advanced German Literature',
      course: 'German',
      module: 'B2',
      type: 'PDF',
      uploadDate: '2024-06-10',
      views: 3,
    },
  ]

  let filtered = allMaterials.filter((material) => {
    const matchesCourse = courseFilter === 'all' || material.course === courseFilter
    const matchesModule = moduleFilter === 'all' || material.module === moduleFilter
    const matchesType = typeFilter === 'all' || material.type === typeFilter
    return matchesCourse && matchesModule && matchesType
  })

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText size={24} className="text-red-500" />
      case 'Audio':
        return <Music size={24} className="text-blue-500" />
      case 'Video':
        return <Video size={24} className="text-purple-500" />
      default:
        return <File size={24} className="text-gray-500" />
    }
  }

  const handleFileUpload = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setUploadFile(files[0])
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

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileUpload}
              className="border-2 border-dashed border-gold rounded-lg p-12 text-center hover:bg-gold-50 transition-colors cursor-pointer mb-6"
            >
              {uploadFile ? (
                <div>
                  <p className="text-navy font-semibold mb-2 text-lg">{uploadFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {(uploadFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto text-gold mb-3" size={40} />
                  <p className="text-navy font-semibold mb-1 text-lg">Drag files here to upload</p>
                  <p className="text-sm text-gray-600">PDF, MP3, MP4, DOCX supported</p>
                </div>
              )}
            </div>

            {uploadFile && (
              <div className="space-y-4 bg-gray-50 rounded-lg p-6">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Material Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter material title"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Course *
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                      <option>Select Course</option>
                      <option>French</option>
                      <option>English</option>
                      <option>German</option>
                      <option>Kiswahili</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Module *
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                      <option>Select Module</option>
                      <option>A1</option>
                      <option>A2</option>
                      <option>B1</option>
                      <option>B2</option>
                      <option>C1</option>
                      <option>C2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Material Type *
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                      <option>Select Type</option>
                      <option>PDF</option>
                      <option>Audio</option>
                      <option>Video</option>
                      <option>Document</option>
                    </select>
                  </div>
                </div>

                <button className="w-full px-4 py-3 bg-gold hover:bg-gold-light text-navy font-semibold rounded-full transition-all duration-150">
                  Upload Material
                </button>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
              Filter Materials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="all">All Courses</option>
                <option value="French">French</option>
                <option value="English">English</option>
                <option value="German">German</option>
                <option value="Kiswahili">Kiswahili</option>
              </select>

              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="all">All Modules</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="all">All Types</option>
                <option value="PDF">PDF</option>
                <option value="Audio">Audio</option>
                <option value="Video">Video</option>
              </select>
            </div>
          </div>

          {/* Materials Library */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
              Uploaded Materials ({filtered.length})
            </h3>

            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No materials found. Try adjusting your filters or upload a new material.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((material) => (
                  <div
                    key={material.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-150"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">{getFileIcon(material.type)}</div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gold-50 text-gold">
                        {material.type}
                      </span>
                    </div>

                    <h4 className="font-semibold text-navy mb-2" style={{ fontFamily: 'Poppins' }}>
                      {material.title}
                    </h4>

                    <div className="space-y-1 mb-4">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">{material.course}</span> • {material.module}
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded {new Date(material.uploadDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                      <Eye size={16} className="text-gold" />
                      <span className="text-sm text-gray-600">{material.views} views</span>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold text-navy">
                        <Edit size={16} />
                        Edit
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm font-semibold text-red-600">
                        <Trash2 size={16} />
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
