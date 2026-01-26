
import { PlusCircle, FileText, CheckCircle2 } from 'lucide-react';

interface QuickActionsProps {
    onAction: (action: string) => void;
}

const QuickActions = ({ onAction }: QuickActionsProps) => {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-5">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <ActionCard
                    title="Create New Question Paper"
                    icon={PlusCircle}
                    color="blue"
                    onClick={() => onAction('createPaper')}
                    delay={0}
                />
                <ActionCard
                    title="View Drafts"
                    icon={FileText}
                    color="amber"
                    onClick={() => onAction('drafts')}
                    delay={0.1}
                />
                <ActionCard
                    title="Finalized Papers"
                    icon={CheckCircle2}
                    color="emerald"
                    onClick={() => onAction('finalized')}
                    delay={0.2}
                />
            </div>
        </div>
    );
};

interface ActionCardProps {
    title: string;
    icon: any;
    color: 'blue' | 'amber' | 'emerald';
    onClick: () => void;
    delay: number;
}

const ActionCard = ({ title, icon: Icon, color, onClick }: ActionCardProps) => {
    const colorStyles = {
        blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white border-blue-100',
        amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white border-amber-100',
        emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white border-emerald-100'
    };

    const ringColors = {
        blue: 'group-hover:ring-blue-200',
        amber: 'group-hover:ring-amber-200',
        emerald: 'group-hover:ring-emerald-200',
    }

    return (
        <button
            onClick={onClick}
            className={`
                group relative flex flex-col items-center justify-center p-6 
                bg-white border border-slate-200 rounded-xl shadow-sm 
                hover:shadow-lg hover:-translate-y-1 transition-all duration-300
                min-h-[160px] w-full text-center ${ringColors[color]} hover:ring-2 hover:border-transparent
            `}
        >
            <div className={`mb-4 p-4 rounded-full transition-all duration-300 ${colorStyles[color]} shadow-sm`}>
                <Icon size={28} strokeWidth={2} />
            </div>
            <span className="font-semibold text-slate-700 group-hover:text-slate-900 transition-colors text-lg leading-tight">
                {title}
            </span>
        </button>
    );
};

export default QuickActions;
