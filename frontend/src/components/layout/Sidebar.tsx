import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    PlusCircle,
    Library,
    History,
    Settings,
    ChevronRight,
    ChevronLeft,
    FileText
} from 'lucide-react';

interface SidebarProps {
    activePage: string;
    setPage: (page: string) => void;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ activePage, setPage, collapsed, setCollapsed }: SidebarProps) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'generate', label: 'Generate', icon: PlusCircle },
        { id: 'bank', label: 'Questions', icon: Library },
        { id: 'drafts', label: 'Drafts', icon: FileText },
        { id: 'history', label: 'History', icon: History },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 80 : 280 }}
            className="h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-40 transition-all duration-300 shadow-sm"
        >
            {/* Header / Logo */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-tight"
                    >
                        Question Bank AI
                    </motion.div>
                )}
                {collapsed && <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 mx-auto flex items-center justify-center text-white font-bold text-lg shadow-sm">Q</div>}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 space-y-1.5 px-3">
                {menuItems.map((item) => {
                    const isActive = activePage === item.id;
                    const Icon = item.icon;

                    return (
                        <div key={item.id} className="relative group">
                            <button
                                onClick={() => setPage(item.id)}
                                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg transition-all duration-200 group relative z-10
                  ${isActive
                                        ? 'text-blue-700 font-semibold'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }
                  ${collapsed ? 'justify-center' : ''}
                `}
                            >
                                {/* Active Background */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-blue-50 rounded-lg -z-10 border border-blue-200/50 shadow-sm"
                                    />
                                )}

                                <Icon size={20} className={`transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} ${item.id === 'generate' && !isActive ? 'text-teal-500' : ''}`} />

                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="truncate"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}

                                {/* Tooltip for collapsed mode */}
                                {collapsed && (
                                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg translate-y-[-50%] top-1/2">
                                        {item.label}
                                        {/* Arrow */}
                                        <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-4 border-transparent border-r-slate-800" />
                                    </div>
                                )}
                            </button>
                        </div>
                    );
                })}
            </nav>

            {/* User / Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold border border-violet-200 shadow-sm">
                        AJ
                    </div>
                    {!collapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold text-slate-800 truncate">Adhithya J.</p>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-xs text-slate-500 truncate font-medium">Pro Plan</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
