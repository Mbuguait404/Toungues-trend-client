import type { Variants } from 'motion/react'

export interface ViewportConfig {
  once?: boolean
  amount?: number | 'some' | 'all'
  margin?: string
}

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1]

export const viewportOnce: ViewportConfig = { once: true, amount: 0.2 }
export const viewportOnceLoose: ViewportConfig = { once: true, amount: 0.1 }

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none'

export function buildRevealVariants(
  direction: RevealDirection = 'up',
  distance = 24,
  duration = 0.6,
  delay = 0,
): Variants {
  const hidden = {
    up: { opacity: 0, y: distance },
    down: { opacity: 0, y: -distance },
    left: { opacity: 0, x: distance },
    right: { opacity: 0, x: -distance },
    none: { opacity: 0 },
  }[direction]

  return {
    hidden,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, ease: EASE_OUT, delay },
    },
  }
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: EASE_OUT } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: EASE_OUT } },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
}

export function staggerContainer(staggerChildren = 0.12, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
  }
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
}
