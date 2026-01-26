import { Bell, Search, Info, HelpCircle } from 'lucide-react';

interface TopBarProps {
    toggleRightPanel: () => void;
    rightPanelOpen: boolean;
}

const TopBar = ({ toggleRightPanel, rightPanelOpen }: TopBarProps) => {
    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 right-0 left-0 z-30 flex items-center justify-between px-6 transition-all duration-300 ml-0 lg:ml-0">
            {/* Spacer for sidebar */}
            <div className="w-72 hidden lg:block opacity-0 pointer-events-none" />

            {/* Center - Search/Context */}
            <div className="flex-1 max-w-2xl mx-auto flex items-center gap-4">
                <div className="relative w-full max-w-md hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search questions, papers, or outcomes..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-3">
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>

                <div className="h-6 w-px bg-slate-200 mx-1" />

                <button
                    onClick={toggleRightPanel}
                    className={`p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium
            ${rightPanelOpen
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-slate-500 hover:bg-slate-100'
                        }`}
                >
                    <HelpCircle size={20} />
                    <span className="hidden sm:inline">AI Help</span>
                </button>
            </div>
        </header>
    );
};

export default TopBar;
