'use client'

import { useEffect, useState } from 'react'
import { Loader2, Trophy, AlertCircle, CheckCircle2, XCircle, BookOpen } from 'lucide-react'
import { getQuizzesByModule, getQuizById, submitQuizAttempt, getQuizAttempts, type Quiz, type QuizAttempt, type QuizQuestion } from '@/lib/api/quizzes'
import { ApiException } from '@/lib/api'

interface QuizWidgetProps {
  moduleId: string
  enrollmentId?: string
}

export default function QuizWidget({ moduleId }: QuizWidgetProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getQuizzesByModule(moduleId)
      .then(async (list) => {
        const enriched: Quiz[] = []
        for (const q of list) {
          try {
            const attempts = await getQuizAttempts(q._id)
            if (attempts.some(a => a.passed)) {
              ;(q as any)._passed = true
            }
          } catch {}
          enriched.push(q)
        }
        setQuizzes(enriched)
      })
      .catch(() => setQuizzes([]))
      .finally(() => setIsLoading(false))
  }, [moduleId])

  const startQuiz = async (quizId: string) => {
    try {
      const quiz = await getQuizById(quizId)
      setActiveQuiz(quiz)
      setAnswers(new Array(quiz.questions.length).fill(-1))
      setResult(null)
      setError(null)
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to load quiz')
    }
  }

  const handleSubmit = async () => {
    if (!activeQuiz) return
    if (answers.includes(-1)) {
      setError('Please answer all questions before submitting.')
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      const attempt = await submitQuizAttempt(activeQuiz._id, answers)
      setResult({ score: attempt.score, passed: attempt.passed })
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to submit quiz')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = optionIndex
    setAnswers(newAnswers)
  }

  if (isLoading) return null

  if (quizzes.length === 0) return null

  if (activeQuiz && !result) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-navy">{activeQuiz.title}</h3>
          <span className="text-xs text-gray-500">{activeQuiz.questions.length} questions</span>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="space-y-6">
          {activeQuiz.questions.map((q: QuizQuestion, qi: number) => (
            <div key={qi} className="border border-gray-100 rounded-xl p-4">
              <p className="font-semibold text-navy text-sm mb-3">
                {qi + 1}. {q.questionText}
              </p>
              <div className="space-y-2">
                {q.options.map((opt: string, oi: number) => (
                  <label
                    key={oi}
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors text-sm ${
                      answers[qi] === oi
                        ? 'bg-gold-50 border border-gold'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${qi}`}
                      checked={answers[qi] === oi}
                      onChange={() => handleSelectAnswer(qi, oi)}
                      className="accent-gold"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-gold hover:bg-gold-light text-navy font-semibold rounded-full transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
            Submit Answers
          </button>
          <button
            onClick={() => { setActiveQuiz(null); setError(null); setResult(null) }}
            className="px-6 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-full hover:bg-gray-50 transition-all"
          >
            Back
          </button>
        </div>
      </div>
    )
  }

  if (activeQuiz && result) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mt-6">
        <div className={`text-center py-8 ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
          {result.passed ? (
            <>
              <Trophy size={48} className="mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-1">Congratulations!</h3>
              <p className="text-sm">You passed with a score of {result.score}%</p>
            </>
          ) : (
            <>
              <XCircle size={48} className="mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-1">Keep Trying!</h3>
              <p className="text-sm">You scored {result.score}%. {result.score >= 50 ? "Almost there! Review and try again." : "Review the module content and try again."}</p>
            </>
          )}
        </div>
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => startQuiz(activeQuiz._id)}
            className="px-6 py-2.5 bg-gold hover:bg-gold-light text-navy font-semibold rounded-full transition-all"
          >
            Try Again
          </button>
          <button
            onClick={() => { setActiveQuiz(null); setError(null); setResult(null) }}
            className="px-6 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-full hover:bg-gray-50 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 mt-6">
      <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
        <BookOpen size={20} className="text-gold" />
        Quizzes
      </h3>
      <div className="space-y-3">
        {quizzes.map((q) => (
          <div key={q._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              {(q as any)._passed ? (
                <CheckCircle2 size={20} className="text-green-500" />
              ) : (
                <BookOpen size={20} className="text-gold" />
              )}
              <div>
                <p className="font-semibold text-navy text-sm">{q.title}</p>
                <p className="text-xs text-gray-500">{q.questions.length} questions • Pass: {q.passScore}%</p>
              </div>
            </div>
            <button
              onClick={() => startQuiz(q._id)}
              className="px-4 py-1.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-full transition-all"
            >
              {(q as any)._passed ? 'Retake' : 'Start'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
