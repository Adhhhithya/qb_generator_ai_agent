import React, { type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'

interface AnimatedCardProps {
  children: ReactNode
  delay?: number
  className?: string
  onClick?: () => void
  interactive?: boolean
  hover?: 'scale' | 'shadow' | 'lift' | 'glow'
}

const hoverVariants = {
  scale: {
    initial: { scale: 1 },
    hover: { scale: 1.02 },
  },
  shadow: {
    initial: { boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' },
    hover: { boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' },
  },
  lift: {
    initial: { y: 0, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' },
    hover: { y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' },
  },
  glow: {
    initial: { boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' },
    hover: {
      boxShadow: '0 0 20px 0 rgba(74, 111, 165, 0.4), 0 10px 20px -5px rgba(74, 111, 165, 0.2)',
    },
  },
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  delay = 0,
  className = '',
  onClick,
  interactive = true,
  hover = 'lift',
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay,
      },
    },
  }

  const hoverVariant = hoverVariants[hover]

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -100px 0px' }}
      variants={containerVariants}
      whileHover={interactive ? hoverVariant.hover : undefined}
      onClick={onClick}
      className={`card-elevated ${interactive ? 'cursor-pointer' : ''} ${className}`}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedListProps {
  children: React.ReactElement[]
  staggerDelay?: number
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  staggerDelay = 0.1,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="space-y-4"
    >
      {React.Children.map(children, (child) =>
        child
          ? React.cloneElement(child, {
              variants: itemVariants,
            } as any)
          : null
      )}
    </motion.div>
  )
}

interface AnimatedNumberProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  prefix = '',
  suffix = '',
}) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {value}
      </motion.span>
      {suffix}
    </motion.span>
  )
}

export default AnimatedCard
