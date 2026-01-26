import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import AuditExplanationPanel from '../components/common/AuditExplanationPanel';
import { motion, AnimatePresence } from 'framer-motion';

interface ShellLayoutProps {
    children: React.ReactNode;
    activePage: string;
    setPage: (page: string) => void;
}

const ShellLayout = ({ children, activePage, setPage }: ShellLayoutProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const [rightPanelOpen, setRightPanelOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex transition-colors duration-200">
            {/* 1. Fixed Sidebar */}
            <Sidebar
                activePage={activePage}
                setPage={setPage}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            {/* 2. Main Area Wrapper */}
            <div
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300
          ${collapsed ? 'ml-20' : 'ml-72'}
        `}
            >
                {/* 3. Fixed Top Bar */}
                <TopBar
                    toggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
                    rightPanelOpen={rightPanelOpen}
                />

                {/* 4. Scrollable Content Area */}
                <main className="flex-1 pt-24 px-6 pb-12 overflow-y-auto w-full max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activePage}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* 5. Right Context Panel (Collapsible) */}
            <AnimatePresence>
                {rightPanelOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="fixed right-0 top-16 bottom-0 bg-white border-l border-slate-200 shadow-xl overflow-hidden z-20"
                    >
                        <div className="w-80 h-full overflow-y-auto custom-scrollbar">
                            <AuditExplanationPanel />
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShellLayout;
