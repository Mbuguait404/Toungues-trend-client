'use client'

import { useEffect, useState } from 'react'
import LearnTopbar from '@/components/learn-topbar'
import { Award, Download, Share2, Loader2, AlertCircle } from 'lucide-react'
import { getMyCertificates, type Certificate } from '@/lib/api/certificates'
import { ApiException } from '@/lib/api'

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMyCertificates()
      .then(setCertificates)
      .catch((err) =>
        setError(err instanceof ApiException ? err.message : 'Failed to load certificates'),
      )
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <>
      <LearnTopbar title="Certificates" />
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 size={32} className="animate-spin mr-3" />
            Loading certificates…
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        ) : certificates.length > 0 ? (
          <div>
            <h3 className="text-xl font-bold text-navy mb-6">Your Certificates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert._id}
                  className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl p-6 border-2 border-gold hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Award size={28} className="text-gold" />
                    <h4 className="text-lg font-bold text-navy">
                      {cert.language ?? cert.courseName ?? 'Course'}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{cert.level ?? '—'}</p>
                  <p className="text-xs text-gray-500 mb-6">
                    Issued:{' '}
                    {new Date(cert.issuedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </p>

                  <div className="bg-white rounded-xl p-4 mb-4 border border-gold/20">
                    <p className="text-xs font-semibold text-gold mb-1">CERTIFICATE ID</p>
                    <p className="text-sm font-mono text-gray-600">{cert._id.slice(-12).toUpperCase()}</p>
                  </div>

                  <div className="flex gap-2">
                    {cert.certificateUrl ? (
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-gold text-navy px-4 py-2 rounded-full font-semibold text-sm hover:bg-gold-light transition-all"
                      >
                        <Download size={16} />
                        Download
                      </a>
                    ) : (
                      <button disabled className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-400 px-4 py-2 rounded-full font-semibold text-sm cursor-not-allowed">
                        <Download size={16} />
                        Download
                      </button>
                    )}
                    <button className="flex-1 flex items-center justify-center gap-2 border-2 border-gold text-gold px-4 py-2 rounded-full font-semibold text-sm hover:bg-gold/5 transition-all">
                      <Share2 size={16} />
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Award size={64} className="text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No Certificates Yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              Complete a course level to earn your first certificate. Keep learning and achieving your language goals!
            </p>
            <a
              href="/learn/courses"
              className="bg-gold text-navy px-6 py-3 rounded-full font-semibold text-sm hover:bg-gold-light transition-all"
            >
              Continue Learning
            </a>
          </div>
        )}
      </div>
    </>
  )
}
