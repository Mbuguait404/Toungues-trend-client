'use client'

import { useEffect, useState } from 'react'
import { useState as useStateLocal } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ChevronDown } from 'lucide-react'
import { getAllCourses, type Course } from '@/lib/api/courses'

const CEFR_LEVELS = [
  { level: 'A1', title: 'Beginner', description: 'Greet others, basic phrases, introduce yourself' },
  { level: 'A2', title: 'Elementary', description: 'Everyday situations, simple past/future tenses' },
  { level: 'B1', title: 'Intermediate', description: 'Share opinions, workplace/travel conversations' },
  { level: 'B2', title: 'Upper Intermediate', description: 'Abstract ideas, debates, complex discussions' },
  { level: 'C1', title: 'Advanced', description: 'Academic and professional contexts, nuanced expression' },
  { level: 'C2', title: 'Mastery', description: 'Near-native fluency, cultural idioms, specialized vocabulary' },
]

// Fallback static data shown while loading or if API has no courses yet
const STATIC_COURSES = [
  { _id: 'french', name: 'French', language: 'French', flag: '🇫🇷', slug: 'french', description: 'Master French from beginner to advanced with our native-speaking instructors. Learn conversational skills, grammar, and cultural nuances.', isActive: true },
  { _id: 'english', name: 'English', language: 'English', flag: '🇬🇧', slug: 'english', description: 'Improve your English proficiency for business, travel, or personal growth. Focus on practical communication skills and confidence.', isActive: true },
  { _id: 'german', name: 'German', language: 'German', flag: '🇩🇪', slug: 'german', description: 'Discover German with structured lessons. Perfect for professionals, students, and language enthusiasts at any level.', isActive: true },
  { _id: 'kiswahili', name: 'Kiswahili', language: 'Kiswahili', flag: '🇰🇪', slug: 'kiswahili', description: 'Explore East African culture through Kiswahili. Ideal for those interested in African languages and cross-cultural communication.', isActive: true },
]

const FLAG_MAP: Record<string, string> = {
  French: '🇫🇷', English: '🇬🇧', German: '🇩🇪', Kiswahili: '🇰🇪', Spanish: '🇪🇸', Italian: '🇮🇹',
}

const FAQItems = [
  {
    question: 'How much do sessions cost?',
    answer: 'Our standard rate is 30 EUR / 30 CHF / 35 USD per hour. We offer package deals for multiple lessons with discounts available. Monthly plans and bundle packages provide even better value. See our pricing page for complete details.',
  },
  {
    question: 'How do I schedule lessons?',
    answer: 'You can book lessons directly through our platform. We offer flexible scheduling from 6 AM to 10 PM in multiple time zones. Lessons can be booked as one-off sessions or recurring weekly/monthly plans. You can reschedule or cancel up to 24 hours in advance.',
  },
  {
    question: 'What materials do I need?',
    answer: 'All you need is a computer or tablet with internet connection and microphone/speaker. Our platform includes all learning materials, which are provided by your teacher. Supplementary resources and homework are available in your student portal.',
  },
  {
    question: 'Can I switch languages or pause my lessons?',
    answer: 'Absolutely! You can pause your learning anytime and resume later. Switching between languages is flexible—many students learn multiple languages simultaneously. If you want to change languages, just let your instructor know and we&apos;ll adjust your curriculum.',
  },
]

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      {FAQItems.map((item, index) => (
        <div key={index} className="border border-gray-100 rounded-xl overflow-hidden">
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
        </div>
      ))}
    </div>
  )
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<(typeof STATIC_COURSES[number])[]>(STATIC_COURSES)

  useEffect(() => {
    getAllCourses()
      .then((apiCourses) => {
        if (apiCourses.length > 0) {
          const mapped = apiCourses
            .filter((c) => c.isActive)
            .map((c) => ({
              _id: c._id,
              name: c.name,
              language: c.language,
              flag: FLAG_MAP[c.language] ?? '🌐',
              slug: c.slug ?? c.name.toLowerCase(),
              description: c.description ?? '',
              isActive: c.isActive,
            }))
          setCourses(mapped)
        }
      })
      .catch(() => {
        // keep static fallback
      })
  }, [])

  return (
    <main className="w-full bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full bg-navy text-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: 'Poppins' }}>
            Our Language Courses
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive CEFR-aligned courses from beginner to advanced proficiency. Choose your language and start learning with expert instructors today.
          </p>
        </div>
      </section>

      {/* Course Cards with CEFR Tables */}
      <section className="w-full bg-white py-20 sm:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 lg:space-y-16">
            {courses.map((course, idx) => (
              <div key={course.name}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
                  {/* Course Info */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-light rounded-2xl p-8">
                      <div className="text-6xl mb-4">{course.flag}</div>
                      <h2 className="text-3xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
                        {course.name}
                      </h2>
                      <p className="text-gray-mid mb-6 leading-relaxed">{course.description}</p>
                      <div className="flex gap-3">
                        <a href={`/courses/${course.slug}`} className="flex-1 px-4 py-3 rounded-full bg-gold text-navy font-semibold hover:bg-gold-light transition-all duration-150 text-center" style={{ fontFamily: 'Poppins' }}>
                          Enrol Now
                        </a>
                        <a href={course.slug === 'french' ? 'https://tonguestrend.simplybook.me/v2/#book/service/6/count/1/' : 'https://www.tonguestrend.com/plans'} className="flex-1 px-4 py-3 rounded-full border-2 border-gold text-gold font-semibold hover:bg-gray-light transition-all duration-150 text-center" style={{ fontFamily: 'Poppins' }}>
                          Book Consultation
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* CEFR Levels Table */}
                  <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                      <div className="grid grid-cols-2 sm:grid-cols-3 bg-navy text-white">
                        <div className="px-4 sm:px-6 py-4 font-bold text-center" style={{ fontFamily: 'Poppins' }}>
                          Level
                        </div>
                        <div className="px-4 sm:px-6 py-4 font-bold" style={{ fontFamily: 'Poppins' }}>
                          Title
                        </div>
                        <div className="hidden sm:block px-4 sm:px-6 py-4 font-bold" style={{ fontFamily: 'Poppins' }}>
                          What You&apos;ll Learn
                        </div>
                      </div>
                      {CEFR_LEVELS.map((item, i) => (
                        <div
                          key={item.level}
                          className={`grid grid-cols-2 sm:grid-cols-3 border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-light'}`}
                        >
                          <div className="px-4 sm:px-6 py-4 font-bold text-gold text-center text-lg" style={{ fontFamily: 'Poppins' }}>
                            {item.level}
                          </div>
                          <div className="px-4 sm:px-6 py-4 font-semibold text-navy" style={{ fontFamily: 'Poppins' }}>
                            {item.title}
                          </div>
                          <div className="hidden sm:block px-4 sm:px-6 py-4 text-gray-dark text-sm">
                            {item.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                {idx < courses.length - 1 && (
                  <div className="h-px bg-gray-light my-8 lg:my-12"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-gray-light py-20 sm:py-24 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-mid">Get answers to common questions about our courses.</p>
          </div>

          <FAQAccordion />
        </div>
      </section>

      <Footer />
    </main>
  )
}
