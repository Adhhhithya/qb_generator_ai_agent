interface ContextBannerProps {
    totalPapers: number;
    draftCount: number;
    finalizedCount: number;
    onAction: (action: string) => void;
}

const ContextBanner = ({ totalPapers, draftCount, finalizedCount, onAction }: ContextBannerProps) => {
    // Case A: No papers exist (First-time user)
    if (totalPapers === 0) {
        return (
            <div className="bg-[#4A6FA5] bg-opacity-10 border border-[#4A6FA5] border-opacity-20 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                <div className="mb-4 md:mb-0">
                    <h2 className="text-lg font-semibold text-[#1F2933] mb-1">
                        No question papers have been created yet.
                    </h2>
                    <p className="text-[#6B7280]">
                        Start by uploading a syllabus and generating your first question paper.
                    </p>
                </div>
                <button
                    onClick={() => onAction('createPaper')}
                    className="px-4 py-2 bg-[#4A6FA5] text-white font-medium rounded-md hover:bg-[#3D5A8A] transition-colors whitespace-nowrap"
                >
                    Create Question Paper
                </button>
            </div>
        );
    }

    // Case B: Drafts exist but no finalized papers
    if (draftCount > 0 && finalizedCount === 0) {
        return (
            <div className="bg-[#E9A15B] bg-opacity-10 border border-[#E9A15B] border-opacity-20 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                <div className="mb-4 md:mb-0">
                    <h2 className="text-lg font-semibold text-[#1F2933] mb-1">
                        You have question papers in draft state.
                    </h2>
                    <p className="text-[#6B7280]">
                        Review and finalize them once you are satisfied with the content.
                    </p>
                </div>
                <button
                    onClick={() => onAction('drafts')}
                    className="px-4 py-2 bg-[#E9A15B] text-white font-medium rounded-md hover:bg-[#D48F4D] transition-colors whitespace-nowrap"
                >
                    View Drafts
                </button>
            </div>
        );
    }

    // Case C: Finalized papers exist (Case C condition: finalizedCount > 0)
    // Return null (Do NOT show banner)
    return null;
};

export default ContextBanner;
