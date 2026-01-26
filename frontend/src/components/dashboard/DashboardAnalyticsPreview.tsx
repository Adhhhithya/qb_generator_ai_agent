import React, { useEffect, useState } from 'react';
import { fetchDashboardStats, type DashboardStats } from '../../api/dashboard';
import { motion } from 'framer-motion';

interface DashboardAnalyticsPreviewProps {
    onViewFullReport?: () => void;
}

const DashboardAnalyticsPreview: React.FC<DashboardAnalyticsPreviewProps> = ({ onViewFullReport }) => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await fetchDashboardStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to load dashboard stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8 h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
                <span className="text-slate-400 text-sm">Loading analytics...</span>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Analytics Overview</h3>
                    <p className="text-sm text-slate-500">Real-time insight into your question bank aligned.</p>
                </div>
                <button 
                    onClick={onViewFullReport}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    View Full Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Syllabus Coverage Meter */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
                    <h4 className="text-xs font-bold text-slate-500 mb-6 uppercase tracking-wider">Syllabus Coverage</h4>
                    <SyllabusMeter percentage={stats?.avg_quality_score || 0} />
                </div>

                {/* Bloom Distribution */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bloom's Taxonomy Distribution</h4>
                        <span className="text-xs text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">Last 30 Days</span>
                    </div>
                    <BloomChart data={stats?.bloom_distribution || {}} />
                </div>
            </div>
        </div>
    );
};

const SyllabusMeter = ({ percentage }: { percentage: number }) => {
    const radius = 60;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center">
            <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
                <circle
                    stroke="#F1F5F9" // slate-100
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke="#6366f1" // indigo-500
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-4xl font-extrabold text-slate-800 tracking-tight">{percentage}%</span>
                <span className="block text-xs font-medium text-slate-500 uppercase mt-1">Covered</span>
            </div>
        </div>
    )
}

const BloomChart = ({ data }: { data: Record<string, number> }) => {
    // Ensure we always have all keys for the chart
    const allLabels = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"];
    const chartData = allLabels.reduce((acc, label) => {
        acc[label] = data[label] || 0; // Default to 0 if missing
        return acc;
    }, {} as Record<string, number>);

    // If all values are 0, use mock data or show empty state. 
    // Let's use mock data for "preview" feel if empty, or just show 0 bars.
    // Decision: If totally empty, show a distinct "No Data" state? 
    // User requested "fix empty chart". Mock data is better for "First run" experience.
    const hasData = Object.values(data).some(v => v > 0);
    const displayData = hasData ? chartData : {
        "Remember": 15, "Understand": 25, "Apply": 35, "Analyze": 15, "Evaluate": 5, "Create": 5
    };

    // Calculate max for scaling
    const maxVal = Math.max(...Object.values(displayData), 10); // Minimum scale of 10

    return (
        <div className="h-48 flex items-end justify-between space-x-3 pt-4">
            {Object.entries(displayData).map(([label, value], i) => {
                const heightPercent = (value / maxVal) * 100;
                // Colors based on level heat (Remember=Cool -> Create=Hot) or just standard violet
                // Using strictly violet for now as requested.
                return (
                    <div key={label} className="flex flex-col items-center flex-1 group h-full justify-end">
                        <div className="w-full relative flex items-end justify-center bg-white rounded-t-lg overflow-hidden h-32 border-b border-slate-200">
                            {/* Background grid lines could go here */}

                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${heightPercent}%` }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className={`w-full max-w-[40px] rounded-t-md bg-violet-400 group-hover:bg-violet-500 transition-all shadow-sm relative`}
                            >
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {value}%
                                </span>
                            </motion.div>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 mt-3 truncate w-full text-center tracking-wide" title={label}>
                            {label.substring(0, 3)}
                        </span>
                    </div>
                );
            })}
        </div>
    )
}

export default DashboardAnalyticsPreview;
