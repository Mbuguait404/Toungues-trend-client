'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Inbox, Users, BookOpen, CreditCard, Settings } from 'lucide-react'
import PortalSidebar, { type PortalNavGroup } from '@/components/portal/portal-sidebar'
import { getInquiryStats } from '@/lib/api/inquiries'

export default function AdminSidebar() {
  const pathname = usePathname()
  const [openInquiries, setOpenInquiries] = useState(0)

  // Re-read on navigation so the badge reflects anything just handled.
  useEffect(() => {
    let active = true
    getInquiryStats()
      .then((stats) => {
        if (active) setOpenInquiries(stats.NEW + stats.IN_PROGRESS)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [pathname])

  const groups: PortalNavGroup[] = [
    {
      heading: 'Overview',
      items: [{ href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
    },
    {
      heading: 'Manage',
      items: [
        { href: '/admin/inquiries', label: 'Inquiries', icon: Inbox, badge: openInquiries },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/courses', label: 'Courses', icon: BookOpen },
        { href: '/admin/payments', label: 'Payments', icon: CreditCard },
      ],
    },
    {
      heading: 'System',
      items: [{ href: '/admin/settings', label: 'Settings', icon: Settings }],
    },
  ]

  return (
    <PortalSidebar
      id="admin-sidebar"
      homeHref="/admin/dashboard"
      mobileTitle="Admin Portal"
      chipLabel="Admin"
      navLabel="Admin sections"
      footerNote="Admin area — authorised personnel only"
      groups={groups}
    />
  )
}