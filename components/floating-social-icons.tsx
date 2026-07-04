'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

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

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/tonguestrend',
      color: 'from-pink-500 via-red-500 to-yellow-500', // Multi-stop gradient matching IG branding
      svg: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@tonguestrend',
      color: 'from-gray-900 to-black border border-gray-800',
      svg: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.61 4.17 1.14 1.25 2.75 1.95 4.43 2.09v3.9c-1.67-.06-3.32-.61-4.68-1.59-.19-.14-.38-.3-.57-.46-.01 1.05-.01 2.1-.01 3.15 0 2.37-.58 4.75-1.95 6.67-1.74 2.47-4.6 3.98-7.62 3.98-2.63 0-5.21-1.12-7-3.05C-.6 16.63-1.07 13.56.59 10.8c1.23-2.11 3.51-3.56 5.95-3.75v4.03c-1.32.13-2.58.9-3.28 2.03-.96 1.45-.72 3.49.56 4.67 1.08.97 2.66 1.25 4.02.7 1.34-.51 2.25-1.79 2.37-3.22.06-2.92.03-5.83.04-8.75-.01-2.2.02-4.4-.01-6.59z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/tonguestrend',
      color: 'from-blue-600 to-blue-700',
      svg: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'X (Twitter)',
      url: 'https://www.twitter.com/tonguestrend',
      color: 'from-neutral-800 to-neutral-950',
      svg: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/tonguestrend',
      color: 'from-blue-700 to-sky-800',
      svg: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div
      className={`fixed right-6 bottom-8 z-40 flex flex-col items-center gap-3 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 pointer-events-none'
      }`}
    >
      {/* Floating Icons */}
      <div
        className={`flex flex-col gap-2 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {socialLinks.map((social) => {
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-end gap-3 transition-all duration-300 hover:scale-110"
              aria-label={social.name}
            >
              {/* Label */}
              <span className="text-xs font-semibold text-gray-700 bg-white/80 px-3 py-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {social.name}
              </span>

              {/* Icon Container */}
              <div className={`p-3 rounded-full bg-gradient-to-br ${social.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center`}>
                {social.svg}
              </div>
            </a>
          )
        })}
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group p-4 rounded-full bg-gradient-to-br from-secondary to-[#FDC76F] text-navy shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center relative overflow-hidden"
        aria-label="Toggle social media"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className={`absolute transition-all duration-300 ${isOpen ? 'rotate-45 opacity-0 scale-75' : 'rotate-0 opacity-100 scale-100'}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </span>
        <span className={`absolute transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100 scale-100' : 'rotate-45 opacity-0 scale-75'}`}>
          <X size={24} />
        </span>
      </button>

      {/* Decorative pulse ring */}
      <div className={`absolute inset-0 rounded-full bg-secondary/20 animate-pulse pointer-events-none ${isOpen ? 'scale-100' : 'scale-0'}`} />
    </div>
  )
}