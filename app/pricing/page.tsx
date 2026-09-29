'use client'

import { useState } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Check, ChevronDown } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'

type Currency = 'EUR' | 'CHF' | 'USD' | 'KES'

const PRICING_DATA: Record<Currency, { singleRate: number; bundleRate: number; monthlyRate: number }> = {
  EUR: { singleRate: 30, bundleRate: 270, monthlyRate: 400 },
  CHF: { singleRate: 30, bundleRate: 270, monthlyRate: 400 },
  USD: { singleRate: 35, bundleRate: 315, monthlyRate: 480 },
  KES: { singleRate: 4500, bundleRate: 40500, monthlyRate: 58000 },
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: '€',
  CHF: 'CHF',
  USD: '$',
  KES: 'KSh',
}

const FAQItems = [
  {
    question: 'What is included in each lesson?',
    answer: 'Every lesson includes 1 hour of live instruction with your assigned teacher via Zoom, personalized curriculum adapted to your level, homework and practice materials, progress tracking, and feedback on your performance.',
  },
  {
    question: 'Are there discounts for longer packages?',
    answer: 'Yes! Our bundle packages offer significant savings. The 10-lesson bundle is discounted 10% from single rate, and the monthly plan (12 lessons) is discounted 20%. The more you commit, the more you save.',
  },
  {
    question: 'Can I use lessons across multiple languages?',
    answer: 'Absolutely! You can split your lesson bundle across multiple languages. For example, take 5 French lessons and 5 English lessons from the same bundle. Flexibility is key to our service.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'You can cancel or reschedule lessons up to 24 hours before the scheduled time at no penalty. Cancelled lessons within 24 hours are forfeited. Monthly plans can be paused for up to 30 days per year.',
  },
  {
    question: 'Do you offer corporate training discounts?',
    answer: 'Yes! We offer special corporate rates for teams and bulk packages. Contact our team at info@tonguestrend.com for customized quotes and group training options.',
  },
]

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <Stagger className="space-y-3" stagger={0.08} amount={0.1}>
      {FAQItems.map((item, index) => (
        <StaggerItem key={index} className="border border-gray-100 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-light transition-colors bg-white"
          >
            <span className="text-lg font-semibold text-navy text-left" style={{ fontFamily: 'Poppins' }}>
              {item.question}
            </span>
            <ChevronDown
              size={20}
              className={`text-gold transition-transform duration-300 flex-shrink-0 ml-4 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openIndex === index && (
            <div className="px-6 py-4 bg-gray-light border-t border-gray-100">
              <p className="text-gray-dark leading-relaxed">{item.answer}</p>
            </div>
          )}
        </StaggerItem>
      ))}
    </Stagger>
  )
}

function PricingCard({
  title,
  lessons,
  pricePerLesson,
  totalPrice,
  currency,
  highlight,
  features,
}: {
  title: string
  lessons: number
  pricePerLesson: number
  totalPrice: number
  currency: Currency
  highlight: boolean
  features: string[]
}) {
  return (
    <div
      className={`relative rounded-2xl p-8 transition-all duration-150 ${
        highlight
          ? 'bg-navy text-white border-2 border-gold shadow-lg transform lg:scale-105'
          : 'bg-white border border-gray-100 text-gray-dark hover:border-gold hover:shadow-lg'
      }`}
    >
      {highlight && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gold text-navy px-4 py-1 rounded-full text-sm font-bold" style={{ fontFamily: 'Poppins' }}>
          BEST VALUE
        </div>
      )}

      <h3 className={`text-2xl font-bold mb-2 ${highlight ? 'text-white' : 'text-navy'}`} style={{ fontFamily: 'Poppins' }}>
        {title}
      </h3>
      <p className={`mb-6 ${highlight ? 'text-gray-300' : 'text-gray-mid'}`}>{lessons} lessons</p>

      <div className="mb-2">
        <span className={`text-4xl font-bold ${highlight ? 'text-gold' : 'text-navy'}`} style={{ fontFamily: 'Poppins' }}>
          {CURRENCY_SYMBOLS[currency]}
          {totalPrice.toLocaleString()}
        </span>
      </div>
      <p className={`text-sm mb-8 ${highlight ? 'text-gray-300' : 'text-gray-mid'}`}>
        {CURRENCY_SYMBOLS[currency]}
        {pricePerLesson} per lesson
      </p>

      <button
        className={`w-full py-3 rounded-full font-semibold transition-all duration-150 mb-8 ${
          highlight
            ? 'bg-gold text-navy hover:bg-gold-light'
            : 'border-2 border-gold text-gold hover:bg-gold hover:text-navy'
        }`}
        style={{ fontFamily: 'Poppins' }}
      >
        Get Started
      </button>

      <div className="space-y-4">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <Check size={20} className={highlight ? 'text-gold flex-shrink-0' : 'text-gold flex-shrink-0'} />
            <span className="text-sm leading-relaxed">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PricingPage() {
  const [currency, setCurrency] = useState<Currency>('EUR')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const pricing = PRICING_DATA[currency]

  const features = {
    single: [
      'One 1-hour live lesson',
      'CEFR-aligned curriculum',
      'Personalized learning materials',
      'Homework and assignments',
      'Progress tracking',
      'Certificate upon completion',
    ],
    bundle: [
      '10 hours of live lessons',
      'Flexible scheduling',
      'Save 10% vs single lessons',
      'All single lesson features',
      'Priority teacher matching',
      'Custom curriculum plan',
      'Monthly progress reports',
    ],
    monthly: [
      '12 hours per month (3 per week)',
      'Locked-in rate for 3 months',
      'Save 20% vs single lessons',
      'Dedicated teacher',
      'All bundle features',
      'Free materials library access',
      'Certificate included',
    ],
  }

  return (
    <main className="w-full bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full bg-navy text-white py-16 sm:py-20 lg:py-24">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" direction="up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: 'Poppins' }}>
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the plan that works for you. All plans include live 1-on-1 lessons with certified teachers and CEFR-aligned curriculum.
          </p>
        </Reveal>
      </section>

      {/* Currency Toggle */}
      <section className="w-full bg-gray-light py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gold rounded-full font-semibold text-navy hover:bg-gray-light transition-colors"
              style={{ fontFamily: 'Poppins' }}
            >
              {currency}
              <ChevronDown size={18} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full mt-2 bg-white border border-gold rounded-xl shadow-lg z-10">
                {(['EUR', 'CHF', 'USD', 'KES'] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr)
                      setDropdownOpen(false)
                    }}
                    className={`block w-full text-left px-6 py-3 hover:bg-gray-light transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      currency === curr ? 'bg-gold text-navy font-bold' : 'text-navy'
                    }`}
                    style={{ fontFamily: 'Poppins' }}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="w-full bg-white py-20 sm:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6" direction="none" duration={0.7} amount={0.1}>
            <PricingCard
              title="Single Lesson"
              lessons={1}
              pricePerLesson={pricing.singleRate}
              totalPrice={pricing.singleRate}
              currency={currency}
              highlight={false}
              features={features.single}
            />

            <PricingCard
              title="Bundle Package"
              lessons={10}
              pricePerLesson={Math.round(pricing.bundleRate / 10)}
              totalPrice={pricing.bundleRate}
              currency={currency}
              highlight={true}
              features={features.bundle}
            />

            <PricingCard
              title="Monthly Plan"
              lessons={12}
              pricePerLesson={Math.round(pricing.monthlyRate / 12)}
              totalPrice={pricing.monthlyRate}
              currency={currency}
              highlight={false}
              features={features.monthly}
            />
          </Reveal>

          {/* M-Pesa Badge */}
          {currency === 'KES' && (
            <div className="mt-12 text-center p-6 bg-gray-light rounded-xl">
              <p className="text-lg font-semibold text-navy mb-2" style={{ fontFamily: 'Poppins' }}>
                Payment Methods for Kenya
              </p>
              <p className="text-gray-mid">
                We accept M-Pesa, bank transfers, and card payments. Contact{' '}
                <a href="mailto:info@tonguestrend.com" className="text-gold font-semibold hover:text-gold-light">
                  info@tonguestrend.com
                </a>{' '}
                for KES payment details.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Money-Back Guarantee */}
      <section className="w-full bg-gray-light py-16 sm:py-20">
        <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" direction="up">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
            30-Day Money-Back Guarantee
          </h2>
          <p className="text-lg text-gray-mid">
            Not satisfied with your first lesson? We offer a full refund within 7 days. Your satisfaction is our priority.
          </p>
        </Reveal>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-white py-20 sm:py-24 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16" direction="up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
              Pricing Questions
            </h2>
            <p className="text-lg text-gray-mid">Everything you need to know about our pricing and payment options.</p>
          </Reveal>

          <FAQAccordion />
        </div>
      </section>

      <Footer />
    </main>
  )
}
