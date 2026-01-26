import { motion } from 'framer-motion'

interface TopNavTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const tabs = [
    { id: "dashboard", label: "Dashboard", color: "text-soft-purple-600" },
    { id: "generate", label: "Generate QP", color: "text-soft-orange-600" },
    { id: "drafts", label: "Drafts", color: "text-slate-600" },
    { id: "finalized", label: "Finalized", color: "text-soft-green-600" },
    { id: "history", label: "History", color: "text-soft-blue-600" },
];

const TopNavTabs = ({ activeTab, onTabChange }: TopNavTabsProps) => {
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm backdrop-blur-md bg-opacity-95">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo with Animation */}
                <motion.div
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="w-10 h-10 bg-gradient-to-br from-soft-purple-500 to-soft-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-soft-purple-100 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        SR
                    </motion.div>
                    <div>
                        <motion.span
                            className="text-xl font-bold bg-gradient-to-r from-soft-purple-600 to-soft-blue-600 bg-clip-text text-transparent block tracking-tight"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            StaffRoom AI
                        </motion.span>
                        <motion.span
                            className="text-xs text-primary-500 font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Question Bank Generator
                        </motion.span>
                    </div>
                </motion.div>

                {/* Navigation Tabs with Smooth Transitions */}
                <nav className="flex items-center space-x-1 h-full">
                    {tabs.map((tab, index) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <motion.button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                                    relative px-4 h-full flex items-center text-sm font-medium transition-all duration-300
                                    ${isActive
                                        ? `text-slate-900`
                                        : 'text-slate-500 hover:text-slate-800'
                                    }
                                `}
                            >
                                {tab.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className={`absolute bottom-0 left-0 right-0 h-1 rounded-t-md bg-gradient-to-r from-soft-orange-400 via-soft-purple-400 to-soft-blue-400`}
                                        initial={false}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 380,
                                            damping: 30,
                                        }}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </nav>

                {/* Profile Avatar with Menu */}
                <motion.div
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 border-2 border-primary-300 flex items-center justify-center cursor-pointer shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="text-sm font-bold text-primary-600">A</span>
                    </motion.div>
                </motion.div>
            </div>
        </header>
    );
};

export default TopNavTabs;
