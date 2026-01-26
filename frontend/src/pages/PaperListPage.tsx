import { useState, useEffect } from "react";
import type { Paper } from "../api/papers";
import { listPapers, archivePaper } from "../api/papers";
import PageHeader from "../components/layout/PageHeader";
import PaperCard from "../components/Papers/PaperCard"; // Fixed Import Casing

interface PaperListPageProps {
    status: "DRAFT" | "FINALIZED" | "ARCHIVED";
    onContinue: (paperId: number) => void;
    onReview: (paperId: number) => void;
}

const PaperListPage = ({ status, onContinue, onReview }: PaperListPageProps) => {
    const [papers, setPapers] = useState<Paper[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPapers();
    }, [status]);

    const fetchPapers = async () => {
        setLoading(true);
        try {
            const data = await listPapers(status);
            setPapers(data.papers || []);
        } catch (error) {
            console.error(`Failed to fetch ${status} papers:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleArchive = async (paperId: number) => {
        if (!window.confirm("Are you sure you want to archive this paper? It will move to History.")) return;
        try {
            await archivePaper(paperId);
            fetchPapers(); // Refresh list
        } catch (error) {
            console.error("Failed to archive paper:", error);
        }
    };

    const getPageTitle = () => {
        switch (status) {
            case "DRAFT": return "Draft Papers";
            case "FINALIZED": return "Finalized Papers";
            case "ARCHIVED": return "Paper History";
            default: return "Papers";
        }
    };

    const getPageDescription = () => {
        switch (status) {
            case "DRAFT": return "Continue working on in-progress question papers";
            case "FINALIZED": return "View and export your completed papers";
            case "ARCHIVED": return "Access your past papers and generation history";
            default: return "";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-[#6B7280]">Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title={getPageTitle()}
                description={getPageDescription()}
            />

            {papers.length === 0 ? (
                <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
                    <p className="text-[#6B7280] mb-4">No {status.toLowerCase()} papers found</p>
                    {status === "DRAFT" && (
                        <p className="text-sm text-neutral-400">
                            Use "Generate QP" to create a new one.
                        </p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {papers.map((paper) => (
                        <PaperCard
                            key={paper.paper_id}
                            paper_id={paper.paper_id}
                            title={paper.title}
                            status={paper.status}
                            total_marks={paper.total_marks}
                            created_at={paper.created_at}
                            course_title={paper.metadata?.course_title}
                            onOpen={() => status === 'DRAFT' ? onContinue(paper.paper_id) : onReview(paper.paper_id)}
                            onFinalize={status === 'DRAFT' ? undefined : undefined} // Logic for finalize inside card if needed
                            onArchive={status === 'FINALIZED' ? () => handleArchive(paper.paper_id) : undefined}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaperListPage;
