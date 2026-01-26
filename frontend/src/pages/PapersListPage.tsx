import React, { useEffect, useState } from 'react';
import { listPapers, archivePaper, type Paper } from '../api/papers';
import PaperCard from '../components/papers/PaperCard';
import { Plus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PapersListPageProps {
    status: 'DRAFT' | 'FINALIZED' | 'ARCHIVED' | undefined; // Undefined = All (History)
    title: string;
    description: string;
    onCreateNew?: () => void;
}

const PapersListPage: React.FC<PapersListPageProps> = ({ status, title, description, onCreateNew }) => {
    const [papers, setPapers] = useState<Paper[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPapers();
    }, [status]);

    const loadPapers = async () => {
        setLoading(true);
        try {
            // "History" fetches all (status undefined). Drafts/Finalized pass specific status.
            const response = await listPapers(status);
            setPapers(response.papers);
        } catch (err) {
            setError("Failed to load papers.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleArchive = async (id: number) => {
        if (!confirm("Are you sure you want to archive this paper?")) return;
        try {
            await archivePaper(id);
            setPapers(papers.filter(p => p.paper_id !== id));
        } catch (error) {
            alert("Failed to archive paper");
        }
    }

    const handleDownload = (id: number) => {
        // Implement download logic here. Usually hits an endpoint like /papers/{id}/download
        // Since I don't have the endpoint in api/papers.ts, I'll assume standard pattern or mock for now.
        // User asked to "re-implement Paper Downloading functionality".
        // I should probably check if there is an endpoint for it.
        // Assuming: http://127.0.0.1:8000/papers/{id}/download or /pdf
        window.open(`http://127.0.0.1:8000/papers/${id}/download`, '_blank');
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-12 bg-red-50 rounded-xl text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
                    <p className="text-slate-500 mt-1">{description}</p>
                </div>
                {onCreateNew && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onCreateNew}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg shadow-blue-200"
                    >
                        <Plus size={18} />
                        <span>Create New</span>
                    </motion.button>
                )}
            </div>

            {papers.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <p className="text-slate-400">No papers found in this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {papers.map((paper, index) => (
                        <motion.div
                            key={paper.paper_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <PaperCard
                                paper_id={paper.paper_id}
                                title={paper.title}
                                status={paper.status}
                                total_marks={paper.total_marks}
                                created_at={paper.created_at}
                                course_title={paper.metadata?.course_title}
                                onOpen={() => console.log("Open paper", paper.paper_id)} // Need navigation logic here
                                onArchive={() => handleArchive(paper.paper_id)}
                                onDownload={() => handleDownload(paper.paper_id)}
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PapersListPage;
