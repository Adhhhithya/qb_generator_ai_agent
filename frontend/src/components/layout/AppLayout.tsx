import { ReactNode } from "react";
import { motion } from "framer-motion";
import TopNavTabs from "./TopNavTabs";

interface AppLayoutProps {
    children: ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const AppLayout = ({ children, activeTab, onTabChange }: AppLayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
            <TopNavTabs activeTab={activeTab} onTabChange={onTabChange} />
            <motion.main
                className="flex-1 max-w-7xl w-full mx-auto px-6 py-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                    duration: 0.5,
                    ease: "easeOut",
                }}
                key={activeTab}
            >
                {children}
            </motion.main>
        </div>
    );
};

export default AppLayout;
