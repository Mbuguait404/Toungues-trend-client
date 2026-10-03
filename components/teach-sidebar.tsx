'use client'

import { LayoutDashboard, Users, FileText, Calendar, BookOpen } from 'lucide-react'
import PortalSidebar, { type PortalNavGroup } from '@/components/portal/portal-sidebar'

export default function TeachSidebar() {
  const groups: PortalNavGroup[] = [
    {
      heading: 'Overview',
      items: [{ href: '/teach/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
    },
    {
      heading: 'Teaching',
      items: [
        { href: '/teach/learners', label: 'My Learners', icon: Users },
        { href: '/teach/modules', label: 'Modules', icon: BookOpen },
        { href: '/teach/materials', label: 'Materials', icon: FileText },
        { href: '/teach/schedule', label: 'Schedule', icon: Calendar },
      ],
    },
  ]

  return (
    <PortalSidebar
      id="teach-sidebar"
      homeHref="/teach/dashboard"
      mobileTitle="Teacher Portal"
      chipLabel="Teacher"
      navLabel="Teacher sections"
      footerNote="Teacher area — manage your learners and classes"
      groups={groups}
    />
  )
}