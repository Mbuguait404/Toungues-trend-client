'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ChevronDown, X, Loader2, CheckCircle2, UserPlus } from 'lucide-react'
import { getAllCourses, type Course } from '@/lib/api/courses'
import { enrolInCourse } from '@/lib/api/enrollments'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { ApiException } from '@/lib/api'

const CEFR_LEVELS = [
  { level: 'A1', title: 'Beginner', description: 'Greet others, basic phrases, introduce yourself' },
  { level: 'A2', title: 'Elementary', description: 'Everyday situations, simple past/future tenses' },
  { level: 'B1', title: 'Intermediate', description: 'Share opinions, workplace/travel conversations' },
  { level: 'B2', title: 'Upper Intermediate', description: 'Abstract ideas, debates, complex discussions' },
  { level: 'C1', title: 'Advanced', description: 'Academic and professional contexts, nuanced expression' },
  { level: 'C2', title: 'Mastery', description: 'Near-native fluency, cultural idioms, specialized vocabulary' },
]

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
    answer: 'Absolutely! You can pause your learning anytime and resume later. Switching between languages is flexible \u2014 many students learn multiple languages simultaneously. If you want to change languages, just let your instructor know and we\u2019ll adjust your curriculum.',
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

type DisplayCourse = typeof STATIC_COURSES[number]

function EnrolModal({
  course,
  onClose,
}: {
  course: DisplayCourse | null
  onClose: () => void
}) {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedLevel, setSelectedLevel] = useState('A1')
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!course) return null

  const handleEnrol = async () => {
    if (!user) {
      router.push(`/register?redirect=/courses?enrol=${course._id}`)
      return
    }
    setIsEnrolling(true)
    setError(null)
    try {
      await enrolInCourse(course._id, selectedLevel)
      setSuccess(true)
      setTimeout(() => {
        onClose()
        router.push('/learn/courses')
      }, 1800)
    } catch (err: any) {
      if (err instanceof ApiException) {
        setError(err.message)
      } else {
        setError('Enrollment failed. Please try again.')
      }
    } finally {
      setIsEnrolling(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-navy text-white px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">Enrol Now</p>
            <h3 className="text-xl font-bold" style={{ fontFamily: 'Poppins' }}>
              {course.flag} {course.name}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center text-center py-6">
              <CheckCircle2 size={56} className="text-green-500 mb-4" />
              <h4 className="text-xl font-bold text-navy mb-2" style={{ fontFamily: 'Poppins' }}>You're enrolled!</h4>
              <p className="text-gray-500">Redirecting to your courses...</p>
            </div>
          ) : (
            <>
              {!user && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm mb-4">
                  <UserPlus size={18} />
                  <span>You'll create an account first, then jump straight into enrolment.</span>
                </div>
              )}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">
                  {error}
                </div>
              )}

              <label className="block text-sm font-semibold text-navy mb-2">Select Your Level</label>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {CEFR_LEVELS.map((l) => (
                  <button
                    key={l.level}
                    onClick={() => setSelectedLevel(l.level)}
                    className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                      selectedLevel === l.level
                        ? 'border-gold bg-gold text-navy'
                        : 'border-gray-200 text-gray-600 hover:border-gold hover:text-navy'
                    }`}
                  >
                    <span className="block text-lg">{l.level}</span>
                    <span className="text-xs font-normal">{l.title}</span>
                  </button>
                ))}
              </div>

              <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-600 mb-6">
                <span className="font-semibold text-navy">{selectedLevel} -- {CEFR_LEVELS.find(l => l.level === selectedLevel)?.title}</span>
                <br />
                {CEFR_LEVELS.find(l => l.level === selectedLevel)?.description}
              </div>

              <button
                onClick={handleEnrol}
                disabled={isEnrolling}
                className="w-full bg-gold text-navy font-bold py-3 rounded-full hover:bg-gold-light transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isEnrolling ? <Loader2 size={18} className="animate-spin" /> : null}
                {isEnrolling ? 'Enrolling...' : user ? 'Confirm Enrolment' : 'Create Account & Enrol'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function CoursesContent() {
  const searchParams = useSearchParams()
  const enrolParam = searchParams.get('enrol')

  const [courses, setCourses] = useState<DisplayCourse[]>(STATIC_COURSES)
  const [enrollingCourse, setEnrollingCourse] = useState<DisplayCourse | null>(null)

  useEffect(() => {
    getAllCourses()
      .then((apiCourses) => {
        if (apiCourses.length > 0) {
          const mapped = apiCourses
            .filter((c) => c.isActive)
            .map((c) => ({
              _id: c._id,
              name: c.title,
              language: c.language,
              flag: FLAG_MAP[c.language] ?? '🌐',
              slug: c.language.toLowerCase(),
              description: c.description ?? '',
              isActive: c.isActive,
            }))
          setCourses(mapped)
        }
      })
      .catch(() => {})
  }, [])

  // Auto-open enrol modal if ?enrol=COURSE_ID is in the URL
  useEffect(() => {
    if (enrolParam && courses.length > 0) {
      const target = courses.find((c) => c._id === enrolParam)
      if (target) {
        setEnrollingCourse(target)
      }
    }
  }, [enrolParam, courses])

  return (
    <main className="w-full bg-white">
      <Navbar />

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

      <section className="w-full bg-white py-20 sm:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 lg:space-y-16">
            {courses.map((course, idx) => (
              <div key={course.name}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
                  <div className="lg:col-span-1">
                    <div className="bg-gray-light rounded-2xl p-8">
                      <div className="text-6xl mb-4">{course.flag}</div>
                      <h2 className="text-3xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
                        {course.name}
                      </h2>
                      <p className="text-gray-mid mb-6 leading-relaxed">{course.description}</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setEnrollingCourse(course)}
                          className="flex-1 px-4 py-3 rounded-full bg-gold text-navy font-semibold hover:bg-gold-light transition-all duration-150 text-center"
                          style={{ fontFamily: 'Poppins' }}
                        >
                          Enrol Now
                        </button>
                        <a
                          href={`/courses/${(course.language || course.name).toLowerCase()}`}
                          className="flex-1 px-4 py-3 rounded-full border-2 border-gold text-gold font-semibold hover:bg-gray-light transition-all duration-150 text-center block"
                          style={{ fontFamily: 'Poppins' }}
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>

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
                          What You'll Learn
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

                {idx < courses.length - 1 && (
                  <div className="h-px bg-gray-light my-8 lg:my-12"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {enrollingCourse && (
        <EnrolModal course={enrollingCourse} onClose={() => setEnrollingCourse(null)} />
      )}
    </main>
  )
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <main className="w-full bg-white"><Navbar /><div className="flex items-center justify-center py-24 text-gray-400"><Loader2 size={32} className="animate-spin" /></div><Footer /></main>
    }>
      <CoursesContent />
    </Suspense>
  )
}
