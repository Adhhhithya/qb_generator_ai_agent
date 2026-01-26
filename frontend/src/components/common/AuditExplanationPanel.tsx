import { Check, Info, ShieldCheck } from 'lucide-react';

const AuditExplanationPanel = () => {
    return (
        <div className="p-4 space-y-6">
            <div className="bg-gradient-to-br from-soft-blue-50 to-white p-4 rounded-xl border border-soft-blue-100">
                <h4 className="font-semibold text-soft-blue-800 mb-2 flex items-center gap-2">
                    <ShieldCheck size={18} /> Audit Criteria
                </h4>
                <p className="text-sm text-soft-blue-700 mb-4">
                    Every generated question undergoes a strict 3-point check:
                </p>
                <ul className="space-y-3">
                    <li className="flex gap-2 text-sm text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                            <Check size={12} />
                        </div>
                        <span><strong>Outcome Alignment:</strong> Matches the specific CO code provided.</span>
                    </li>
                    <li className="flex gap-2 text-sm text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                            <Check size={12} />
                        </div>
                        <span><strong>Bloom's Taxonomy:</strong> Uses appropriate verbs for the target cognitive level.</span>
                    </li>
                    <li className="flex gap-2 text-sm text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                            <Check size={12} />
                        </div>
                        <span><strong>Topic Relevance:</strong> Strictly adheres to the syllabus topic.</span>
                    </li>
                </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                    <Info size={16} className="text-slate-400" /> improve your results
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                    If questions are flagged, try providing more specific keywords or adjust the difficulty slider. The AI learns from your edits to improve future generations.
                </p>
            </div>
        </div>
    );
};

export default AuditExplanationPanel;
