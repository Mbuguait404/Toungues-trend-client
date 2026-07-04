import { Video, Trophy, Clock, Globe, Award, Users } from 'lucide-react'

export default function WhyTonguesTrend() {
  const features = [
    {
      title: 'Tailored Learning Plans',
      description: 'Experience customized learning paths designed to meet your unique language goals in French, English, German, or Kiswahili.',
      icon: Video,
    },
    {
      title: 'Flexible Scheduling',
      description: 'Choose lesson times that work best for you, ensuring language learning fits seamlessly into your life.',
      icon: Trophy,
    },
    {
      title: 'Expert Instructors',
      description: 'Learn from certified professionals who are dedicated to helping you build fluency and confidence in every lesson.',
      icon: Clock,
    },
    {
      title: 'CEFR-Aligned Progress',
      description: 'Follow a clear roadmap from beginner to advanced levels with milestones that keep your growth visible.',
      icon: Globe,
    },
    {
      title: 'Real Communication Skills',
      description: 'Our lessons focus on practical speaking, listening, and confidence-building from the very first class.',
      icon: Award,
    },
    {
      title: 'Supportive Teaching Team',
      description: 'Learn from teachers from Kenya, Europe, and beyond, bringing diverse perspectives and authentic expertise.',
      icon: Users,
    },
  ]

  return (
    <section className="w-full bg-white py-20 sm:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
            Personalized Learning at Your Pace
          </h2>
          <p className="text-lg text-gray-mid max-w-2xl mx-auto">Every lesson is designed to make language learning feel exciting, supportive, and deeply personal.</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="bg-white rounded-2xl border border-gray-100 p-8 hover:border-gold hover:shadow-lg transition-all duration-150"
              >
                {/* Icon */}
                <div className="mb-6">
                  <Icon className="w-10 h-10 text-gold" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-navy mb-3" style={{ fontFamily: 'Poppins' }}>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-mid leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
