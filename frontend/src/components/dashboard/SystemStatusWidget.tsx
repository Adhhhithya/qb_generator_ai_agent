import { Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const SystemStatusWidget = () => {
    // Mock status for now - in real app, fetch from health check endpoint
    // const [status, setStatus] = useState<'online' | 'degraded' | 'offline'>('online');

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-3 text-sm font-medium"
        >
            <div className="flex items-center gap-2">
                <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 blur-sm opacity-50" />
                </div>
                <span className="text-slate-700">Systems Normal</span>
            </div>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-2 text-slate-500">
                <Cpu size={14} />
                <span>LLM Ready</span>
            </div>
        </motion.div>
    );
};

export default SystemStatusWidget;
