'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

export interface ParallaxProps {
  children: ReactNode
  className?: string
  /** Total vertical travel in px across the element's scroll range. */
  distance?: number
  scaleFrom?: number
}

export default function Parallax({ children, className, distance = 60, scaleFrom }: ParallaxProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance])
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [scaleFrom ?? 1, 1, scaleFrom ?? 1],
  )
  const smoothY = useSpring(y, { stiffness: 120, damping: 24, mass: 0.4 })

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: smoothY, scale: scaleFrom ? scale : undefined, willChange: 'transform' }}>
        {children}
      </motion.div>
    </div>
  )
}
