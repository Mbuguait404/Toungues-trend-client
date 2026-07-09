'use client'

import { useEffect, useState } from 'react'
import AdminTopBar from '@/components/admin-topbar'
import { DollarSign, Loader2, AlertCircle, X } from 'lucide-react'
import { getAllPayments, type Payment } from '@/lib/api/admin'

const METHOD_COLORS: Record<string, string> = {
  MPESA: 'bg-green-100 text-green-700',
  STRIPE: 'bg-blue-100 text-blue-700',
}

const STATUS_COLORS: Record<string, string> = {
  SUCCESS: 'bg-green-100 text-green-700',
  PENDING: 'bg-amber-100 text-amber-700',
  FAILED: 'bg-red-100 text-red-700',
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  useEffect(() => {
    getAllPayments()
      .then(setPayments)
      .catch((err) => setError(err?.message ?? 'Failed to load payments'))
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = payments.filter((p) =>
    statusFilter === 'ALL' ? true : p.status === statusFilter,
  )

  const successPayments = payments.filter((p) => p.status === 'SUCCESS')
  const pendingPayments = payments.filter((p) => p.status === 'PENDING')
  const failedPayments = payments.filter((p) => p.status === 'FAILED')
  const totalRevenue = successPayments.reduce((a, p) => a + p.amount, 0)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AdminTopBar title="Payments" />
      <div className="flex-1 overflow-auto p-8 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={32} className="animate-spin mr-3" />
            Loading payments…
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Revenue', value: `KES ${totalRevenue.toLocaleString()}`, icon: DollarSign, bg: 'bg-gold/10', color: 'text-gold' },
                { label: 'Pending', value: pendingPayments.length, icon: DollarSign, bg: 'bg-amber-100', color: 'text-amber-600' },
                { label: 'Failed', value: failedPayments.length, icon: DollarSign, bg: 'bg-red-100', color: 'text-red-600' },
              ].map((card) => (
                <div key={card.label} className="bg-white rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-mid text-sm mb-1">{card.label}</p>
                      <p className="text-3xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                        {card.value}
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center`}>
                      <card.icon size={24} className={card.color} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              {['ALL', 'SUCCESS', 'PENDING', 'FAILED'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${statusFilter === s ? 'bg-gold text-navy' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 text-sm text-gray-500">
                {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-light border-b border-gray-100">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Method</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                          No {statusFilter === 'ALL' ? '' : statusFilter.toLowerCase() + ' '}payments.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((p, idx) => (
                        <tr key={p._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-light'}>
                          <td className="px-6 py-4 text-sm font-semibold text-navy">
                            {p.currency} {p.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${METHOD_COLORS[p.method] ?? 'bg-gray-100 text-gray-600'}`}>
                              {p.method}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[p.status] ?? 'bg-gray-100 text-gray-600'}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-dark">
                            {new Date(p.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </td>
                          <td className="px-6 py-4">
                            <button onClick={() => setSelectedPayment(p)} className="text-gold font-semibold text-sm hover:text-gold-light transition-colors">
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail modal */}
            {selectedPayment && (
              <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelectedPayment(null)}>
                <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-navy">Payment Details</h3>
                    <button onClick={() => setSelectedPayment(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
                  </div>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between"><dt className="text-gray-500">ID</dt><dd className="font-mono text-xs">{selectedPayment._id}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Amount</dt><dd className="font-bold text-navy">{selectedPayment.currency} {selectedPayment.amount.toLocaleString()}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Method</dt><dd>{selectedPayment.method}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Status</dt>
                      <dd><span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[selectedPayment.status]}`}>{selectedPayment.status}</span></dd>
                    </div>
                    <div className="flex justify-between"><dt className="text-gray-500">Date</dt><dd>{new Date(selectedPayment.createdAt).toLocaleString()}</dd></div>
                  </dl>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
