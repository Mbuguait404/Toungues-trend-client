'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { buildRevealVariants, type RevealDirection } from './variants'

const TAGS = {
  div: motion.div,
  section: motion.section,
  span: motion.span,
  p: motion.p,
  li: motion.li,
  ul: motion.ul,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  article: motion.article,
  header: motion.header,
  figure: motion.figure,
  tr: motion.tr,
} as const

type Tag = keyof typeof TAGS

export interface RevealProps {
  children: ReactNode
  as?: Tag
  className?: string
  style?: CSSProperties
  direction?: RevealDirection
  delay?: number
  duration?: number
  distance?: number
  once?: boolean
  amount?: number
}

export default function Reveal({
  children,
  as = 'div',
  className,
  style,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 24,
  once = true,
  amount = 0.2,
}: RevealProps) {
  const reduced = useReducedMotion()
  const Component = TAGS[as]

  if (reduced) {
    return (
      <Component className={className} style={style}>
        {children}
      </Component>
    )
  }

  return (
    <Component
      className={className}
      style={style}
      variants={buildRevealVariants(direction, distance, duration, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </Component>
  )
}
