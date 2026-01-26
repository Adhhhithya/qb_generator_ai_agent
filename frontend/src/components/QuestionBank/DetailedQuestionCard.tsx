import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Edit2, RefreshCw, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface QuestionProps {
    id: number;
    text: string;
    bloom: string;
    difficulty: string;
    code: string;
    marks?: number;
    audit?: {
        status: 'pass' | 'warn' | 'fail';
        reason: string;
        suggestions: string[];
    };
}

interface DetailedQuestionCardProps {
    question: QuestionProps;
    onEdit?: (id: number) => void;
    onRegenerate?: (id: number) => void;
    onDelete?: (id: number) => void;
}

const DetailedQuestionCard = ({ question, onEdit, onRegenerate, onDelete }: DetailedQuestionCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Determine status color using standard palette
    const statusColor = question.audit?.status === 'pass' ? 'text-emerald-600 bg-emerald-50'
        : question.audit?.status === 'warn' ? 'text-amber-600 bg-amber-50'
            : 'text-red-600 bg-red-50';

    const StatusIcon = question.audit?.status === 'pass' ? CheckCircle2
        : question.audit?.status === 'warn' ? AlertTriangle
            : AlertTriangle;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300"
        >
            {/* Header / Main View */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-xs font-semibold text-slate-600 uppercase tracking-wide">{question.code}</span>
                        <span className="px-2.5 py-1 rounded-md bg-purple-50 text-xs font-semibold text-purple-600">{question.bloom}</span>
                        <span className="px-2.5 py-1 rounded-md bg-blue-50 text-xs font-semibold text-blue-600">{question.difficulty}</span>
                        {question.marks && <span className="px-2.5 py-1 rounded-md bg-slate-100 text-xs font-semibold text-slate-600">{question.marks} Marks</span>}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            onClick={() => onEdit?.(question.id)}
                            className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Edit Question"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            onClick={() => onRegenerate?.(question.id)}
                            className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                            title="Regenerate"
                        >
                            <RefreshCw size={16} />
                        </button>
                        <button
                            onClick={() => onDelete?.(question.id)}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Remove from Bank"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                <h3 className="text-slate-800 text-lg font-medium leading-relaxed mb-4 font-sans">
                    {question.text}
                </h3>

                {/* Audit Context Peek */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className={`flex items-center gap-2 text-sm font-medium ${statusColor} px-3 py-1.5 rounded-full transition-colors`}>
                        <StatusIcon size={16} />
                        <span className="uppercase tracking-wide text-xs">{question.audit?.status || 'Verified'}</span>
                    </div>

                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors"
                    >
                        {isExpanded ? 'Hide Analysis' : 'Show Analysis'}
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {/* Expanded Analysis */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-slate-50 border-t border-slate-100 px-5"
                    >
                        <div className="py-5">
                            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                <Sparkles size={16} className="text-purple-500" /> AI Alignment Audit
                            </h4>

                            <div className="space-y-3">
                                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                    <p className="text-sm text-slate-600">
                                        <span className="font-medium text-slate-900">Bloom's Match:</span> The question uses action verbs consistent with <span className="text-purple-600 font-medium">{question.bloom}</span> level analysis.
                                    </p>
                                </div>

                                {question.audit?.suggestions?.map((suggestion, idx) => (
                                    <div key={idx} className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex gap-3">
                                        <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-amber-800">{suggestion}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DetailedQuestionCard;
