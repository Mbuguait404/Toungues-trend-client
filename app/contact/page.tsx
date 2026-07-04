'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('[v0] Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'info@tonguestrend.com',
      href: 'mailto:info@tonguestrend.com',
    },
    {
      icon: Phone,
      label: 'Switzerland',
      value: '+41 779 766835',
      href: 'tel:+41779766835',
    },
    {
      icon: Phone,
      label: 'Kenya',
      value: '+254 729 482 786',
      href: 'tel:+254729482786',
    },
    {
      icon: Clock,
      label: 'Response Time',
      value: 'Within 24 hours',
      href: '#',
    },
  ]

  const faqItems = [
    {
      question: 'How long does it take to get a response?',
      answer:
        'We typically respond to all inquiries within 24 hours during business days. For urgent matters, call us directly or use the chat feature.',
    },
    {
      question: 'Can I schedule a free consultation through this form?',
      answer:
        'Yes! Mention in the Subject line "Free Consultation" and include your preferred time. Our team will contact you to confirm.',
    },
    {
      question: 'What information should I include in my message?',
      answer:
        'Tell us which languages interest you, your current level, your learning goals, and your preferred lesson schedule. This helps us match you with the perfect teacher.',
    },
    {
      question: 'Do you offer group lessons or corporate training?',
      answer:
        'Currently, we specialize in 1-on-1 lessons. For inquiries about group or corporate programs, please include that in your message and we will follow up.',
    },
    {
      question: 'How can I follow Tongues Trend on social media?',
      answer: 'Follow us on Instagram, TikTok, and Facebook @TonguesTrend for daily language tips, teacher spotlights, and student success stories.',
    },
  ]

  const [expandedFaq, setExpandedFaq] = useState(null)

  return (
    <main className="w-full bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full bg-navy text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance" style={{ fontFamily: 'Poppins' }}>
            Get in Touch
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Have a question? Ready to start your language journey? We'd love to hear from you. Contact us and our team will get back to you promptly.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-navy mb-8" style={{ fontFamily: 'Poppins' }}>
                Send us a Message
              </h2>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                  <h3 className="text-lg font-bold text-green-800 mb-2" style={{ fontFamily: 'Poppins' }}>
                    Message Sent Successfully!
                  </h3>
                  <p className="text-green-700">
                    Thank you for reaching out. Our team will respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2" style={{ fontFamily: 'Poppins' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold focus:ring-opacity-20 transition-all"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2" style={{ fontFamily: 'Poppins' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold focus:ring-opacity-20 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2" style={{ fontFamily: 'Poppins' }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold focus:ring-opacity-20 transition-all"
                      placeholder="Free Consultation / Course Inquiry / etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2" style={{ fontFamily: 'Poppins' }}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold focus:ring-opacity-20 transition-all resize-none"
                      placeholder="Tell us about your language learning goals..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-full bg-gold text-navy font-semibold hover:bg-gold-light transition-all duration-150"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-navy mb-8" style={{ fontFamily: 'Poppins' }}>
                Contact Information
              </h2>

              <div className="space-y-6 mb-12">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gold bg-opacity-10">
                          <Icon className="text-gold" size={20} />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-mid" style={{ fontFamily: 'Poppins' }}>
                          {info.label}
                        </p>
                        {info.href !== '#' ? (
                          <a
                            href={info.href}
                            className="text-lg font-medium text-navy hover:text-gold transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-lg font-medium text-navy">{info.value}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Office Hours */}
              <div className="bg-gray-light rounded-2xl p-8 border border-gray-100">
                <h3 className="font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
                  Office Hours
                </h3>
                <ul className="space-y-3 text-sm text-gray-dark">
                  <li>
                    <span className="font-semibold">Monday - Friday:</span> 9:00 AM - 6:00 PM CET
                  </li>
                  <li>
                    <span className="font-semibold">Saturday:</span> 10:00 AM - 2:00 PM CET
                  </li>
                  <li>
                    <span className="font-semibold">Sunday:</span> Closed
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-gray-light py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center mb-4" style={{ fontFamily: 'Poppins' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-mid mb-12 max-w-2xl mx-auto">
            Can't find what you're looking for? Contact us directly and we'll be happy to help.
          </p>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-light transition-colors"
                >
                  <h3 className="font-semibold text-navy text-left" style={{ fontFamily: 'Poppins' }}>
                    {item.question}
                  </h3>
                  <span
                    className={`text-gold font-bold text-xl transition-transform duration-150 flex-shrink-0 ml-4 ${
                      expandedFaq === index ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>

                {expandedFaq === index && (
                  <div className="px-6 pb-4 border-t border-gray-100 text-gray-dark text-sm leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full bg-navy text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gold" style={{ fontFamily: 'Poppins' }}>
            Ready to Start Your Language Journey?
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Book a free 30-minute consultation to find your perfect match and get started.
          </p>
          <Link href="/courses">
            <button
              className="px-8 py-3 rounded-full bg-gold text-navy font-semibold hover:bg-gold-light transition-all duration-150"
              style={{ fontFamily: 'Poppins' }}
            >
              Book Free Consultation
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
