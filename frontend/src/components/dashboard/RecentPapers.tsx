interface RecentPaper {
    id: number;
    title: string;
    status: string;
    total_marks: number;
    updated_at?: string; // or created_at
}

interface RecentPapersProps {
    papers: RecentPaper[];
    onOpen: (paperId: number) => void;
}

const RecentPapers = ({ papers, onOpen }: RecentPapersProps) => {
    if (!papers || papers.length === 0) return null;

    return (
        <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Activity</h2>
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Paper Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Marks</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {papers.map((paper) => (
                            <tr key={paper.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-slate-800">{paper.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${paper.status === 'DRAFT' ? 'bg-amber-100 text-amber-800' :
                                            paper.status === 'FINALIZED' ? 'bg-emerald-100 text-emerald-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                        {paper.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {paper.total_marks}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => onOpen(paper.id)}
                                        className="text-blue-600 hover:text-blue-700 font-semibold"
                                    >
                                        Open
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentPapers;
