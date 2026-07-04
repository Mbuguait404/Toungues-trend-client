'use client'

import LearnTopbar from '@/components/learn-topbar'
import { useState } from 'react'
import { Download, FileText, Volume2 } from 'lucide-react'

export default function ModulePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'materials' | 'quiz' | 'notes'>('materials')
  const [materialsViewed, setMaterialsViewed] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const module = {
    title: 'Everyday Conversations',
    level: 'A2 - Elementary',
    language: 'French',
  }

  const materials = [
    {
      id: 1,
      name: 'Lesson Slides.pdf',
      size: '2.4 MB',
      type: 'pdf',
    },
    {
      id: 2,
      name: 'Vocabulary List.pdf',
      size: '1.2 MB',
      type: 'pdf',
    },
    {
      id: 3,
      name: 'Pronunciation Guide.mp3',
      size: '15 MB',
      type: 'audio',
    },
  ]

  const quizQuestions = [
    {
      id: 1,
      question: 'How do you say "Good morning" in French?',
      options: ['Bonsoir', 'Bonjour', 'Bonne nuit', 'Au revoir'],
      correct: 1,
    },
    {
      id: 2,
      question: 'What is the correct response to "Comment allez-vous?"',
      options: ['Je vais mal', 'Je vais bien', 'Je suis ici', 'Je sais pas'],
      correct: 1,
    },
    {
      id: 3,
      question: 'Complete: "Je m\'appelle ___"',
      options: ['suis', 'est', 'am', 'N/A'],
      correct: 3,
    },
  ]

  return (
    <>
      <LearnTopbar title={module.title} />
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Module Header */}
        <div className="bg-white border-b border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{module.language === 'French' ? '🇫🇷' : '🇬🇧'}</span>
            <h1 className="text-2xl font-bold text-navy">{module.title}</h1>
            <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-semibold">
              {module.level}
            </span>
          </div>
          <p className="text-gray-600 text-sm">Master essential phrases for daily conversations</p>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-100 px-6 flex gap-6">
          {(['materials', 'quiz', 'notes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 font-semibold text-sm transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-gold text-gold'
                  : 'border-transparent text-gray-600 hover:text-navy'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Materials Tab */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-navy mb-4">Course Materials</h3>
              <div className="space-y-3">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    onClick={() => setMaterialsViewed(true)}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gold hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {material.type === 'pdf' ? (
                          <FileText size={24} className="text-red-500" />
                        ) : (
                          <Volume2 size={24} className="text-blue-500" />
                        )}
                        <div>
                          <p className="font-semibold text-navy text-sm">{material.name}</p>
                          <p className="text-xs text-gray-500">{material.size}</p>
                        </div>
                      </div>
                      <button className="text-gold font-semibold text-sm hover:text-gold-light flex items-center gap-1">
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                ✓ All materials viewed
              </p>
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-navy">Module Quiz</h3>
              {quizQuestions.map((q) => (
                <div key={q.id} className="bg-white rounded-xl p-6 border border-gray-100">
                  <p className="font-semibold text-navy mb-4 text-sm">Question {q.id}</p>
                  <p className="text-navy font-medium mb-4">{q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((option, idx) => (
                      <label key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gold hover:bg-gold/5 cursor-pointer transition-all">
                        <input
                          type="radio"
                          name={`q${q.id}`}
                          className="w-4 h-4 accent-gold"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-navy mb-4">Your Notes</h3>
              <textarea
                placeholder="Add your notes here..."
                className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-sm"
              />
              <button className="bg-gold text-navy px-6 py-2 rounded-full font-semibold text-sm hover:bg-gold-light transition-all">
                Save Notes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex items-center justify-between md:pl-64">
        <p className="text-sm text-gray-600">
          {materialsViewed ? (
            <span className="text-green-600 font-semibold">✓ All materials reviewed</span>
          ) : (
            <span>Review all materials to unlock completion</span>
          )}
        </p>
        <button
          onClick={() => setIsCompleted(true)}
          disabled={!materialsViewed}
          className="bg-gold text-navy px-8 py-2 rounded-full font-semibold text-sm hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Mark Complete
        </button>
      </div>
    </>
  )
}
