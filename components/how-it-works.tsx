import { BookOpen, Users, Zap } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Personal Welcome Consultation',
      description: 'Meet a teacher online for a short, friendly consultation. Share your goals, ask questions, and learn how our lessons work before you begin.',
      icon: BookOpen,
    },
    {
      number: 2,
      title: 'Easy Scheduling and 1-to-1 Lessons',
      description: 'Choose lesson times that fit your routine, learn from anywhere, and progress at a comfortable pace with private online lessons.',
      icon: Users,
    },
    {
      number: 3,
      title: 'Clear Progress with CEFR Levels',
      description: 'Our lessons follow the CEFR framework so you always know where you are and what you are working towards next.',
      icon: Zap,
    },
  ]

  return (
    <section className="w-full bg-white py-20 sm:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <Reveal className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
            Learning a New Language Should Feel Exciting and Supportive
          </h2>
          <p className="text-lg text-gray-mid max-w-2xl mx-auto">Here is how we support you from the very first class and beyond.</p>
        </Reveal>

        {/* Steps Grid */}
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12" stagger={0.12} amount={0.1}>
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <StaggerItem key={step.number} className="relative">
                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-8 hover:border-gold hover:shadow-lg transition-all duration-150 h-full">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-gold text-navy font-bold flex items-center justify-center text-lg"
                    style={{ fontFamily: 'Poppins' }}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mb-6 mt-2">
                    <Icon className="w-10 h-10 text-navy" strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-navy mb-3" style={{ fontFamily: 'Poppins' }}>
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-mid leading-relaxed">{step.description}</p>
                </div>

                {/* Connector Line (hidden on mobile, visible on desktop) */}
                {step.number < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-12 w-12 lg:w-24 h-0.5 bg-gold transform -translate-y-1/2" />
                )}
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
