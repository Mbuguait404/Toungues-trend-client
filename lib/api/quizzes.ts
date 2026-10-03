import { apiFetch } from '@/lib/api'

export interface QuizQuestion {
  questionText: string
  options: string[]
  correctIndex?: number
  explanation?: string
}

export interface Quiz {
  _id: string
  moduleId: string
  title: string
  accessType?: 'free' | 'premium'
  locked?: boolean
  questions: QuizQuestion[]
  passScore: number
  createdBy: string
  createdAt: string
}

export interface QuizAttempt {
  _id: string
  userId: string
  quizId: string
  answers: number[]
  score: number
  passed: boolean
  attemptedAt: string
}

export function getQuizzesByModule(moduleId: string): Promise<Quiz[]> {
  return apiFetch<Quiz[]>(`/quizzes/module/${moduleId}`, { auth: true })
}

export function getQuizById(id: string): Promise<Quiz> {
  return apiFetch<Quiz>(`/quizzes/${id}`, { auth: true })
}

export function submitQuizAttempt(quizId: string, answers: number[]): Promise<QuizAttempt> {
  return apiFetch<QuizAttempt>(`/quizzes/${quizId}/submit`, {
    method: 'POST',
    body: { answers },
    auth: true,
  })
}

export function getQuizAttempts(quizId: string): Promise<QuizAttempt[]> {
  return apiFetch<QuizAttempt[]>(`/quizzes/${quizId}/attempts`, { auth: true })
}

export function createQuiz(data: Partial<Quiz>): Promise<Quiz> {
  return apiFetch<Quiz>('/quizzes', { method: 'POST', body: data, auth: true })
}

export function updateQuiz(id: string, data: Partial<Quiz>): Promise<Quiz> {
  return apiFetch<Quiz>(`/quizzes/${id}`, { method: 'PUT', body: data, auth: true })
}

export function deleteQuiz(id: string): Promise<void> {
  return apiFetch<void>(`/quizzes/${id}`, { method: 'DELETE', auth: true })
}
