import React, { type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'elevated' | 'outline' | 'ghost'
  hover?: 'lift' | 'shadow' | 'none'
  padding?: 'sm' | 'md' | 'lg'
}

const paddingMap = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const variantClasses = {
  elevated:
    'bg-white border border-neutral-200 shadow-sm hover:shadow-elevation-lg',
  outline: 'bg-transparent border-2 border-neutral-200 hover:border-primary-300',
  ghost: 'bg-neutral-50/50 border border-transparent hover:border-neutral-200',
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className = '',
      variant = 'elevated',
      hover = 'lift',
      padding = 'md',
    },
    ref
  ) => {
    const hoverAnimation =
      hover === 'lift' ? { y: -4 } : hover === 'shadow' ? { shadow: 'lg' } : {}

    return (
      <motion.div
        ref={ref}
        className={`rounded-lg transition-all duration-300 ${paddingMap[padding]} ${variantClasses[variant]} ${className}`}
        whileHover={hoverAnimation}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

interface BadgeProps {
  label: string
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  onClose?: () => void
}

const badgeVariants = {
  primary: 'badge-primary',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  info: 'bg-sky-100 text-sky-700',
  neutral: 'badge-neutral',
}

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  onClose,
}) => {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className={`inline-flex items-center gap-2 rounded-full font-medium ${badgeVariants[variant]} ${badgeSizes[size]}`}
    >
      {icon && <span>{icon}</span>}
      {label}
      {onClose && (
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="ml-1 hover:opacity-75"
        >
          ×
        </motion.button>
      )}
    </motion.span>
  )
}

interface DividerProps {
  variant?: 'horizontal' | 'vertical'
  text?: string
}

export const Divider: React.FC<DividerProps> = ({
  variant = 'horizontal',
  text,
}) => {
  if (variant === 'vertical') {
    return <div className="divider-v" />
  }

  return (
    <div className="relative my-6">
      {text ? (
        <div className="flex items-center gap-4">
          <div className="flex-1 divider-h" />
          <span className="text-sm text-neutral-500 font-medium">{text}</span>
          <div className="flex-1 divider-h" />
        </div>
      ) : (
        <div className="divider-h" />
      )}
    </div>
  )
}

export default Card
