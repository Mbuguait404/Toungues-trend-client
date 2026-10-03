'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { RefreshCw } from 'lucide-react'

/**
 * Shared primitives for every portal dashboard. Keeping these in one place is
 * what makes /admin, /learn and /teach read as the same product rather than
 * three hand-rolled variants that drift apart.
 */

export function PageHeader({
  title,
  subtitle,
  onRefresh,
  refreshing,
}: {
  title: string
  subtitle?: React.ReactNode
  onRefresh?: () => void
  refreshing?: boolean
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
          {title}
        </h1>
        {subtitle && <p className="text-xs text-gray-mid mt-0.5">{subtitle}</p>}
      </div>
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-100 text-sm font-semibold text-gray-dark hover:border-gold hover:shadow-sm transition-all disabled:opacity-50 shrink-0"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      )}
    </header>
  )
}

export function StatTile({
  label,
  value,
  sub,
  accent = 'text-navy',
  icon: Icon,
  href,
}: {
  label: string
  value: string | number
  sub?: React.ReactNode
  accent?: string
  icon: LucideIcon
  href?: string
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-mid">{label}</p>
        <Icon size={15} className={`${accent} shrink-0`} />
      </div>
      <p className={`text-[26px] leading-none font-bold ${accent}`} style={{ fontFamily: 'Poppins' }}>
        {value}
      </p>
      {sub && <div className="mt-2 text-[11px] text-gray-mid">{sub}</div>}
    </>
  )

  const className = 'block bg-white rounded-xl border border-gray-100 p-4'

  return href ? (
    <Link href={href} className={`${className} hover:border-gold hover:shadow-sm transition-all`}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  )
}

export function Card({
  title,
  action,
  children,
  className = '',
  bodyClassName = '',
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <section className={`bg-white rounded-xl border border-gray-100 ${className}`}>
      <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-navy truncate" style={{ fontFamily: 'Poppins' }}>
          {title}
        </h2>
        {action}
      </header>
      <div className={bodyClassName}>{children}</div>
    </section>
  )
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center text-sm text-gray-mid">
        {children}
      </td>
    </tr>
  )
}

export function EmptyBlock({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-10 text-center text-sm text-gray-mid">{children}</div>
}

const TONES = {
  navy: 'bg-navy/10 text-navy',
  gold: 'bg-gold/20 text-[#8a5f10]',
  green: 'bg-green-100 text-green-700',
  blue: 'bg-blue-100 text-blue-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
  gray: 'bg-gray-200 text-gray-600',
} as const

export type Tone = keyof typeof TONES

export function Pill({
  children,
  tone = 'gray',
}: {
  children: React.ReactNode
  tone?: Tone
}) {
  return (
    <span
      className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md whitespace-nowrap ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}

export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, value || 0))
  return (
    <div className={`w-full h-1.5 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div className="h-full bg-gold transition-all duration-300" style={{ width: `${pct}%` }} />
    </div>
  )
}

/** Dense label/value list used in the detail panels. */
export function MetaList({ rows }: { rows: { label: string; value: React.ReactNode }[] }) {
  return (
    <dl className="divide-y divide-gray-100">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-2.5">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-mid shrink-0">
            {row.label}
          </dt>
          <dd className="text-sm text-navy text-right truncate">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}