import { motion } from 'framer-motion'
import { FileText, CheckCircle, BarChart } from 'lucide-react'

interface DashboardStatsProps {
    totalDrafts: number;
    totalFinalized: number;
    averageCoverage?: number;
}

const StatCard = ({
    title,
    value,
    subtitle,
    delay = 0,
    type,
    icon: Icon,
}: {
    title: string
    value: string | number
    subtitle?: string
    delay?: number
    type: 'orange' | 'green' | 'blue' | 'purple'
    icon: any
}) => {
    const styles = {
        orange: {
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-700',
            iconBg: 'bg-white',
            iconColor: 'text-amber-600',
            gradient: 'from-amber-400 to-amber-600'
        },
        green: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            text: 'text-emerald-700',
            iconBg: 'bg-white',
            iconColor: 'text-emerald-600',
            gradient: 'from-emerald-400 to-emerald-600'
        },
        blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-700',
            iconBg: 'bg-white',
            iconColor: 'text-blue-600',
            gradient: 'from-blue-400 to-blue-600'
        },
        purple: {
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            text: 'text-purple-700',
            iconBg: 'bg-white',
            iconColor: 'text-purple-600',
            gradient: 'from-purple-400 to-purple-600'
        }
    }

    const style = styles[type]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`${style.bg} p-6 rounded-2xl border ${style.border} shadow-sm relative overflow-hidden cursor-pointer group`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`${style.iconBg} p-3 rounded-xl shadow-sm`}>
                    <Icon className={`w-6 h-6 ${style.iconColor}`} />
                </div>
                <div className={`text-xs font-semibold px-2 py-1 rounded-full bg-white/50 ${style.text}`}>
                    +12% this week
                </div>
            </div>

            <div className="relative z-10">
                <p className={`text-sm font-medium ${style.text} opacity-80 mb-1`}>{title}</p>
                <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: delay + 0.2, type: 'spring', stiffness: 100 }}
                >
                    <p className="text-4xl font-bold text-slate-800">{value}</p>
                </motion.div>
                {subtitle && (
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-[80%]">{subtitle}</p>
                )}
            </div>

            {/* Decorative Gradient Blob */}
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br ${style.gradient} rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500`} />
        </motion.div>
    )
}

const DashboardStats = ({ totalDrafts, totalFinalized, averageCoverage }: DashboardStatsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
                title="Draft Papers"
                value={totalDrafts}
                delay={0}
                type="orange"
                icon={FileText}
                subtitle="In-progress question papers waiting for review."
            />

            <StatCard
                title="Finalized Papers"
                value={totalFinalized}
                delay={0.1}
                type="green"
                icon={CheckCircle}
                subtitle="Completed papers ready for export."
            />

            <StatCard
                title="Syllabus Coverage"
                value={`${averageCoverage || 0}%`}
                delay={0.2}
                type="blue"
                icon={BarChart}
                subtitle="Average coverage across all generated papers."
            />
        </div>
    );
};

export default DashboardStats;
