'use client'

import { useState } from 'react'
import AdminTopBar from '@/components/admin-topbar'
import { DollarSign, Download, Eye, Calendar, X } from 'lucide-react'

const payments = [
  { id: 'TXN001', learner: 'Amara Kipchoge', amount: 3000, currency: 'KES', method: 'M-Pesa', status: 'Success', date: 'Jan 15, 2025', time: '2:30 PM' },
  { id: 'TXN002', learner: 'Sophie Laurent', amount: 150, currency: 'CHF', method: 'Stripe', status: 'Success', date: 'Jan 14, 2025', time: '10:15 AM' },
  { id: 'TXN003', learner: 'James Kariuki', amount: 2500, currency: 'KES', method: 'M-Pesa', status: 'Success', date: 'Jan 13, 2025', time: '5:45 PM' },
  { id: 'TXN004', learner: 'Elsa Mueller', amount: 100, currency: 'EUR', method: 'Stripe', status: 'Pending', date: 'Jan 12, 2025', time: '3:20 PM' },
  { id: 'TXN005', learner: 'Mohammed Ahmed', amount: 2000, currency: 'KES', method: 'M-Pesa', status: 'Failed', date: 'Jan 11, 2025', time: '11:00 AM' },
  { id: 'TXN006', learner: 'Lisa Neumann', amount: 120, currency: 'EUR', method: 'Stripe', status: 'Success', date: 'Jan 10, 2025', time: '4:30 PM' },
  { id: 'TXN007', learner: 'David Kipkemboi', amount: 3500, currency: 'KES', method: 'M-Pesa', status: 'Success', date: 'Jan 9, 2025', time: '9:15 AM' },
  { id: 'TXN008', learner: 'Pierre Rousseau', amount: 180, currency: 'CHF', method: 'Stripe', status: 'Success', date: 'Jan 8, 2025', time: '1:45 PM' },
]

export default function AdminPayments() {
  const [currency, setCurrency] = useState('KES')
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const totalRevenue = 14450 // KES sum
  const pendingPayments = 100
  const failedPayments = 2000

  const PaymentStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-mid text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-navy mb-2" style={{ fontFamily: 'Poppins' }}>
              {currency} {(currency === 'KES' ? totalRevenue : totalRevenue / 40).toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center">
            <DollarSign size={24} className="text-gold" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-mid text-sm mb-1">Pending Payments</p>
            <p className="text-3xl font-bold text-navy mb-2" style={{ fontFamily: 'Poppins' }}>
              {currency} {(currency === 'KES' ? pendingPayments : pendingPayments / 40).toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <DollarSign size={24} className="text-amber-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-mid text-sm mb-1">Failed Payments</p>
            <p className="text-3xl font-bold text-navy mb-2" style={{ fontFamily: 'Poppins' }}>
              {currency} {(currency === 'KES' ? failedPayments : failedPayments / 40).toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <DollarSign size={24} className="text-red-600" />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AdminTopBar title="Payment Management" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Currency Toggle */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
              Payment Transactions
            </h2>
            <div className="flex gap-2">
              {['KES', 'EUR', 'CHF', 'USD'].map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    currency === curr
                      ? 'bg-gold text-navy'
                      : 'bg-gray-light text-gray-dark hover:bg-gray-200'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <PaymentStats />

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h3 className="font-semibold text-navy mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-semibold text-navy mb-2 block">Date From</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-3.5 text-gray-mid" />
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full border border-gray-100 rounded-lg pl-10 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-navy mb-2 block">Date To</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-3.5 text-gray-mid" />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full border border-gray-100 rounded-lg pl-10 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-navy mb-2 block">Method</label>
                <select className="w-full border border-gray-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold">
                  <option>All Methods</option>
                  <option>M-Pesa</option>
                  <option>Stripe</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-navy mb-2 block">Status</label>
                <select className="w-full border border-gray-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold">
                  <option>All Status</option>
                  <option>Success</option>
                  <option>Pending</option>
                  <option>Failed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-light border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-dark">Transaction ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-dark">Learner</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-dark">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-dark">Method</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-dark">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-dark">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-dark">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, idx) => (
                    <tr key={payment.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-light'}>
                      <td className="px-6 py-4 text-sm font-semibold text-navy">{payment.id}</td>
                      <td className="px-6 py-4 text-sm text-navy">{payment.learner}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-navy">
                        {payment.currency} {payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          payment.method === 'M-Pesa' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          payment.status === 'Success' ? 'bg-green-100 text-green-700' :
                          payment.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-dark">
                        {payment.date}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="text-gold hover:text-gold-light font-semibold text-sm flex items-center gap-1 transition-colors"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 bg-gold hover:bg-gold-light text-navy font-semibold px-6 py-3 rounded-full transition-colors">
              <Download size={20} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                Payment Details
              </h2>
              <button onClick={() => setSelectedPayment(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-light rounded-lg">
                <p className="text-xs text-gray-mid font-semibold mb-1">TRANSACTION ID</p>
                <p className="text-lg font-bold text-navy">{selectedPayment.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-light rounded-lg">
                  <p className="text-xs text-gray-mid font-semibold mb-1">LEARNER</p>
                  <p className="text-sm font-bold text-navy">{selectedPayment.learner}</p>
                </div>
                <div className="p-4 bg-gray-light rounded-lg">
                  <p className="text-xs text-gray-mid font-semibold mb-1">AMOUNT</p>
                  <p className="text-sm font-bold text-navy">{selectedPayment.currency} {selectedPayment.amount.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-light rounded-lg">
                  <p className="text-xs text-gray-mid font-semibold mb-1">METHOD</p>
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                    selectedPayment.method === 'M-Pesa' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedPayment.method}
                  </span>
                </div>
                <div className="p-4 bg-gray-light rounded-lg">
                  <p className="text-xs text-gray-mid font-semibold mb-1">STATUS</p>
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                    selectedPayment.status === 'Success' ? 'bg-green-100 text-green-700' :
                    selectedPayment.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {selectedPayment.status}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-light rounded-lg">
                <p className="text-xs text-gray-mid font-semibold mb-1">DATE & TIME</p>
                <p className="text-sm font-bold text-navy">{selectedPayment.date} at {selectedPayment.time}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setSelectedPayment(null)} className="flex-1 border border-gray-100 rounded-full py-3 font-semibold text-navy hover:bg-gray-50 transition-colors">
                Close
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-navy rounded-full py-3 font-semibold transition-colors">
                <Download size={18} />
                Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
