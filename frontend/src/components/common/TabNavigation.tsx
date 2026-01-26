import { motion } from 'framer-motion'

interface Tab {
  name: string
  id: string
  description: string
}

const tabs: Tab[] = [
  { name: 'Generate QP', id: 'createPaper', description: 'Create new question papers' },
  { name: 'Drafts', id: 'drafts', description: 'In-progress papers' },
  { name: 'Finalized Papers', id: 'finalized', description: 'Locked, export-ready papers' },
  { name: 'History', id: 'history', description: 'Previously generated papers' },
]

interface TabNavigationProps {
  activePage: string
  onPageChange: (page: string) => void
}

const TabNavigation = ({ activePage, onPageChange }: TabNavigationProps) => {
  return (
    <motion.div
      className="border-b border-neutral-200 bg-white sticky top-16 z-40 backdrop-blur-sm bg-opacity-95"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex space-x-1" aria-label="Tabs">
          {tabs.map((tab, index) => {
            const active = activePage === tab.id
            return (
              <motion.button
                key={tab.name}
                onClick={() => onPageChange(tab.id)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ backgroundColor: 'rgba(74, 111, 165, 0.05)' }}
                whileTap={{ scale: 0.98 }}
                className={`
                  group relative px-6 py-4 text-sm font-medium transition-all duration-200 cursor-pointer rounded-t-lg
                  ${
                    active
                      ? 'text-primary-600'
                      : 'text-neutral-600 hover:text-primary-600'
                  }
                `}
                aria-current={active ? 'page' : undefined}
                title={tab.description}
              >
                <span className="relative z-10">{tab.name}</span>
                {active && (
                  <motion.div
                    layoutId="activeTabNav"
                    className="absolute bottom-0 left-1 right-1 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-t"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </motion.button>
            )
          })}
        </nav>
      </div>
    </motion.div>
  )
}

export default TabNavigation
