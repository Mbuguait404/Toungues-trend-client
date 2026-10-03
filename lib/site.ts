/**
 * Single source of truth for site-wide links, shared by the navbar and footer so
 * they cannot drift apart.
 */

export interface NavLink {
  href: string
  label: string
}

/** Primary navigation — used by the navbar top bar and the mobile drawer. */
export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/tutors', label: 'Tutors' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export const LANGUAGE_LINKS: NavLink[] = [
  { href: '/courses?language=french', label: 'French' },
  { href: '/courses?language=english', label: 'English' },
  { href: '/courses?language=german', label: 'German' },
  { href: '/courses?language=kiswahili', label: 'Kiswahili' },
]

/** "Company" column — support + legal routes, deliberately not in the top nav. */
export const COMPANY_LINKS: NavLink[] = [
  { href: '/about', label: 'About Us' },
  { href: '/tutors', label: 'Our Tutors' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
  { href: '/register', label: 'Become a Tutor' },
  { href: '/login', label: 'Log in' },
]

export const LEGAL_LINKS: NavLink[] = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
]

export interface ContactChannel {
  label: string
  value: string
  href: string
}

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    label: 'Email',
    value: 'info@tonguestrend.com',
    href: 'mailto:info@tonguestrend.com',
  },
  {
    label: 'Switzerland',
    value: '+41 779 766 835',
    href: 'tel:+41779766835',
  },
  {
    label: 'Kenya',
    value: '+254 729 482 786',
    href: 'tel:+254729482786',
  },
]

export interface SocialLink {
  name: string
  href: string
}

/**
 * Canonical profile URLs — tracking params stripped.
 *
 * TODO(you): FACEBOOK_URL still points at a `facebook.com/share/…` dialog URL,
 * which opens a share prompt rather than your page. Replace it with the real
 * page URL, e.g. the `facebook.com/<your-page>` slug. I left the existing value
 * in place rather than guessing a slug that may not exist.
 */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/tonguestrend',
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@tonguestrend',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/share/1YL4CrXfLv/',
  },
  {
    name: 'X',
    href: 'https://x.com/tonguestrend',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/tongue-strend-013789420',
  },
]

export const SITE = {
  name: 'Tongues Trend',
  domain: 'www.tonguestrend.com',
  tagline: 'Premium 1-on-1 language tutoring connecting you with certified teachers worldwide.',
} as const