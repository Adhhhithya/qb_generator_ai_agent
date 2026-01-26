import React from 'react'
import { motion } from 'framer-motion'

interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'error'
  showLabel?: boolean
  animated?: boolean
}

const sizeMap = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

const colorMap = {
  primary: 'from-primary-500 to-primary-600',
  success: 'from-emerald-500 to-emerald-600',
  warning: 'from-amber-500 to-amber-600',
  error: 'from-error to-rose-600',
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = true,
  animated = true,
}) => {
  const percentage = (value / max) * 100
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100)

  return (
    <div className="w-full space-y-2">
      <div className={`w-full bg-neutral-200 rounded-full overflow-hidden ${sizeMap[size]}`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${colorMap[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedPercentage}%` }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
          }}
        >
          {animated && (
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          )}
        </motion.div>
      </div>

      {showLabel && (
        <motion.div
          className="flex items-center justify-between text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-neutral-600 font-medium">{Math.round(clampedPercentage)}%</span>
          <span className="text-neutral-500">
            {value} / {max}
          </span>
        </motion.div>
      )}
    </div>
  )
}

export default Progress
