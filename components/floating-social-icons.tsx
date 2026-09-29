'use client'

import { useState, useEffect } from 'react'
import { MoreHorizontal, X } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaXTwitter } from 'react-icons/fa6'
import type { IconType } from 'react-icons'
import { Stagger, StaggerItem } from '@/components/motion'

export default function FloatingSocialIcons() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  // Hide floating icons when scrolled to footer
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer')
      if (footer) {
        const footerRect = footer.getBoundingClientRect()
        setIsVisible(footerRect.top > window.innerHeight + 100)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const socialLinks: { name: string; url: string; icon: IconType }[] = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/tonguestrend?igsh=MXduYnowOWVmb3Fvaw==',
      icon: FaInstagram,
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@tonguestrend?_r=1&_t=ZN-97q3LvhJ6YB',
      icon: FaTiktok,
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/share/1YL4CrXfLv/?mibextid=wwXIfr',
      icon: FaFacebookF,
    },
    {
      name: 'X',
      url: 'https://www.twitter.com/tonguestrend',
      icon: FaXTwitter,
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/tongue-strend-013789420?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
      icon: FaLinkedinIn,
    },
  ]

  return (
    <div
      className={`fixed bottom-6 right-4 z-40 flex flex-col items-center gap-3 transition-all duration-300 sm:right-6 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 pointer-events-none'
      }`}
    >
      {/* Floating Icons */}
      <Stagger
        stagger={0.05}
        amount={0}
        className={`flex flex-col gap-2.5 transition-all duration-300 md:pointer-events-auto md:translate-y-0 md:opacity-100 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {socialLinks.map((social) => {
          const Icon = social.icon
          return (
            <StaggerItem key={social.name} as="div" direction="right" duration={0.4}>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-end gap-3 transition-transform duration-200 hover:-translate-x-1"
                aria-label={social.name}
              >
                <span className="whitespace-nowrap rounded-lg border border-gold/20 bg-white px-3 py-2 text-xs font-semibold text-navy opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
                  {social.name}
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-navy text-white shadow-lg transition-colors duration-200 group-hover:bg-gold group-hover:text-navy">
                  <Icon size={19} aria-hidden="true" />
                </div>
              </a>
            </StaggerItem>
          )
        })}
      </Stagger>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-gold text-navy shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gold-light hover:shadow-xl md:hidden"
        aria-label="Toggle social media"
        aria-expanded={isOpen}
      >
        <span className={`absolute transition-all duration-300 ${isOpen ? 'rotate-45 opacity-0 scale-75' : 'rotate-0 opacity-100 scale-100'}`}>
          <MoreHorizontal size={24} />
        </span>
        <span className={`absolute transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100 scale-100' : 'rotate-45 opacity-0 scale-75'}`}>
          <X size={24} />
        </span>
      </button>

    </div>
  )
}