'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { EASE_OUT, staggerContainer } from './variants'

const CONTAINER_TAGS = {
  div: motion.div,
  section: motion.section,
  ul: motion.ul,
  ol: motion.ol,
} as const

const ITEM_TAGS = {
  div: motion.div,
  li: motion.li,
  article: motion.article,
  span: motion.span,
} as const

type ContainerTag = keyof typeof CONTAINER_TAGS
type ItemTag = keyof typeof ITEM_TAGS

export interface StaggerProps {
  children: ReactNode
  as?: ContainerTag
  className?: string
  style?: CSSProperties
  delay?: number
  stagger?: number
  once?: boolean
  amount?: number
}

export function Stagger({
  children,
  as = 'div',
  className,
  style,
  delay = 0,
  stagger = 0.12,
  once = true,
  amount = 0.15,
}: StaggerProps) {
  const reduced = useReducedMotion()
  const Component = CONTAINER_TAGS[as]

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
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </Component>
  )
}

export interface StaggerItemProps {
  children: ReactNode
  as?: ItemTag
  className?: string
  style?: CSSProperties
  direction?: 'up' | 'left' | 'right' | 'scale'
  duration?: number
}

export function StaggerItem({
  children,
  as = 'div',
  className,
  style,
  direction = 'up',
  duration = 0.6,
}: StaggerItemProps) {
  const reduced = useReducedMotion()
  const Component = ITEM_TAGS[as]

  if (reduced) {
    return (
      <Component className={className} style={style}>
        {children}
      </Component>
    )
  }

  const hidden =
    direction === 'left'
      ? { opacity: 0, x: -32 }
      : direction === 'right'
        ? { opacity: 0, x: 32 }
        : direction === 'scale'
          ? { opacity: 0, scale: 0.94 }
          : { opacity: 0, y: 24 }

  return (
    <Component
      className={className}
      style={style}
      variants={{
        hidden,
        visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration, ease: EASE_OUT } },
      }}
    >
      {children}
    </Component>
  )
}
