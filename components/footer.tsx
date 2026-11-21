'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { IconType } from 'react-icons'
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaXTwitter,
} from 'react-icons/fa6'
import { ArrowRight, Check, Loader2, AlertCircle, Mail, Phone } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'
import { subscribe } from '@/lib/api/subscribers'
import { ApiException } from '@/lib/api'
import {
  COMPANY_LINKS,
  CONTACT_CHANNELS,
  LANGUAGE_LINKS,
  SITE,
  SOCIAL_LINKS,
} from '@/lib/site'

const SOCIAL_ICONS: Record<string, IconType> = {
  Instagram: FaInstagram,
  TikTok: FaTiktok,
  Facebook: FaFacebookF,
  X: FaXTwitter,
  LinkedIn: FaLinkedinIn,
}

function NewsletterForm() {
  const [email, setEmail] = useState('')
  // Honeypot: positioned off-screen and hidden from assistive tech, so only
  // naive bots fill it. A truthy value here means the submission is dropped.
  const [website, setWebsite] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (state === 'loading') return

    setState('loading')
    setMessage('')
    try {
      await subscribe(email, website)
      setState('done')
      setMessage('Thanks — you are on the list.')
      setEmail('')
    } catch (err) {
      setState('error')
      setMessage(
        err instanceof ApiException ? err.message : 'Something went wrong. Please try again.',
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          disabled={state === 'loading'}
          className="flex-1 min-w-0 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 transition-all disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={state === 'loading' || state === 'done'}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gold text-navy text-sm font-semibold hover:bg-gold-light transition-all duration-150 disabled:opacity-70 disabled:cursor-default shrink-0"
        >
          {state === 'loading' ? (
            <Loader2 size={16} className="animate-spin" />
          ) : state === 'done' ? (
            <Check size={16} />
          ) : (
            <ArrowRight size={16} />
          )}
          {state === 'loading' ? 'Joining…' : state === 'done' ? 'Subscribed' : 'Subscribe'}
        </button>
      </div>

      {/* Honeypot */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="newsletter-website">Website</label>
        <input
          id="newsletter-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div aria-live="polite" className="min-h-[1.25rem] mt-2">
        {message && (
          <p
            className={`flex items-center gap-1.5 text-xs ${
              state === 'error' ? 'text-red-300' : 'text-gold-light'
            }`}
          >
            {state === 'error' && <AlertCircle size={13} />}
            {message}
          </p>
        )}
      </div>

      <p className="text-xs text-white/45 mt-1">
        Language tips and course updates. Unsubscribe any time.
      </p>
    </form>
  )
}

function LinkColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <StaggerItem>
      <h3 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-4">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/60 hover:text-gold transition-colors duration-150"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </StaggerItem>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-navy text-white">
      {/* CTA / newsletter band */}
      <Reveal amount={0.05}>
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              <div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-gold leading-tight"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Daily language tips, straight to your inbox
                </h2>
                <p className="text-sm text-white/60 leading-relaxed mt-3 max-w-md">
                  Join learners studying French, English, German and Kiswahili with
                  Tongues Trend. One useful email a week, no spam.
                </p>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                  {[
                    'CEFR-aligned paths',
                    'Certified teachers',
                    'Flexible scheduling',
                  ].map((point) => (
                    <span key={point} className="flex items-center gap-1.5 text-xs text-white/70">
                      <Check size={13} className="text-gold shrink-0" />
                      {point}
                    </span>
                  ))}
                </div>
              </div>

              <NewsletterForm />
            </div>
          </div>
        </div>
      </Reveal>

      {/* Link columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <Stagger
          className="grid grid-cols-2 md:grid-cols-4 gap-10"
          stagger={0.08}
          amount={0.05}
        >
          {/* Brand */}
          <StaggerItem className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt={`${SITE.name} Logo`}
                width={160}
                height={44}
                style={{ width: 'auto', height: '44px' }}
                className="object-contain"
              />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">{SITE.tagline}</p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = SOCIAL_ICONS[social.name]
                return (
                  <li key={social.name}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/10 hover:bg-gold hover:text-navy hover:border-gold transition-colors duration-200"
                    >
                      {Icon && <Icon size={17} aria-hidden="true" />}
                    </a>
                  </li>
                )
              })}
            </ul>
          </StaggerItem>

          <LinkColumn title="Languages" links={LANGUAGE_LINKS} />
          <LinkColumn title="Company" links={COMPANY_LINKS} />

          {/* Contact */}
          <StaggerItem>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              {CONTACT_CHANNELS.map((channel) => (
                <li key={channel.href}>
                  <a
                    href={channel.href}
                    className="group flex items-start gap-2.5 text-sm text-white/60 hover:text-gold transition-colors duration-150"
                  >
                    {channel.label === 'Email' ? (
                      <Mail size={15} className="mt-0.5 shrink-0 opacity-70" />
                    ) : (
                      <Phone size={15} className="mt-0.5 shrink-0 opacity-70" />
                    )}
                    <span className="min-w-0">
                      <span className="block text-xs text-white/40">{channel.label}</span>
                      <span className="block break-words">{channel.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </StaggerItem>
        </Stagger>
      </div>

      {/* Legal bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/45 text-center sm:text-left">
              © {currentYear} {SITE.name}. All rights reserved.
            </p>

            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <li className="text-xs text-white/45">{SITE.domain}</li>
              {/* Legal links stay commented until /privacy and /terms pages exist —
                  rendering them now would just produce 404s. See LEGAL_LINKS in lib/site.ts. */}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}