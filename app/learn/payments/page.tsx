'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, CreditCard, Loader2 } from 'lucide-react'
import LearnTopbar from '@/components/learn-topbar'
import { getMyPayments, type Payment } from '@/lib/api/payments'
import { ApiException } from '@/lib/api'

const STATUS_STYLES: Record<Payment['status'], string> = {
  pending: 'bg-amber-100 text-amber-800',
  success: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
}

function courseTitle(payment: Payment) {
  return typeof payment.courseId === 'object' ? payment.courseId.title : 'Course payment'
}

function courseId(payment: Payment) {
  return typeof payment.courseId === 'object' ? payment.courseId._id : payment.courseId
}

export default function LearnerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMyPayments()
      .then(setPayments)
      .catch((err) => setError(err instanceof ApiException ? err.message : 'Could not load payments'))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <>
      <LearnTopbar title="Payments" />
      <main className="flex-1 overflow-auto p-5">
        <div className="mx-auto max-w-5xl space-y-5">
          <header>
            <h1 className="text-2xl font-bold text-navy">Payments and access</h1>
            <p className="mt-1 text-sm text-gray-500">Course purchases and their current access status.</p>
          </header>
          {isLoading ? (
            <div className="flex justify-center py-16 text-gray-400"><Loader2 className="animate-spin" /></div>
          ) : error ? (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} /> {error}
            </div>
          ) : payments.length === 0 ? (
            <div className="border-y border-gray-200 py-14 text-center">
              <CreditCard className="mx-auto mb-3 text-gray-400" size={28} />
              <p className="font-semibold text-navy">No payments yet</p>
              <Link href="/courses" className="mt-4 inline-flex rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy">
                Browse paid courses
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto border-y border-gray-200">
              <table className="w-full min-w-155 text-left">
                <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="py-3 pr-4">Course</th>
                    <th className="py-3 pr-4">Amount</th>
                    <th className="py-3 pr-4">Method</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="py-4 pr-4">
                        <p className="font-semibold text-navy">{courseTitle(payment)}</p>
                        {payment.level && <p className="text-xs text-gray-500">Level {payment.level}</p>}
                      </td>
                      <td className="py-4 pr-4 text-sm">{payment.currency} {payment.amount.toLocaleString()}</td>
                      <td className="py-4 pr-4 text-sm capitalize">{payment.method}</td>
                      <td className="py-4 pr-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[payment.status]}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {new Date(payment.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        {(payment.status === 'failed' || payment.status === 'pending') && courseId(payment) && (
                          <Link href={`/courses?checkout=${courseId(payment)}&level=${payment.level ?? 'A1'}`} className="ml-3 font-semibold text-gold">
                            {payment.status === 'failed' ? 'Retry' : 'Continue'}
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  )
}