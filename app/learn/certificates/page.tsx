import LearnTopbar from '@/components/learn-topbar'
import { Award, Download, Share2 } from 'lucide-react'

export default function CertificatesPage() {
  const certificates = [
    {
      id: 1,
      language: '🇫🇷 French',
      level: 'A1 - Beginner',
      dateIssued: 'December 15, 2023',
    },
  ]

  return (
    <>
      <LearnTopbar title="Certificates" />
      <div className="flex-1 overflow-y-auto p-6">
        {certificates.length > 0 ? (
          <div>
            <h3 className="text-xl font-bold text-navy mb-6">Your Certificates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl p-6 border-2 border-gold hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Award size={28} className="text-gold" />
                    <h4 className="text-lg font-bold text-navy">{cert.language}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{cert.level}</p>
                  <p className="text-xs text-gray-500 mb-6">Issued: {cert.dateIssued}</p>

                  <div className="bg-white rounded-xl p-4 mb-4 border border-gold/20">
                    <p className="text-xs font-semibold text-gold mb-2">CERTIFICATE ID</p>
                    <p className="text-sm font-mono text-gray-600">TT-2023-FR-A1-001</p>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-gold text-navy px-4 py-2 rounded-full font-semibold text-sm hover:bg-gold-light transition-all">
                      <Download size={16} />
                      Download
                    </button>
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
