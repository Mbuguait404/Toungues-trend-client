import { BookOpen, Users, Zap } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Book a free consultation',
      description: 'Schedule your 30-minute consultation with one of our expert advisors, no commitment required.',
      icon: BookOpen,
    },
    {
      number: 2,
      title: 'Get matched with your teacher',
      description: 'We match you with the perfect certified teacher based on your goals, level, and schedule.',
      icon: Users,
    },
    {
      number: 3,
      title: 'Start learning at your pace',
      description: 'Begin your personalized 1-on-1 lessons and progress through the CEFR levels at your own speed.',
      icon: Zap,
    },
  ]

  return (
    <section className="w-full bg-white py-20 sm:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
            How It Works
          </h2>
          <p className="text-lg text-gray-mid max-w-2xl mx-auto">Get started on your language journey in three simple steps.</p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative">
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
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
