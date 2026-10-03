'use client'

import { LayoutDashboard, BookOpen, Calendar, Award, User, CreditCard } from 'lucide-react'
import PortalSidebar, { type PortalNavGroup } from '@/components/portal/portal-sidebar'

export default function LearnSidebar() {
  const groups: PortalNavGroup[] = [
    {
      heading: 'Overview',
      items: [{ href: '/learn/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
    },
    {
      heading: 'Learning',
      items: [
        { href: '/learn/courses', label: 'My Courses', icon: BookOpen },
        { href: '/learn/payments', label: 'Payments', icon: CreditCard },
        { href: '/learn/schedule', label: 'Schedule', icon: Calendar },
        { href: '/learn/certificates', label: 'Certificates', icon: Award },
      ],
    },
    {
      heading: 'Account',
      items: [{ href: '/learn/profile', label: 'Profile', icon: User }],
    },
  ]

  return (
    <PortalSidebar
      id="learn-sidebar"
      homeHref="/learn/dashboard"
      mobileTitle="Learner Portal"
      chipLabel="Learner"
      navLabel="Learner sections"
      footerNote="Learner area — your progress and records"
      groups={groups}
    />
  )
}