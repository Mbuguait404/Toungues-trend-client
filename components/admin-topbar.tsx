'use client'

import PortalTopbar, { type PortalTopbarProps } from '@/components/portal/portal-topbar'

export default function AdminTopBar({ title }: PortalTopbarProps) {
  return <PortalTopbar title={title} />
}