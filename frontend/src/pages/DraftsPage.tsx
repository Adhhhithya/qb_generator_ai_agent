import { useState, useEffect } from "react";
import FinalizePaperModal from "../components/Papers/FinalizePaperModal";

interface DraftPaper {
  paper_id: number;
  title: string;
  total_marks: number;
  status: string;
  created_at: string;
  progress?: {
    sections_completed: number;
    total_sections: number;
  };
}

const DraftsPage = () => {
  const [drafts, setDrafts] = useState<DraftPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [finalizeOpen, setFinalizeOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<DraftPaper | null>(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/papers?status=DRAFT");
      const data = await response.json();
      setDrafts(data.papers || []);
    } catch (error) {
      console.error("Failed to fetch drafts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-[#6B7280]">Loading drafts...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#4A6FA5] mb-2">
          Draft Papers
        </h1>
        <p className="text-base text-[#6B7280]">
          Continue working on in-progress question papers
        </p>
      </div>

      {drafts.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-12 text-center">
          <p className="text-[#6B7280] mb-4">No draft papers found</p>
          <a
            href="/create"
            className="inline-block px-6 py-3 bg-[#4A6FA5] text-white rounded-md hover:bg-[#3D5A8A] transition font-medium"
          >
            Create New Paper
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {drafts.map((draft) => (
            <div
              key={draft.paper_id}
              className="bg-white border border-[#E2E8F0] rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-[#1F2933] mb-2">
                {draft.title || "Untitled Paper"}
              </h3>
              
              <div className="flex items-center space-x-4 text-sm text-[#6B7280] mb-4">
                <span>{draft.total_marks} marks</span>
                <span>•</span>
                <span className="text-[#E9A15B]">Draft</span>
              </div>

              {draft.progress && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-[#6B7280]">Progress</span>
                    <span className="font-medium text-[#4A6FA5]">
                      {draft.progress.sections_completed}/{draft.progress.total_sections} sections
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F5F6F8] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4A6FA5] rounded-full transition-all"
                      style={{
                        width: `${(draft.progress.sections_completed / draft.progress.total_sections) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-[#6B7280]">
                  Created {new Date(draft.created_at).toLocaleDateString()}
                </span>
                <button className="px-4 py-2 bg-[#4A6FA5] text-white text-sm rounded-md hover:bg-[#3D5A8A] transition font-medium">
                  Continue
                </button>
              </div>

                              <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-[#6B7280]">
                                  Complete question generation before finalizing.
                                </div>
                                <button
                                  onClick={() => {
                                    setSelectedDraft(draft);
                                    setFinalizeOpen(true);
                                  }}
                                  disabled={true}
                                  className="px-4 py-2 border rounded text-sm font-medium disabled:opacity-50"
                                >
                                  Finalize Question Paper
                                </button>
                              </div>
            </div>
          ))}
        </div>
      )}

                      <FinalizePaperModal
                        isOpen={finalizeOpen}
                        paperSummary={{
                          title: selectedDraft?.title || "Untitled",
                          totalQuestions: 0,
                          coveragePercent: 0,
                          bloomDistribution: {},
                        }}
                        onConfirm={() => {
                          // TODO: wire finalize endpoint and navigation to finalized view
                          setFinalizeOpen(false);
                        }}
                        onCancel={() => setFinalizeOpen(false)}
                      />
    </div>
  );
};

export default DraftsPage;
