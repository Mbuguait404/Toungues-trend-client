'use client'

import Image from 'next/image'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ChevronDown, X, Loader2, CheckCircle2, UserPlus, Smartphone } from 'lucide-react'
import { getAllCourses, type Course } from '@/lib/api/courses'
import { enrolInCourse } from '@/lib/api/enrollments'
import { getMyPayment, startPayHeroCoursePayment } from '@/lib/api/payments'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { ApiException } from '@/lib/api'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'

const CEFR_LEVELS = [
  { level: 'A1', title: 'Beginner', description: 'Greet others, basic phrases, introduce yourself' },
  { level: 'A2', title: 'Elementary', description: 'Everyday situations, simple past/future tenses' },
  { level: 'B1', title: 'Intermediate', description: 'Share opinions, workplace/travel conversations' },
  { level: 'B2', title: 'Upper Intermediate', description: 'Abstract ideas, debates, complex discussions' },
  { level: 'C1', title: 'Advanced', description: 'Academic and professional contexts, nuanced expression' },
  { level: 'C2', title: 'Mastery', description: 'Near-native fluency, cultural idioms, specialized vocabulary' },
]

const FLAG_IMAGES: Record<string, string> = {
  French: '/images/Language Tutoring Services at Tongues Trend/imgi_2_public.png',
  English: '/images/Language Tutoring Services at Tongues Trend/imgi_3_public.png',
  German: '/images/Language Tutoring Services at Tongues Trend/imgi_4_public.png',
  Kiswahili: '/images/Language Tutoring Services at Tongues Trend/imgi_5_public.png',
}

const STATIC_COURSES = [
  { _id: 'french', name: 'French', language: 'French', flag: FLAG_IMAGES.French, slug: 'french', description: 'Master French from beginner to advanced with our native-speaking instructors. Learn conversational skills, grammar, and cultural nuances.', isActive: true },
  { _id: 'english', name: 'English', language: 'English', flag: FLAG_IMAGES.English, slug: 'english', description: 'Improve your English proficiency for business, travel, or personal growth. Focus on practical communication skills and confidence.', isActive: true },
  { _id: 'german', name: 'German', language: 'German', flag: FLAG_IMAGES.German, slug: 'german', description: 'Discover German with structured lessons. Perfect for professionals, students, and language enthusiasts at any level.', isActive: true },
  { _id: 'kiswahili', name: 'Kiswahili', language: 'Kiswahili', flag: FLAG_IMAGES.Kiswahili, slug: 'kiswahili', description: 'Explore East African culture through Kiswahili. Ideal for those interested in African languages and cross-cultural communication.', isActive: true },
]

const FLAG_MAP: Record<string, string> = {
  french: FLAG_IMAGES.French,
  english: FLAG_IMAGES.English,
  german: FLAG_IMAGES.German,
  kiswahili: FLAG_IMAGES.Kiswahili,
  spanish: FLAG_IMAGES.French,
  italian: FLAG_IMAGES.French,
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

type DisplayCourse = typeof STATIC_COURSES[number]
  & { accessType?: 'paid' | 'free'; price?: number; currency?: Course['currency'] }

function EnrolModal({
  course,
  onClose,
  initialLevel,
}: {
  course: DisplayCourse | null
  onClose: () => void
  initialLevel: string
}) {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedLevel, setSelectedLevel] = useState(initialLevel)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [previewStarted, setPreviewStarted] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)

  useEffect(() => {
    if (!paymentId || paymentStatus !== 'pending') return
    let active = true
    const checkPayment = async () => {
      try {
        const payment = await getMyPayment(paymentId)
        if (!active) return
        setPaymentStatus(payment.status)
        if (payment.status === 'success') {
          setSuccess(true)
          window.setTimeout(() => {
            onClose()
            router.push('/learn/courses')
          }, 1600)
        }
        if (payment.status === 'failed') setError('Payment was not completed. You can try again.')
      } catch {
        if (active) setError('Could not check payment status. Refresh your payments page to check again.')
      }
    }
    const timer = window.setInterval(checkPayment, 4000)
    checkPayment()
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [paymentId, paymentStatus])

  if (!course) return null

  const handleEnrol = async () => {
    if (!user) {
      const returnTo = `/courses?checkout=${encodeURIComponent(course._id)}&level=${selectedLevel}`
      router.push(`/register?redirect=${encodeURIComponent(returnTo)}`)
      return
    }
    setIsEnrolling(true)
    setError(null)
    try {
      if (course.accessType === 'free') {
        await enrolInCourse(course._id, selectedLevel)
        setSuccess(true)
        setTimeout(() => {
          onClose()
          router.push('/learn/courses')
        }, 1800)
      } else {
        const result = await startPayHeroCoursePayment({
          courseId: course._id,
          level: selectedLevel,
          phoneNumber,
        })
        setPaymentId(result.paymentId)
        setPaymentStatus('pending')
      }
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

  const handleStartPreview = async () => {
    if (!user) {
      const returnTo = `/courses?preview=${encodeURIComponent(course._id)}&level=${selectedLevel}`
      router.push(`/register?redirect=${encodeURIComponent(returnTo)}`)
      return
    }
    setIsEnrolling(true)
    setError(null)
    try {
      await enrolInCourse(course._id, selectedLevel)
      setPreviewStarted(true)
      setSuccess(true)
      window.setTimeout(() => {
        onClose()
        router.push('/learn/courses')
      }, 1600)
    } catch (err: any) {
      setError(err instanceof ApiException ? err.message : 'Could not start the free preview')
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
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/30 bg-white/10">
              <Image src={course.flag} alt={`${course.name} flag`} fill className="object-cover" />
            </div>
            <div>
              <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">Enrol Now</p>
              <h3 className="text-xl font-bold" style={{ fontFamily: 'Poppins' }}>
                {course.name}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center text-center py-6">
              <CheckCircle2 size={56} className="text-green-500 mb-4" />
              <h4 className="text-xl font-bold text-navy mb-2" style={{ fontFamily: 'Poppins' }}>
                {previewStarted ? 'Free preview ready' : course.accessType === 'free' ? "You're enrolled!" : 'Payment confirmed'}
              </h4>
              <p className="text-gray-500">Your course is ready. Redirecting to your courses...</p>
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

              {course.accessType !== 'free' && (
                <div className="mb-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-sm text-gray-600">Paid course</span>
                    <span className="font-bold text-navy">
                      {course.price != null ? `${course.currency ?? 'KES'} ${course.price.toLocaleString()}` : 'Price not configured'}
                    </span>
                  </div>
                  {user && (
                    <label className="block text-sm font-semibold text-navy">
                      M-Pesa phone number
                      <span className="relative mt-2 block">
                        <Smartphone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(event) => setPhoneNumber(event.target.value)}
                          placeholder="07XXXXXXXX"
                          className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-sm font-normal outline-none focus:border-gold"
                        />
                      </span>
                    </label>
                  )}
                  {paymentStatus === 'pending' && (
                    <p className="mt-3 flex items-center gap-2 text-sm text-amber-700">
                      <Loader2 size={16} className="animate-spin" /> Approve the payment prompt on your phone.
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={handleEnrol}
                disabled={isEnrolling || paymentStatus === 'pending' || (course.accessType !== 'free' && (!course.price || user && !phoneNumber.trim() || !user && !/^([0-9a-f]{24})$/i.test(course._id)))}
                className="w-full bg-gold text-navy font-bold py-3 rounded-full hover:bg-gold-light transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isEnrolling ? <Loader2 size={18} className="animate-spin" /> : null}
                {isEnrolling
                  ? paymentId ? 'Starting payment...' : 'Enrolling...'
                  : paymentStatus === 'pending'
                    ? 'Waiting for payment'
                    : course.accessType === 'free'
                      ? user ? 'Start free course' : 'Register to start free'
                      : user ? paymentStatus === 'failed' ? 'Try payment again' : 'Pay to get started'
                        : 'Register to get started'}
              </button>
              {course.accessType !== 'free' && (
                <button
                  type="button"
                  onClick={handleStartPreview}
                  disabled={isEnrolling || paymentStatus === 'pending'}
                  className="mt-3 w-full rounded-full border border-gray-200 py-3 font-semibold text-gray-700 hover:border-gold hover:text-navy disabled:opacity-50"
                >
                  {user ? 'Start with the free first lesson part' : 'Register for the free preview'}
                </button>
              )}
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
  const checkoutParam = searchParams.get('checkout')
  const previewParam = searchParams.get('preview')
  const checkoutLevel = searchParams.get('level') ?? 'A1'

  const [courses, setCourses] = useState<DisplayCourse[]>(STATIC_COURSES)
  const [enrollingCourse, setEnrollingCourse] = useState<DisplayCourse | null>(null)

  useEffect(() => {
    getAllCourses()
      .then((apiCourses) => {
        const coursesByLanguage = new Map<string, DisplayCourse>(
          STATIC_COURSES.map((course) => [course.slug, course]),
        )

        apiCourses
          .filter((apiCourse) => apiCourse.isActive)
          .forEach((apiCourse) => {
            const slug = apiCourse.language.trim().toLowerCase()
            coursesByLanguage.set(slug, {
              _id: apiCourse._id,
              name: apiCourse.title,
              language: apiCourse.language,
              flag: FLAG_MAP[slug] ?? FLAG_IMAGES.English,
              slug,
              description: apiCourse.description ?? '',
              isActive: apiCourse.isActive,
              accessType: apiCourse.accessType ?? 'paid',
              price: apiCourse.price,
              currency: apiCourse.currency ?? 'KES',
            })
          })

        setCourses(Array.from(coursesByLanguage.values()))
      })
      .catch(() => {})
  }, [])

  // Resume checkout after registration, or preserve the legacy enrol link.
  useEffect(() => {
    const targetId = checkoutParam ?? previewParam ?? enrolParam
    if (targetId && courses.length > 0) {
      const target = courses.find((c) => c._id === targetId)
      if (target) {
        setEnrollingCourse(target)
      }
    }
  }, [checkoutParam, previewParam, enrolParam, courses])

  return (
    <main className="w-full bg-white">
      <Navbar />

      <section className="w-full bg-navy text-white py-16 sm:py-20 lg:py-24">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" direction="up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: 'Poppins' }}>
            Our Language Courses
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive CEFR-aligned courses from beginner to advanced proficiency. Choose your language and start learning with expert instructors today.
          </p>
        </Reveal>
      </section>

      <section className="w-full bg-white py-20 sm:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Stagger className="space-y-12 lg:space-y-16" stagger={0.12} amount={0.05}>
            {courses.map((course, idx) => (
              <StaggerItem key={course.slug}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
                  <div className="lg:col-span-1">
                    <div className="bg-gray-light rounded-2xl p-8">
                      <div className="relative h-20 w-20 mb-4 overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm">
                        <Image src={course.flag} alt={`${course.name} flag`} fill className="object-cover" />
                      </div>
                      <h2 className="text-3xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
                        {course.name}
                      </h2>
                      <p className="text-gray-mid mb-6 leading-relaxed">{course.description}</p>
                      <p className="mb-5 text-sm font-semibold text-navy">
                        {course.accessType === 'free'
                          ? 'Free course'
                          : `${course.price != null ? `${course.currency ?? 'KES'} ${course.price.toLocaleString()} · ` : 'Paid course · '}`}
                        {course.accessType !== 'free' && 'First lesson part is free'}
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setEnrollingCourse(course)}
                          className="flex-1 px-4 py-3 rounded-full bg-gold text-navy font-semibold hover:bg-gold-light transition-all duration-150 text-center"
                          style={{ fontFamily: 'Poppins' }}
                        >
                          {course.accessType === 'free' ? 'Start free' : 'Register to get started'}
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
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="w-full bg-gray-light py-20 sm:py-24 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16" direction="up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-mid">Get answers to common questions about our courses.</p>
          </Reveal>

          <FAQAccordion />
        </div>
      </section>

      <Footer />

      {enrollingCourse && (
        <EnrolModal course={enrollingCourse} initialLevel={checkoutLevel} onClose={() => setEnrollingCourse(null)} />
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
