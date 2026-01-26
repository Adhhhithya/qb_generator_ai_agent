import { useEffect, useState } from "react";
import {
  fetchPaper,
  regenerateQuestion,
  getQuestionAlternatives,
  replaceQuestion,
  finalizePaper,
} from "../api/papers";
import type { Paper } from "../api/papers";
import QuestionRow from "../components/Papers/QuestionRow";
import ReplaceModal from "../components/Papers/ReplaceModal";

interface PaperReviewPageProps {
  paperId: number;
  onBack: () => void;
  onPreview: () => void;
  onNavigateToGenerate?: () => void;
}

const PaperReviewPage = ({ paperId, onBack, onPreview, onNavigateToGenerate }: PaperReviewPageProps) => {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [finalizing, setFinalizing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [replaceModal, setReplaceModal] = useState<{
    questionId: number;
    alternatives: Array<{ id: number; text: string; quality_score?: number }>;
  } | null>(null);

  useEffect(() => {
    loadPaper(paperId);
  }, [paperId]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const loadPaper = async (id: number) => {
    try {
      setLoading(true);
      const data = await fetchPaper(id);
      setPaper(data);
    } catch (err) {
      setError("Failed to load paper");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async (questionId: number) => {
    try {
      const result = await regenerateQuestion(paperId, questionId);

      if (result.error) {
        showToast(result.error, "error");
        return;
      }

      if (result.success) {
        // Reload the paper to show updated question
        await loadPaper(paperId);
        showToast("Question regenerated successfully!", "success");
      }
    } catch (err) {
      showToast("No better alternative found under constraints.", "error");
    }
  };

  const handleReplace = async (questionId: number) => {
    try {
      const result = await getQuestionAlternatives(paperId, questionId);

      if (result.error) {
        showToast(result.error, "error");
        return;
      }

      if (!result.alternatives || result.alternatives.length === 0) {
        showToast("No suitable alternatives available.", "error");
        return;
      }

      // Show modal with alternatives
      setReplaceModal({
        questionId,
        alternatives: result.alternatives,
      });
    } catch (err) {
      showToast("Failed to fetch alternatives", "error");
    }
  };

  const handleReplaceConfirm = async (replacementId: number) => {
    if (!replaceModal) return;

    try {
      const result = await replaceQuestion(
        paperId,
        replaceModal.questionId,
        replacementId
      );

      if (result.error) {
        showToast(result.error, "error");
        return;
      }

      if (result.success) {
        setReplaceModal(null);
        await loadPaper(paperId);
        showToast("Question replaced successfully!", "success");
      }
    } catch (err) {
      showToast("Failed to replace question", "error");
    }
  };

  const handleReplaceCancel = () => {
    setReplaceModal(null);
  };

  const handleFinalize = async () => {
    if (!paper) return;

    const confirmed = confirm(
      "Are you sure you want to finalize this paper? You won't be able to edit it afterwards."
    );

    if (!confirmed) return;

    try {
      setFinalizing(true);
      await finalizePaper(paperId);
      alert("Paper finalized successfully!");
      onBack();
    } catch (err) {
      alert("Failed to finalize paper");
    } finally {
      setFinalizing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#6B7280]">Loading paper...</div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border border-[#DC2626] rounded-lg p-4">
          <p className="text-[#DC2626]">{error || "Paper not found"}</p>
          <button
            onClick={onBack}
            className="mt-2 text-[#1E3A5F] hover:underline text-sm"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // Guard: Check if questions have been generated
  const totalQuestions = paper.sections?.reduce((sum, s) => sum + (s.questions?.length || 0), 0) || 0;
  
  if (totalQuestions === 0) {
    return (
      <div className="max-w-2xl">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-[#4B5D73] hover:text-[#1E3A5F] text-sm mb-4 font-medium"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">
            Review Questions
          </h1>
        </div>
        <div className="bg-white border border-[#1E3A5F] rounded-lg p-6">
          <p className="text-[#1E3A5F] mb-4">
            Questions have not been generated yet.
          </p>
          <button
            onClick={onNavigateToGenerate}
            className="px-6 py-2.5 bg-[#1E3A5F] text-white rounded-md hover:bg-[#162C46] transition font-medium"
          >
            Generate Questions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-[#4B5D73] hover:text-[#1E3A5F] text-sm mb-4 font-medium"
        >
          ← Back to papers
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1E3A5F]">
              {paper.title || "Untitled Paper"}
            </h1>
            <p className="text-sm text-[#6B7280] mt-2">
              Total Marks: {paper.total_marks} | Status:{" "}
              <span
                className={`font-medium ${
                  paper.status === "FINALIZED"
                    ? "text-[#059669]"
                    : "text-[#D97706]"
                }`}
              >
                {paper.status}
              </span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onPreview}
              className="px-6 py-2.5 bg-[#4B5D73] text-white rounded-md hover:bg-[#3A4A5C] font-medium transition"
            >
              Preview Printable Paper
            </button>
            {paper.status === "DRAFT" && (
              <button
                onClick={handleFinalize}
                disabled={finalizing}
                className="px-6 py-2.5 bg-[#1E3A5F] text-white rounded-md hover:bg-[#162C46] disabled:opacity-50 font-medium transition"
              >
                {finalizing ? "Finalizing..." : "Finalize Paper"}
              </button>
            )}
          </div>
        </div>
      </div>

      {paper.bloom_policy && (
        <div className="mb-6 bg-white border border-[#1E3A5F] rounded-lg p-5 shadow-sm">
          <h3 className="text-base font-semibold text-[#1E3A5F] mb-3">
            Bloom Taxonomy Policy
          </h3>
          <div className="text-sm text-[#1A1A1A] space-y-1">
            {Object.entries(paper.bloom_policy)
              .filter(([key]) => key !== "rationale")
              .map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium">{key}:</span> {value}
                </div>
              ))}
            <p className="text-xs text-[#6B7280] mt-2 italic">
              {paper.bloom_policy.rationale}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {paper.sections.map((section, idx) => {
          // Calculate section quality average
          const qualityScores = section.questions
            .map((q) => q.quality_score)
            .filter((s): s is number => s != null);
          const avgQuality =
            qualityScores.length > 0
              ? Math.round(
                  qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length
                )
              : null;

          let qualityLabel = "";
          let qualityColor = "";
          if (avgQuality !== null) {
            if (avgQuality >= 90) {
              qualityLabel = "Excellent";
              qualityColor = "text-[#059669]";
            } else if (avgQuality >= 75) {
              qualityLabel = "Good";
              qualityColor = "text-[#1E3A5F]";
            } else if (avgQuality >= 60) {
              qualityLabel = "Fair";
              qualityColor = "text-[#D97706]";
            } else {
              qualityLabel = "Needs Review";
              qualityColor = "text-[#DC2626]";
            }
          }

          return (
            <div key={idx} className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm">
              <div className="bg-[#F8FAFC] px-5 py-4 border-b border-[#E5E7EB]">
                <h3 className="text-lg font-semibold text-[#1E3A5F]">
                  {section.section}
                </h3>
                <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                  <span>
                    {section.marks_per_question} marks per question •{" "}
                    {section.questions.length} questions
                  </span>
                  {avgQuality !== null && (
                    <span className={`font-medium ${qualityColor}`}>
                      Avg Quality: {avgQuality} ({qualityLabel})
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                {section.questions.map((question) => (
                  <QuestionRow
                    key={question.question_id}
                    question={question}
                    onRegenerate={handleRegenerate}
                    onReplace={handleReplace}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Replace Modal */}
      {replaceModal && (
        <ReplaceModal
          alternatives={replaceModal.alternatives}
          onConfirm={handleReplaceConfirm}
          onCancel={handleReplaceCancel}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div
            className={`px-5 py-3 rounded-lg shadow-lg ${
              toast.type === "success"
                ? "bg-[#059669] text-white"
                : "bg-[#DC2626] text-white"
            }`}
          >
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperReviewPage;
