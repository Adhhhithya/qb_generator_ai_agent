import { useState, useEffect } from "react";
import AddSectionForm from "../components/Papers/AddSectionForm";

interface Section {
  id: number;
  name: string;
  marks_per_question: number;
  number_of_questions: number;
  total_marks: number;
}

interface Paper {
  id: number;
  title: string;
  total_marks: number;
  syllabus?: string;
}

interface PaperSectionsPageProps {
  paperId: number;
  onContinue: () => void;
  onBack: () => void;
}

const PaperSectionsPage = ({ paperId, onContinue, onBack }: PaperSectionsPageProps) => {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPaperAndSections();
  }, [paperId]);

  const loadPaperAndSections = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch paper details
      const paperResponse = await fetch(`http://127.0.0.1:8000/papers/${paperId}`);
      if (!paperResponse.ok) {
        throw new Error("Failed to load paper details");
      }
      const paperData = await paperResponse.json();
      
      // Extract just the fields we need
      setPaper({
        id: paperData.paper_id,
        title: paperData.title,
        total_marks: paperData.total_marks,
        syllabus: paperData.syllabus,
      });

      // Fetch existing sections
      const sectionsResponse = await fetch(`http://127.0.0.1:8000/papers/${paperId}/sections`);
      if (sectionsResponse.ok) {
        const sectionsData = await sectionsResponse.json();
        setSections(sectionsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async (sectionData: { name: string; marks: number; count: number }) => {
    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`http://127.0.0.1:8000/papers/${paperId}/sections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: sectionData.name,
          marks_per_question: sectionData.marks,
          number_of_questions: sectionData.count,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to add section");
      }

      // Reload sections to get updated data with IDs
      await loadPaperAndSections();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add section");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSection = async (sectionId: number) => {
    try {
      setError(null);

      const response = await fetch(`http://127.0.0.1:8000/papers/${paperId}/sections/${sectionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete section");
      }

      // Remove from local state
      setSections(sections.filter((s) => s.id !== sectionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete section");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#6B7280]">Loading paper details...</div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="bg-white border border-[#DC2626] rounded-lg p-4">
        <p className="text-[#DC2626]">Failed to load paper details</p>
      </div>
    );
  }

  const totalAssigned = sections.reduce((sum, s) => sum + s.total_marks, 0);
  const isValid = totalAssigned === paper.total_marks;
  const hasExcess = totalAssigned > paper.total_marks;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-sm text-[#4B5D73] hover:text-[#1E3A5F] mb-3 font-medium"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">
          Define Paper Sections
        </h1>
        <p className="text-base text-[#6B7280] mb-3">
          Add sections and mark distribution. Total marks must match the paper.
        </p>
        <div className="text-sm">
          <span className="text-[#6B7280]">Paper:</span>{" "}
          <span className="font-medium text-[#1A1A1A]">{paper.title}</span>
          <span className="mx-2 text-[#E5E7EB]">|</span>
          <span className="text-[#6B7280]">Total Marks:</span>{" "}
          <span className="font-medium text-[#1A1A1A]">{paper.total_marks}</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-white border border-[#DC2626] rounded-lg">
          <p className="text-[#DC2626] text-sm">{error}</p>
        </div>
      )}

      {/* Add Section Form */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 mb-6 shadow-sm">
        <h3 className="text-base font-semibold text-[#1E3A5F] mb-4">Add Section</h3>
        <AddSectionForm onAdd={handleAddSection} />
      </div>

      {/* Sections Table */}
      {sections.length > 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] text-sm">
              <tr>
                <th className="p-3 text-left font-medium text-[#1A1A1A]">Section</th>
                <th className="p-3 text-center font-medium text-[#1A1A1A]">Marks / Q</th>
                <th className="p-3 text-center font-medium text-[#1A1A1A]">Questions</th>
                <th className="p-3 text-center font-medium text-[#1A1A1A]">Total</th>
                <th className="p-3 text-center font-medium text-[#1A1A1A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr key={section.id} className="border-t border-[#E5E7EB] text-sm">
                  <td className="p-3 text-[#1A1A1A]">{section.name}</td>
                  <td className="p-3 text-center text-[#4A4A4A]">{section.marks_per_question}</td>
                  <td className="p-3 text-center text-[#4A4A4A]">{section.number_of_questions}</td>
                  <td className="p-3 text-center font-medium text-[#1A1A1A]">{section.total_marks}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="text-[#DC2626] hover:text-[#B91C1C] text-xs font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#F8FAFC] border-t-2 border-[#E5E7EB]">
              <tr>
                <td colSpan={3} className="p-3 text-sm font-medium text-[#1A1A1A] text-right">
                  Total Assigned Marks:
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`font-semibold ${
                      isValid
                        ? "text-[#059669]"
                        : hasExcess
                        ? "text-[#DC2626]"
                        : "text-[#D97706]"
                    }`}
                  >
                    {totalAssigned} / {paper.total_marks}
                  </span>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Validation Message */}
      {sections.length > 0 && (
        <div className="mt-4">
          {isValid ? (
            <p className="text-sm text-[#059669] flex items-center">
              <span className="mr-2">✓</span>
              Mark distribution is valid. You can continue.
            </p>
          ) : hasExcess ? (
            <p className="text-sm text-[#DC2626] flex items-center">
              <span className="mr-2">✗</span>
              Total marks exceed paper limit by {totalAssigned - paper.total_marks} marks.
            </p>
          ) : (
            <p className="text-sm text-[#D97706] flex items-center">
              <span className="mr-2">⚠</span>
              {paper.total_marks - totalAssigned} marks remaining to assign.
            </p>
          )}
        </div>
      )}

      {/* Continue Button */}
      <div className="mt-6 flex justify-end">
        <button
          disabled={!isValid || submitting}
          onClick={onContinue}
          className={`px-8 py-3 rounded-md font-medium transition ${
            isValid && !submitting
              ? "bg-[#1E3A5F] text-white hover:bg-[#162C46]"
              : "bg-[#E5E7EB] text-[#6B7280] cursor-not-allowed"
          }`}
        >
          {submitting ? "Processing..." : "Continue to Generate"}
        </button>
      </div>
    </div>
  );
};

export default PaperSectionsPage;
