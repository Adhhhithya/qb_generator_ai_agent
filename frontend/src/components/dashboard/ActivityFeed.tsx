import { ScrollText, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

const ActivityFeed = () => {
    const activities = [
        { id: 1, type: 'audit_pass', text: 'Audit passed for "Data Structures" paper', time: '2 mins ago' },
        { id: 2, type: 'generation', text: 'Generated 5 questions for CO2', time: '1 hour ago' },
        { id: 3, type: 'audit_warn', text: 'Draft "Mid-Term" flagged for Bloom imbalance', time: '3 hours ago' },
        { id: 4, type: 'paper', text: 'Finalized "Operating Systems" paper', time: 'Yesterday' },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'audit_pass': return <CheckCircle2 size={16} className="text-green-500" />;
            case 'audit_warn': return <AlertTriangle size={16} className="text-amber-500" />;
            case 'paper': return <FileText size={16} className="text-soft-blue-500" />;
            default: return <ScrollText size={16} className="text-soft-purple-500" />;
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center justify-between">
                <span>Activity Feed</span>
                <span className="text-xs font-normal text-slate-400 cursor-pointer hover:text-soft-blue-600">View All</span>
            </h3>

            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <div key={activity.id} className="flex gap-3 relative">
                        {/* Connecting Line */}
                        {index !== activities.length - 1 && (
                            <div className="absolute left-[9px] top-6 bottom-[-16px] w-[1px] bg-slate-100" />
                        )}

                        <div className="mt-1 flex-shrink-0 z-10 bg-white">
                            {getIcon(activity.type)}
                        </div>
                        <div>
                            <p className="text-sm text-slate-700 font-medium leading-tight mb-1">{activity.text}</p>
                            <p className="text-xs text-slate-400">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;
