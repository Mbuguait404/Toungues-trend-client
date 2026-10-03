import { apiFetch } from '@/lib/api'

export interface Payment {
  _id: string
  userId: string
  courseId?: string | { _id: string; title: string; language: string }
  enrollmentId?: string
  level?: string
  purchaseType?: string
  amount: number
  currency: string
  method: 'payhero' | 'stripe' | string
  status: 'pending' | 'success' | 'failed'
  reference: string
  createdAt: string
}

export interface StartCoursePayment {
  courseId: string
  level: string
  phoneNumber: string
}

export interface PaymentInitiationResult {
  paymentId: string
  success: boolean
  status: string
  reference: string
  CheckoutRequestID?: string
}

export function startPayHeroCoursePayment(data: StartCoursePayment): Promise<PaymentInitiationResult> {
  return apiFetch<PaymentInitiationResult>('/payments/payhero/initiate', {
    method: 'POST',
    body: data,
    auth: true,
  })
}

export function getMyPayments(): Promise<Payment[]> {
  return apiFetch<Payment[]>('/payments/me', { auth: true })
}

export function getMyPayment(id: string): Promise<Payment> {
  return apiFetch<Payment>(`/payments/${id}`, { auth: true })
}