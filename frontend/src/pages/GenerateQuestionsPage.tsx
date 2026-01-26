import { useState, useEffect } from "react";
import FinalizePaperModal from "../components/Papers/FinalizePaperModal";

interface Paper {
  id: number;
  title: string;
  total_marks: number;
  syllabus?: string;
  sections?: Array<{ id: number; name: string }>;
}

interface GenerateQuestionsPageProps {
  paperId: number;
  onContinue: () => void;
  onBack: () => void;
}

const GenerateQuestionsPage = ({ paperId, onContinue, onBack }: GenerateQuestionsPageProps) => {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPaper, setLoadingPaper] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string[]>([]);
  const [finalizeOpen, setFinalizeOpen] = useState(false);

  useEffect(() => {
    loadPaper();
  }, [paperId]);

  const loadPaper = async () => {
    try {
      setLoadingPaper(true);
      const response = await fetch(`http://127.0.0.1:8000/papers/${paperId}`);
      if (!response.ok) {
        throw new Error("Failed to load paper details");
      }
      const data = await response.json();
      setPaper({
        id: data.paper_id,
        title: data.title,
        total_marks: data.total_marks,
        syllabus: data.syllabus,
        sections: data.sections || [],
      });
    } catch (err) {
      setError("Failed to load paper details");
    } finally {
      setLoadingPaper(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setProgress([]);

    try {
      const response = await fetch(`http://127.0.0.1:8000/papers/${paperId}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      // Extract progress information
      if (data.progress) {
        const progressMessages = data.progress
          .filter((p: any) => p.status === "started" || p.status === "completed" || p.status === "generated_fallback")
          .map((p: any) => {
            if (p.status === "started") {
              return `Generating ${p.section}...`;
            } else if (p.status === "completed") {
              return `${p.section} completed (${p.questions_generated} questions)`;

            } else if (p.status === "generated_fallback") {
              return `${p.section} completed (with flexible rules)`;
            }
            return "";
          })
          .filter(Boolean);
        setProgress(progressMessages);
      }

      // Check for actual HTTP error (not status field)
      if (!response.ok) {
        throw new Error(
          data.detail || data.error || "Failed to generate questions"
        );
      }

      // Success (even with warnings) - move to review page
      if (data.status === "DRAFT" || data.status === "SUCCESS") {
        onContinue();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  if (loadingPaper) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#6B7280]">Loading paper details...</div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="max-w-2xl">
        <div className="bg-white border border-[#DC2626] rounded-lg p-4">
          <p className="text-[#DC2626]">{error || "Failed to load paper"}</p>
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

  // Proper validation with explicit checks
  const hasValidSyllabus = 
    typeof paper?.syllabus === "string" && 
    paper.syllabus.trim().length >= 10;
  
  const hasSections = 
    Array.isArray(paper?.sections) && 
    paper.sections.length > 0;
  
  const canGenerate = hasValidSyllabus && hasSections && !loading;

  // Finalize guards (structure only; wire real counts/analytics later)
  const coveragePercent = (paper as any)?.analytics?.coverage_percent ?? 0;
  const hasQuestions = false; // TODO: replace with real question count when available
  const syllabusUploaded = !!paper?.syllabus;
  const canFinalize = hasQuestions && syllabusUploaded && coveragePercent > 0;

  const paperSummary = {
    title: paper?.title || "Untitled",
    totalQuestions: 0, // TODO: replace with real question count
    coveragePercent,
    bloomDistribution: (paper as any)?.analytics?.bloom_distribution || {},
  };

  return (
    <>
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-sm text-[#4B5D73] hover:text-[#1E3A5F] mb-3 font-medium"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">
          Generate Questions
        </h1>
        <p className="text-base text-[#6B7280]">
          Questions will be generated based on section structure, syllabus,
          Bloom level, and difficulty constraints.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-sm">
        {/* Info Banner - When generation used flexible rules */}
        {!error && progress.length > 0 && !loading && (
          <div className="mb-4 p-4 bg-white border border-[#1E3A5F] rounded-lg">
            <p className="text-[#1E3A5F] text-sm font-medium mb-1">Generation Complete</p>
            <p className="text-[#4A4A4A] text-sm">
              Some questions were generated using flexible rules to ensure completeness.
              You may review or regenerate individual questions if needed.
            </p>
          </div>
        )}

        {/* Validation Warnings - Only show if conditions not met */}
        {!hasValidSyllabus && (
          <div className="mb-4 p-4 bg-white border border-[#D97706] rounded-lg">
            <p className="text-[#D97706] text-sm font-medium mb-2">
              Syllabus Required
            </p>
            <p className="text-[#4A4A4A] text-sm">
              Please add syllabus/topics (minimum 10 characters) before generating questions. Syllabus ensures questions are aligned with your course content.
            </p>
          </div>
        )}

        {hasValidSyllabus && !hasSections && (
          <div className="mb-4 p-4 bg-white border border-[#D97706] rounded-lg">
            <p className="text-[#D97706] text-sm font-medium mb-2">
              Sections Required
            </p>
            <p className="text-[#4A4A4A] text-sm">
              Please add at least one section to the paper before generating questions.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-white border border-[#D97706] rounded-lg">
            <p className="text-[#D97706] text-sm font-medium mb-2">Generation Note</p>
            <p className="text-[#4A4A4A] text-sm">
              {error}
            </p>
          </div>
        )}

        {/* Progress Messages */}
        {loading && progress.length > 0 && (
          <div className="mb-4 p-4 bg-white border border-[#1E3A5F] rounded-lg">
            <p className="text-[#1E3A5F] text-sm font-medium mb-2 flex items-center">
              <span className="inline-block w-4 h-4 border-2 border-[#1E3A5F] border-t-transparent rounded-full animate-spin mr-2"></span>
              Generating Questions...
            </p>
            <div className="space-y-1">
              {progress.map((msg, idx) => (
                <p key={idx} className="text-[#4A4A4A] text-sm pl-6">
                  {msg}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Progress Message (initial) */}
        {loading && progress.length === 0 && (
          <div className="mb-4 p-4 bg-white border border-[#1E3A5F] rounded-lg">
            <p className="text-[#1E3A5F] text-sm flex items-center">
              <span className="inline-block w-5 h-5 border-2 border-[#1E3A5F] border-t-transparent rounded-full animate-spin mr-2"></span>
              Starting generation... This may take a moment.
            </p>
          </div>
        )}

        {/* Information */}
        <div className="mb-6 p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg">
          <h3 className="text-sm font-medium text-[#1E3A5F] mb-3">Paper Breakdown</h3>
          <div className="space-y-2">
            {paper?.sections && paper.sections.length > 0 ? (
              <>
                {paper.sections.map((section: any) => (
                  <div key={section.id} className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">
                      {section.name}: {section.number_of_questions}Q × {section.marks_per_question}M
                    </span>
                    <span className="font-medium text-[#1A1A1A]">{section.total_marks}M</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#E5E7EB] flex justify-between font-medium">
                  <span className="text-[#1A1A1A]">Total</span>
                  <span className="text-[#1E3A5F]">{paper.total_marks} Marks</span>
                </div>
              </>
            ) : (
              <p className="text-[#6B7280] text-sm">No sections defined yet</p>
            )}
          </div>
        </div>

        {/* What Happens Next */}
        <div className="mb-6 p-4 bg-white border border-[#1E3A5F] rounded-lg">
          <h3 className="text-sm font-medium text-[#1E3A5F] mb-2">Generation Process</h3>
          <ul className="text-sm text-[#4A4A4A] space-y-1 list-disc list-inside">
            <li>Questions are generated section-by-section</li>
            <li>Quality is validated automatically</li>
            <li>Flexible rules ensure no empty sections</li>
            <li>You can review and regenerate individual questions</li>
          </ul>
        </div>

        {/* Debug View (Development) - Remove in production */}
        {import.meta.env.DEV && (
          <details className="mb-4">
            <summary className="text-xs text-[#6B7280] cursor-pointer hover:text-[#1A1A1A]">
              Debug: Generation Requirements
            </summary>
            <pre className="mt-2 text-xs text-[#4A4A4A] bg-[#F8FAFC] p-3 rounded overflow-x-auto">
              {JSON.stringify(
                {
                  syllabus: paper?.syllabus,
                  syllabusLength: paper?.syllabus?.length || 0,
                  syllabusValid: hasValidSyllabus,
                  sectionsCount: paper?.sections?.length || 0,
                  sectionsValid: hasSections,
                  canGenerate: canGenerate,
                },
                null,
                2
              )}
            </pre>
          </details>
        )}

        {/* Generate Button */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onBack}
            disabled={loading}
            className="px-6 py-2.5 border border-[#E5E7EB] text-[#4B5D73] rounded-md hover:bg-[#F8FAFC] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Back
          </button>
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || loading}
            className={`px-8 py-2.5 rounded-md font-medium transition flex items-center gap-2 ${
              canGenerate && !loading
                ? "bg-[#1E3A5F] text-white hover:bg-[#162C46]"
                : "bg-[#E5E7EB] text-[#6B7280] cursor-not-allowed"
            }`}
            title={
              loading
                ? "Generating questions... please wait"
                : !hasValidSyllabus 
                ? "Syllabus is required (minimum 10 characters)" 
                : !hasSections
                ? "At least one section is required"
                : "Click to generate questions"
            }
          >
            {loading && (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "Generating..." : "Generate Questions"}
          </button>
          <button
            onClick={() => setFinalizeOpen(true)}
            disabled={!canFinalize}
            className="px-8 py-2.5 rounded-md font-medium border transition disabled:opacity-50"
          >
            Finalize Question Paper
          </button>
        </div>

        {!canFinalize && (
          <p className="text-sm text-[#6B7280] mt-2">
            Complete question generation before finalizing.
          </p>
        )}
      </div>
    </div>

    <FinalizePaperModal
      isOpen={finalizeOpen}
      paperSummary={paperSummary}
      onConfirm={() => {
        // TODO: call finalize endpoint then navigate to finalized view
        setFinalizeOpen(false);
      }}
      onCancel={() => setFinalizeOpen(false)}
    />
    </>
  );
};

export default GenerateQuestionsPage;
