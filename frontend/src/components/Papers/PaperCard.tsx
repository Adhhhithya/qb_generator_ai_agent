import { FileText, Download, Trash2, ArrowRight, Check } from 'lucide-react'

interface PaperCardProps {
    paper_id: number;
    title: string;
    status: string;
    total_marks: number;
    created_at?: string;
    course_title?: string;
    onOpen: () => void;
    onFinalize?: () => void;
    onArchive?: () => void;
    onDownload?: () => void;
}

const PaperCard = ({
    title,
    status,
    total_marks,
    created_at,
    course_title,
    onOpen,
    onFinalize,
    onArchive,
    onDownload
}: PaperCardProps) => {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 relative flex flex-col h-full group">
            <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                    <div className={`p-2 rounded-lg ${status === 'DRAFT' ? 'bg-amber-50 text-amber-600' :
                        status === 'FINALIZED' ? 'bg-emerald-50 text-emerald-600' :
                            'bg-blue-50 text-blue-600'
                        }`}>
                        <FileText size={20} />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === "DRAFT" ? "bg-amber-100 text-amber-700" :
                        status === "FINALIZED" ? "bg-emerald-100 text-emerald-700" :
                            "bg-blue-100 text-blue-700"
                        }`}>
                        {status}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors" title={title}>
                    {title || "Untitled Paper"}
                </h3>

                <div className="flex items-center flex-wrap gap-y-2 text-sm text-slate-500 mb-6">
                    <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-600">{total_marks} marks</span>
                    {course_title && (
                        <>
                            <span className="mx-2 text-slate-300">•</span>
                            <span className="truncate max-w-[150px]" title={course_title}>{course_title}</span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                <span className="text-xs text-slate-400 font-medium">
                    {created_at ? new Date(created_at).toLocaleDateString() : 'Unknown Date'}
                </span>

                <div className="flex space-x-2">
                    {onDownload && status === 'FINALIZED' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDownload(); }}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Download PDF"
                        >
                            <Download size={18} />
                        </button>
                    )}

                    {onArchive && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onArchive(); }}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Archive"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}

                    <button
                        onClick={onOpen}
                        className={`flex items-center gap-1 px-4 py-2 text-sm rounded-lg transition-all font-semibold shadow-sm ${status === 'DRAFT'
                            ? 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-blue-200'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
                            }`}
                    >
                        {status === 'DRAFT' ? 'Continue' : 'View'} <ArrowRight size={16} />
                    </button>

                    {onFinalize && status === 'DRAFT' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onFinalize(); }}
                            className="flex items-center gap-1 px-3 py-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors text-sm font-medium"
                        >
                            <Check size={16} /> Finalize
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaperCard;
