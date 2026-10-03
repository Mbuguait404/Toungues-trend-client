'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminTopBar from '@/components/admin-topbar'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'
import {
  Inbox,
  Loader2,
  AlertCircle,
  Search,
  X,
  Trash2,
  Mail,
  MailOpen,
  CheckCircle2,
  Ban,
} from 'lucide-react'
import {
  getAllInquiries,
  updateInquiry,
  deleteInquiry,
  type Inquiry,
  type InquiryStatus,
} from '@/lib/api/inquiries'

const STATUS_COLORS: Record<InquiryStatus, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  RESOLVED: 'bg-green-100 text-green-700',
  SPAM: 'bg-gray-200 text-gray-600',
}

const STATUS_FILTERS: Array<{ value: 'ALL' | InquiryStatus; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'NEW', label: 'New' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'SPAM', label: 'Spam' },
]

const NEXT_STATUS: Record<InquiryStatus, { value: InquiryStatus; label: string; icon: typeof CheckCircle2 }> = {
  NEW: { value: 'IN_PROGRESS', label: 'Start progress', icon: MailOpen },
  IN_PROGRESS: { value: 'RESOLVED', label: 'Mark resolved', icon: CheckCircle2 },
  RESOLVED: { value: 'NEW', label: 'Reopen', icon: Mail },
  SPAM: { value: 'NEW', label: 'Restore', icon: Mail },
}

function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message
  return fallback
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'ALL' | InquiryStatus>('ALL')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setError(null)
      const data = await getAllInquiries({ limit: '200' })
      setInquiries(data)
    } catch (err) {
      setError(errorMessage(err, 'Failed to load inquiries'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const counts = useMemo(
    () => ({
      NEW: inquiries.filter((i) => i.status === 'NEW').length,
      IN_PROGRESS: inquiries.filter((i) => i.status === 'IN_PROGRESS').length,
      RESOLVED: inquiries.filter((i) => i.status === 'RESOLVED').length,
      SPAM: inquiries.filter((i) => i.status === 'SPAM').length,
    }),
    [inquiries],
  )

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return inquiries.filter((i) => {
      if (statusFilter !== 'ALL' && i.status !== statusFilter) return false
      if (!term) return true
      return (
        i.name.toLowerCase().includes(term) ||
        i.email.toLowerCase().includes(term) ||
        i.subject.toLowerCase().includes(term) ||
        i.message.toLowerCase().includes(term)
      )
    })
  }, [inquiries, statusFilter, search])

  const openDetail = (inquiry: Inquiry) => {
    setSelected(inquiry)
    setNotes(inquiry.adminNotes ?? '')
  }

  const applyStatus = async (inquiry: Inquiry, status: InquiryStatus) => {
    setBusyId(inquiry._id)
    try {
      const updated = await updateInquiry(inquiry._id, { status })
      setInquiries((prev) => prev.map((i) => (i._id === updated._id ? updated : i)))
      setSelected((prev) => (prev && prev._id === updated._id ? updated : prev))
    } catch (err) {
      setError(errorMessage(err, 'Failed to update inquiry'))
    } finally {
      setBusyId(null)
    }
  }

  const saveNotes = async () => {
    if (!selected) return
    setSaving(true)
    try {
      const updated = await updateInquiry(selected._id, { adminNotes: notes })
      setInquiries((prev) => prev.map((i) => (i._id === updated._id ? updated : i)))
      setSelected(updated)
    } catch (err) {
      setError(errorMessage(err, 'Failed to save notes'))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (inquiry: Inquiry) => {
    if (!window.confirm(`Delete the inquiry from ${inquiry.name}? This cannot be undone.`)) return
    setBusyId(inquiry._id)
    try {
      await deleteInquiry(inquiry._id)
      setInquiries((prev) => prev.filter((i) => i._id !== inquiry._id))
      if (selected?._id === inquiry._id) setSelected(null)
    } catch (err) {
      setError(errorMessage(err, 'Failed to delete inquiry'))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Reveal as="div" duration={0.5} distance={16} amount={0.1}>
        <AdminTopBar title="Inquiries" />
      </Reveal>
      <div className="flex-1 overflow-auto p-8 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={32} className="animate-spin mr-3" />
            Loading inquiries…
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <Stagger className="grid grid-cols-1 md:grid-cols-4 gap-6" amount={0.1} stagger={0.07}>
              {[
                { label: 'Total', value: inquiries.length, icon: Inbox, bg: 'bg-gold/10', color: 'text-gold' },
                { label: 'New', value: counts.NEW, icon: Mail, bg: 'bg-blue-100', color: 'text-blue-600' },
                { label: 'In Progress', value: counts.IN_PROGRESS, icon: MailOpen, bg: 'bg-amber-100', color: 'text-amber-600' },
                { label: 'Resolved', value: counts.RESOLVED, icon: CheckCircle2, bg: 'bg-green-100', color: 'text-green-600' },
              ].map((card) => (
                <StaggerItem key={card.label} className="h-full" duration={0.5}>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-mid text-sm mb-1">{card.label}</p>
                        <p className="text-3xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                          {card.value.toLocaleString()}
                        </p>
                      </div>
                      <div className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center`}>
                        <card.icon size={24} className={card.color} />
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            {/* Search + Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="relative w-full lg:max-w-sm">
                <Search
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, subject…"
                  aria-label="Search inquiries"
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold focus:ring-opacity-20 transition-all"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((s) => {
                  const count = s.value === 'ALL' ? inquiries.length : counts[s.value]
                  return (
                    <button
                      key={s.value}
                      onClick={() => setStatusFilter(s.value)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        statusFilter === s.value
                          ? 'bg-gold text-navy'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {s.label} ({count})
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Table */}
            <Reveal duration={0.5} distance={16} amount={0.05}>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 text-sm text-gray-500">
                {filtered.length} inquir{filtered.length !== 1 ? 'ies' : 'y'}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-light border-b border-gray-100">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">From</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Subject</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Received</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-dark">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                          {inquiries.length === 0
                            ? 'No inquiries yet. Submissions from the contact page will appear here.'
                            : 'No inquiries match your filters.'}
                        </td>
                      </tr>
                    ) : (
                      filtered.map((inquiry, idx) => {
                        const next = NEXT_STATUS[inquiry.status]
                        const NextIcon = next.icon
                        const isBusy = busyId === inquiry._id
                        return (
                          <tr key={inquiry._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-light'}>
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold text-navy">{inquiry.name}</p>
                              <a
                                href={`mailto:${inquiry.email}`}
                                className="text-xs text-gray-mid hover:text-gold transition-colors"
                              >
                                {inquiry.email}
                              </a>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-navy max-w-xs truncate">{inquiry.subject}</p>
                              <p className="text-xs text-gray-mid max-w-xs truncate">{inquiry.message}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                                  STATUS_COLORS[inquiry.status]
                                }`}
                              >
                                {inquiry.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-dark whitespace-nowrap">
                              {new Date(inquiry.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-3">
                                <button
                                  onClick={() => openDetail(inquiry)}
                                  className="text-gold font-semibold text-sm hover:text-gold-light transition-colors"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => applyStatus(inquiry, next.value)}
                                  disabled={isBusy}
                                  title={next.label}
                                  aria-label={next.label}
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-navy transition-colors disabled:opacity-40"
                                >
                                  {isBusy ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <NextIcon size={14} />
                                  )}
                                  {next.label}
                                </button>
                                <button
                                  onClick={() => remove(inquiry)}
                                  disabled={isBusy}
                                  title="Delete"
                                  aria-label="Delete inquiry"
                                  className="inline-flex items-center text-red-500 hover:text-red-700 transition-colors disabled:opacity-40"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            </Reveal>
          </>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6 gap-4">
              <div>
                <h3 className="text-xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                  {selected.subject}
                </h3>
                <p className="text-sm text-gray-mid mt-1">
                  {selected.name} ·{' '}
                  <a href={`mailto:${selected.email}`} className="text-gold hover:underline">
                    {selected.email}
                  </a>
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="p-1 hover:bg-gray-100 rounded-lg shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  STATUS_COLORS[selected.status]
                }`}
              >
                {selected.status.replace('_', ' ')}
              </span>
              <span className="text-xs text-gray-mid">
                Received {new Date(selected.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="bg-gray-light rounded-xl p-4 mb-6 text-sm text-gray-dark leading-relaxed whitespace-pre-wrap">
              {selected.message}
            </div>

            <div className="mb-6">
              <label
                htmlFor="adminNotes"
                className="block text-sm font-semibold text-navy mb-2"
                style={{ fontFamily: 'Poppins' }}
              >
                Internal notes
              </label>
              <textarea
                id="adminNotes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Only visible to admins…"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold focus:ring-opacity-20 transition-all resize-none"
              />
              <button
                onClick={saveNotes}
                disabled={saving}
                className="mt-3 px-4 py-2 rounded-full bg-navy text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                Save notes
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
              {(
                [
                  { value: 'NEW' as InquiryStatus, label: 'New', icon: Mail },
                  { value: 'IN_PROGRESS' as InquiryStatus, label: 'In Progress', icon: MailOpen },
                  { value: 'RESOLVED' as InquiryStatus, label: 'Resolved', icon: CheckCircle2 },
                  { value: 'SPAM' as InquiryStatus, label: 'Spam', icon: Ban },
                ] satisfies Array<{ value: InquiryStatus; label: string; icon: typeof Mail }>
              ).map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => applyStatus(selected, value)}
                  disabled={busyId === selected._id || selected.status === value}
                  className={`px-3 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-default ${
                    selected.status === value
                      ? 'bg-gold text-navy'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
