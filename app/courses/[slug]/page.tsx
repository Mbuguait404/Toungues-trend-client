'use client'

import { useEffect, useState, use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ArrowLeft, ArrowRight, GraduationCap, MessageCircle, Loader2 } from 'lucide-react'
import { getAllCourses, type Course } from '@/lib/api/courses'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'

type StaticTemplate = {
  slug: string
  heroTitle: string
  intro: string
  whyTitle: string
  mainImage: string
  metricsImage: string
  highlights: Array<{ title: string; description: string; image: string }>
  structureIntro: string
  levels: Array<{ level: string; title: string; description: string }>
  teachingTitle: string
  teachingIntro: string
  teachingStyles: Array<{ title: string; description: string; image: string }>
  ctaTitle: string
  ctaDescription: string
  bookLink: string
  planLink: string
  ctaImage: string
}

const WHY_IMAGES = {
  lessons: '/images/shared/1 on 1 Lessons.png',
  cefr: '/images/shared/CEFR Aligned.png',
  pacing: '/images/shared/Customised Pacing.png',
}

const STATIC_TEMPLATES: Record<string, StaticTemplate> = {
  french: {
    slug: 'french',
    heroTitle: 'Learn French with Tongues Trend',
    intro: 'Discover the beauty of the French language with personalised online lessons. Whether you\'re learning for travel, work, studies, or personal growth, our courses help you progress step by step, from A1 beginner to C2 mastery.',
    whyTitle: 'Why learn French with us?',
    mainImage: '/images/Learn French Online with Tongues Trend/hero.jpg',
    metricsImage: '/images/Learn French Online with Tongues Trend/levels.png',
    highlights: [
      { title: '1 on 1 Lessons', description: 'Live online lessons with a professional teacher.', image: WHY_IMAGES.lessons },
      { title: 'CEFR Aligned', description: 'Progress according to CEFR levels (A1 --> C2).', image: WHY_IMAGES.cefr },
      { title: 'Customised Pacing', description: 'Customised pacing for your goals.', image: WHY_IMAGES.pacing },
    ],
    structureIntro: 'At Tongues Trend, our lessons follow the CEFR (Common European Framework of Reference), the global standard for language learning.',
    levels: [
      { level: 'A1', title: 'Beginner', description: 'Greet others, introduce yourself, ask and answer simple questions, use basic phrases.' },
      { level: 'A2', title: 'Elementary', description: 'Handle everyday situations like shopping and directions, and talk about the past or future in simple terms.' },
      { level: 'B1', title: 'Intermediate', description: 'Share opinions, describe experiences, and manage workplace or travel conversations.' },
      { level: 'B2', title: 'Upper Intermediate', description: 'Discuss abstract ideas, read longer texts, and handle debates and arguments.' },
      { level: 'C1', title: 'Advanced', description: 'Use French naturally in academic, professional, and social contexts.' },
      { level: 'C2', title: 'Mastery', description: 'Reach near-native fluency and understand almost everything heard or read.' },
    ],
    teachingTitle: 'Our Teaching Style',
    teachingIntro: 'Learning a language is more than memorizing words. At Tongues Trend, our teaching style combines structure with interaction.',
    teachingStyles: [
      { title: 'Interactive & Practical', description: 'Lessons are live on Zoom, with real conversation practice.', image: 'https://imagedelivery.net/izwgnqPfd1oZ2j0ibzRYFw/2196afd3-8520-497c-3118-e7fde2835000/public' },
      { title: 'Structured', description: 'Each level is structured around clear goals in speaking, listening, reading, and writing.', image: 'https://imagedelivery.net/izwgnqPfd1oZ2j0ibzRYFw/444cee7a-227f-420b-c821-fcf484eabd00/public' },
      { title: 'Full Support', description: 'You\'ll get digital materials such as PDFs, exercises, and whiteboard activities.', image: 'https://imagedelivery.net/izwgnqPfd1oZ2j0ibzRYFw/3025ef4f-e7db-480d-338f-89ff2d7b5f00/public' },
    ],
    ctaTitle: 'Want to discuss your learning needs first? Book a free consultation lesson!',
    ctaDescription: 'A 30-minute consultation lesson with a teacher to discuss your goals, learning style, and expectations before committing.',
    bookLink: 'https://tonguestrend.simplybook.me/v2/#book/service/6/count/1/',
    planLink: 'https://www.tonguestrend.com/plans',
    ctaImage: 'https://imagedelivery.net/izwgnqPfd1oZ2j0ibzRYFw/fc8e5be2-917e-4669-4d71-be483f5e3600/public',
  },
  english: {
    slug: 'english',
    heroTitle: 'Learn English with Tongues Trend',
    intro: 'Discover the beauty of the English language with personalised online lessons. Whether you\'re learning for travel, work, studies, or personal growth, our courses help you progress step by step, from A1 beginner to C2 mastery.',
    whyTitle: 'Why learn English with us?',
    mainImage: '/images/Learn English Online with Tongues Trend/hero.jpg',
    metricsImage: '/images/Learn English Online with Tongues Trend/levels.png',
    highlights: [
      { title: '1 on 1 Lessons', description: 'Live online lessons with a professional teacher.', image: WHY_IMAGES.lessons },
      { title: 'CEFR Aligned', description: 'Progress according to CEFR levels (A1 --> C2).', image: WHY_IMAGES.cefr },
      { title: 'Customised Pacing', description: 'Customised pacing for your goals.', image: WHY_IMAGES.pacing },
    ],
    structureIntro: 'At Tongues Trend, our lessons follow the CEFR (Common European Framework of Reference), the global standard for language learning.',
    levels: [
      { level: 'A1', title: 'Beginner', description: 'Greet others, introduce yourself, ask and answer simple questions, use basic phrases.' },
      { level: 'A2', title: 'Elementary', description: 'Handle everyday situations like shopping and directions, and talk about the past or future in simple terms.' },
      { level: 'B1', title: 'Intermediate', description: 'Share opinions, describe experiences, and manage workplace or travel conversations.' },
      { level: 'B2', title: 'Upper Intermediate', description: 'Discuss abstract ideas, read longer texts, and handle debates and arguments.' },
      { level: 'C1', title: 'Advanced', description: 'Use English naturally in academic, professional, and social contexts.' },
      { level: 'C2', title: 'Mastery', description: 'Reach near-native fluency and understand almost everything heard or read.' },
    ],
    teachingTitle: 'Our Teaching Style',
    teachingIntro: 'Learning a language is more than memorizing words. At Tongues Trend, our teaching style combines structure with interaction.',
    teachingStyles: [
      { title: 'Interactive & Practical', description: 'Lessons are live on Zoom, with real conversation practice.', image: 'https://imagedelivery.net/izwgnqPfd1oZ2j0ibzRYFw/2196afd3-8520-497c-3118-e7fde2835000/public' },
      { title: 'Structured', description: 'Each level is structured around clear goals in speaking, listening, reading, and writing.', image: 'https://imagedelivery.net/izwgnqPfd1oZ2j0ibzRYFw/444cee7a-227f-420b-c821-fcf484eabd00/public' },
      { title: 'Full Support', description: 'You\'ll get digital materials such as PDFs, exercises, and whiteboard activities.', image: 'https://imagedelivery.net/izwgnqPfd1oZ2j0ibzRYFw/d08fc03b-d416-409b-fe78-7de1865aab00/public' },
    ],
    ctaTitle: 'Want to discuss your learning needs first? Book a free consultation lesson!',
    ctaDescription: 'A 30-minute consultation lesson with a teacher to discuss your goals, learning style, and expectations before committing.',
    bookLink: 'https://tonguestrend.simplybook.me/v2/#book/service/6/count/1/',
    planLink: 'https://www.tonguestrend.com/plans',
    ctaImage: 'https://imagedelivery.net/izwgnqPfd1oZ2j0ibzRYFw/fc8e5be2-917e-4669-4d71-be483f5e3600/public',
  },
  german: {
    slug: 'german',
    heroTitle: 'Learn German with Tongues Trend',
    intro: 'Discover the beauty of the German language with personalised online lessons. Whether you\'re learning for travel, work, studies, or personal growth, our courses help you progress step by step, from A1 beginner to C2 mastery.',
    whyTitle: 'Why learn German with us?',
    mainImage: '/images/Learn German Online with Tongues Trend/hero.jpg',
    metricsImage: '/images/Learn German Online with Tongues Trend/levels.png',
    highlights: [
      { title: '1 on 1 Lessons', description: 'Live online lessons with a professional teacher.', image: WHY_IMAGES.lessons },
      { title: 'CEFR Aligned', description: 'Progress according to CEFR levels (A1 --> C2).', image: WHY_IMAGES.cefr },
      { title: 'Customised Pacing', description: 'Customised pacing for your goals.', image: WHY_IMAGES.pacing },
    ],
    structureIntro: 'At Tongues Trend, our lessons follow the CEFR (Common European Framework of Reference), the global standard for language learning.',
    levels: [
      { level: 'A1', title: 'Beginner', description: 'Greet others, introduce yourself, ask and answer simple questions, use basic phrases.' },
      { level: 'A2', title: 'Elementary', description: 'Handle everyday situations like shopping and directions, and talk about the past or future in simple terms.' },
      { level: 'B1', title: 'Intermediate', description: 'Share opinions, describe experiences, and manage workplace or travel conversations.' },
      { level: 'B2', title: 'Upper Intermediate', description: 'Discuss abstract ideas, read longer texts, and handle debates and arguments.' },
      { level: 'C1', title: 'Advanced', description: 'Use German naturally in academic, professional, and social contexts.' },
      { level: 'C2', title: 'Mastery', description: 'Reach near-native fluency and understand almost everything heard or read.' },
    ],
    teachingTitle: 'Our Teaching Style',
    teachingIntro: 'Learning a language is more than memorizing words. At Tongues Trend, our teaching style combines structure with interaction.',
    teachingStyles: [
      { title: 'Interactive & Practical', description: 'Lessons are live on Zoom, with real conversation practice.', image: 'https://imagedelivery.net/izwgnqPfd1oZ2j0ibzRYFw/2196afd3-8520-497c-3118-e7fde2835000/public' },
      { title: 'Structured', description: 'Each level is structured around clear goals in speaking, listening, reading, and writing.', image: 'https://imagedelivery.net/izwgnqPfd1oZ2j0ibzRYFw/444cee7a-227f-420b-c821-fcf484eabd00/public' },
      { title: 'Full Support', description: 'You\'ll get digital materials such as PDFs, exercises, and whiteboard activities.', image: 'https://imagedelivery.net/izwgnqPfd1oZ2j0ibzRYFw/d08fc03b-d416-409b-fe78-7de1865aab00/public' },
    ],
    ctaTitle: 'Book a Free Consultation Lesson',
    ctaDescription: 'A 30-minute consultation lesson with a teacher to discuss your goals, learning style, and expectations before committing.',
    bookLink: 'https://tonguestrend.simplybook.me/v2/#book/service/6/count/1/',
    planLink: 'https://www.tonguestrend.com/plans',
    ctaImage: 'https://imagedelivery.net/izwgnqPfd1oZ2j0ibzRYFw/fc8e5be2-917e-4669-4d71-be483f5e3600/public',
  },
  kiswahili: {
    slug: 'kiswahili',
    heroTitle: 'Learn Kiswahili with Tongues Trend',
    intro: 'Discover the beauty of the Kiswahili language with personalised online lessons. Whether you\'re learning for travel, work, studies, or personal growth, our courses help you progress step by step, from A1 beginner to C2 mastery.',
    whyTitle: 'Why learn Kiswahili with us?',
    mainImage: '/images/Learn Kiswahili Online with Tongues Trend/hero.jpg',
    metricsImage: '/images/Learn Kiswahili Online with Tongues Trend/levels.jpg',
    highlights: [
      { title: '1 on 1 Lessons', description: 'Live online lessons with a professional teacher.', image: WHY_IMAGES.lessons },
      { title: 'CEFR Aligned', description: 'Progress according to CEFR levels (A1 --> C2).', image: WHY_IMAGES.cefr },
      { title: 'Customised Pacing', description: 'Customised pacing for your goals.', image: WHY_IMAGES.pacing },
    ],
    structureIntro: 'At Tongues Trend, our lessons follow the CEFR (Common European Framework of Reference), the global standard for language learning.',
    levels: [
      { level: 'A1', title: 'Beginner', description: 'Greet others, introduce yourself, ask and answer simple questions, use basic phrases.' },
      { level: 'A2', title: 'Elementary', description: 'Handle everyday situations like shopping and directions, and talk about the past or future in simple terms.' },
      { level: 'B1', title: 'Intermediate', description: 'Share opinions, describe experiences, and manage workplace or travel conversations.' },
      { level: 'B2', title: 'Upper Intermediate', description: 'Discuss abstract ideas, read longer texts, and handle debates and arguments.' },
      { level: 'C1', title: 'Advanced', description: 'Use Kiswahili naturally in academic, professional, and social contexts.' },
      { level: 'C2', title: 'Mastery', description: 'Reach near-native fluency and understand almost everything heard or read.' },
    ],
    teachingTitle: 'Our Teaching Style',
    teachingIntro: 'Learning a language is more than memorizing words. At Tongues Trend, our teaching style combines structure with interaction.',
    teachingStyles: [
      { title: 'Interactive & Practical', description: 'Lessons are live on Zoom, with real conversation practice.', image: 'https://imagedelivery.net/izwgnqPfd1oZ2j0ibzRYFw/2196afd3-8520-497c-3118-e7fde2835000/public' },
      { title: 'Structured', description: 'Each level is structured around clear goals in speaking, listening, reading, and writing.', image: 'https://imagedelivery.net/izwgnqPfd1oZ2j0ibzRYFw/444cee7a-227f-420b-c821-fcf484eabd00/public' },
      { title: 'Full Support', description: 'You\'ll get digital materials such as PDFs, exercises, and whiteboard activities.', image: 'https://imagedelivery.net/izwgnqPfd1oZ2j0ibzRYFw/d08fc03b-d416-409b-fe78-7de1865aab00/public' },
    ],
    ctaTitle: 'Book a Free Consultation Lesson',
    ctaDescription: 'A 30-minute consultation lesson with a teacher to discuss your goals, learning style, and expectations before committing.',
    bookLink: 'https://tonguestrend.simplybook.me/v2/#book/service/6/count/1/',
    planLink: 'https://www.tonguestrend.com/plans',
    ctaImage: 'https://imagedelivery.net/izwgnqPfd1oZ2j0ibzRYFw/fc8e5be2-917e-4669-4d71-be483f5e3600/public',
  },
}

export default function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isActive, setIsActive] = useState(true)

  const template = STATIC_TEMPLATES[slug]

  useEffect(() => {
    getAllCourses()
      .then((courses) => {
        const found = courses.find(
          (c) => c.language.toLowerCase() === slug.toLowerCase(),
        )
        if (found) {
          setCourse(found)
          setIsActive(found.isActive)
        } else {
          setIsActive(false)
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [slug])

  if (!template) {
    notFound()
  }

  // If API loaded and course is deactivated, show 404-style message
  if (!isLoading && !isActive && !course) {
    return (
      <main className="w-full bg-white">
        <Navbar />
        <section className="w-full bg-navy text-white py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Course Not Available</h1>
          <p className="text-gray-300 text-lg mb-8">This course is currently unavailable. Please check back later or browse our other offerings.</p>
          <Link href="/courses" className="inline-flex items-center rounded-full bg-gold px-7 py-3 font-semibold text-navy hover:bg-gold-light transition-all">
            Browse Courses
          </Link>
        </section>
        <Footer />
      </main>
    )
  }

  const displayName = course?.title ?? template.heroTitle.replace(`Learn ${template.slug.charAt(0).toUpperCase() + template.slug.slice(1)} with`, '').replace(' Tongues Trend', '')
  const displayTitle = course ? `Learn ${course.title} with Tongues Trend` : template.heroTitle
  const displayDescription = course?.description ?? template.intro

  return (
    <main className="w-full bg-white">
      <Navbar />

      <section className="w-full bg-navy text-white pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/courses"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-gold"
            style={{ fontFamily: 'Poppins' }}
          >
            <ArrowLeft size={18} />
            Back to courses
          </Link>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
            <Reveal direction="left">
              <p className="text-gold font-semibold uppercase tracking-[0.25em] text-sm mb-4">Language Course</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: 'Poppins' }}>
                {displayTitle}
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed mb-8">{displayDescription}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                {course ? (
                  <Link
                    href={`/courses?enrol=${course._id}`}
                    className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3 font-semibold text-navy transition-all duration-150 hover:bg-gold-light"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    Enrol Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    href="/courses"
                    className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3 font-semibold text-navy transition-all duration-150 hover:bg-gold-light"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    Enrol Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white px-7 py-3 font-semibold text-white transition-all duration-150 hover:bg-white hover:text-navy"
                  style={{ fontFamily: 'Poppins' }}
                >
                  View Pricing
                </Link>
              </div>
            </Reveal>
            <Reveal direction="right" className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
              <img src={template.mainImage} alt={`${displayName} learning`} className="h-72 w-full rounded-2xl bg-white object-contain" />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12" direction="up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
              {template.whyTitle}
            </h2>
            <p className="text-lg text-gray-mid max-w-2xl mx-auto">Here's why students love learning with us.</p>
          </Reveal>
          <Stagger className="grid gap-8 md:grid-cols-3" stagger={0.12}>
            {template.highlights.map((item) => (
              <StaggerItem key={item.title} className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <img src={item.image} alt={item.title} className="mx-auto mb-5 h-44 w-44 rounded-xl object-contain" />
                <h3 className="text-xl font-bold text-navy mb-3" style={{ fontFamily: 'Poppins' }}>{item.title}</h3>
                <p className="text-gray-mid leading-relaxed">{item.description}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="w-full bg-gray-light py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-12 max-w-3xl text-center" direction="up">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gold text-navy">
                <GraduationCap size={26} />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
              Course Structure ({displayName} Levels)
            </h2>
            <p className="text-gray-mid leading-relaxed">{template.structureIntro}</p>
          </Reveal>
          <Reveal className="mb-12 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm" amount={0.1}>
            <img src={template.metricsImage} alt={`${displayName} course levels and progress`} className="block h-auto w-full" />
          </Reveal>
          <Reveal className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between" direction="up">
            <h3 className="text-2xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>Clear progress at every step</h3>
            <p className="max-w-2xl text-gray-mid leading-relaxed">Each level is designed to help learners move from simple everyday communication to confident, advanced expression, with feedback and support throughout.</p>
          </Reveal>
          <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" stagger={0.08} amount={0.05}>
            {template.levels.map((level) => (
              <StaggerItem as="article" key={level.level} className="h-full rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-baseline gap-3">
                  <span className="text-xl font-bold text-navy">{level.level}</span>
                  <span className="font-semibold text-gray-dark">{level.title}</span>
                </div>
                <p className="text-sm leading-relaxed text-gray-mid">{level.description}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12" direction="up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>{template.teachingTitle}</h2>
            <p className="text-lg text-gray-mid max-w-2xl mx-auto">{template.teachingIntro}</p>
          </Reveal>
          <Stagger className="grid gap-8 lg:grid-cols-3" stagger={0.12}>
            {template.teachingStyles.map((item) => (
              <StaggerItem key={item.title} className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-5 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-gray-light p-3">
                  <img src={item.image} alt={item.title} className="h-full w-full object-contain" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-3" style={{ fontFamily: 'Poppins' }}>{item.title}</h3>
                <p className="text-gray-mid leading-relaxed">{item.description}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="w-full bg-navy py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
            <Reveal direction="left">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold text-navy">
                <MessageCircle size={24} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins' }}>{template.ctaTitle}</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">{template.ctaDescription}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/courses" className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3 font-semibold text-navy transition-all duration-150 hover:bg-gold-light" style={{ fontFamily: 'Poppins' }}>
                  Enrol Now
                </Link>
                <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border-2 border-white px-7 py-3 font-semibold text-white transition-all duration-150 hover:bg-white hover:text-navy" style={{ fontFamily: 'Poppins' }}>
                  View Pricing
                </Link>
              </div>
            </Reveal>
            <Reveal direction="right" className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
              <img src={template.ctaImage} alt={`${displayName} course call to action`} className="h-72 w-full rounded-2xl object-cover" />
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
