import { motion } from 'framer-motion'

interface CapabilityCardProps {
  title: string
  description: string
  icon: string
  color: string
  delay?: number
}

const CapabilityCard = ({
  title,
  description,
  icon,
  delay = 0,
}: CapabilityCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 rounded-lg border border-neutral-200 hover:border-primary-300 transition-all duration-300 cursor-pointer hover:shadow-md"
    >
      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-semibold text-neutral-900 mb-1 text-sm">{title}</h3>
      <p className="text-xs text-neutral-600 leading-relaxed">{description}</p>
    </motion.div>
  )
}

const IntroBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-b from-primary-50/50 to-white border-b border-neutral-200 mb-8 rounded-xl overflow-hidden"
    >
      <div className="px-0 py-12 relative">
        {/* Animated background elements */}
        <motion.div
          className="absolute -right-40 -top-40 w-80 h-80 bg-primary-100 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute -left-40 -bottom-40 w-80 h-80 bg-sky-100 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: 1,
          }}
        />

        {/* Main Intro Text */}
        <div className="mb-8 relative z-10">
          <motion.h1
            className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            StaffRoom AI
          </motion.h1>
          <motion.p
            className="text-xl text-neutral-700 mb-2 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            An AI-powered workspace for syllabus-aligned question paper creation.
          </motion.p>
          <motion.p
            className="text-base text-neutral-600 max-w-3xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Generate high-quality exam papers that align with your syllabus,
            maintain cognitive balance through Bloom's taxonomy, and ensure
            academic rigor—all powered by intelligent automation and faculty
            control.
          </motion.p>
        </div>

        {/* Capability Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, staggerChildren: 0.05 }}
        >
          <CapabilityCard
            title="Syllabus Upload"
            description="Structure your course content automatically"
            icon="📚"
            color="bg-primary-50"
            delay={0}
          />
          <CapabilityCard
            title="Paper Generation"
            description="Create question papers with AI assistance"
            icon="✏️"
            color="bg-primary-50"
            delay={0.05}
          />
          <CapabilityCard
            title="Smart Replacement"
            description="Replace questions while maintaining constraints"
            icon="🔄"
            color="bg-primary-50"
            delay={0.1}
          />
          <CapabilityCard
            title="Analytics"
            description="Track syllabus coverage and Bloom balance"
            icon="📊"
            color="bg-primary-50"
            delay={0.15}
          />
          <CapabilityCard
            title="Export & Share"
            description="Export papers in multiple formats"
            icon="📤"
            color="bg-primary-50"
            delay={0.2}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default IntroBanner
