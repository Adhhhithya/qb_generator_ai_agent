import { useEffect, useState } from "react";
import { fetchPaper } from "../api/papers";
import type { Paper } from "../api/papers";

interface PaperMetadata {
  institution_name?: string;
  department?: string;
  course_title?: string;
  exam_duration?: string;
  max_marks?: number;
}

interface PaperPreviewPageProps {
  paperId: number;
  onClose: () => void;
}

const PaperPreviewPage = ({ paperId, onClose }: PaperPreviewPageProps) => {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [metadata, setMetadata] = useState<PaperMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingMetadata, setEditingMetadata] = useState(false);
  const [editFormData, setEditFormData] = useState<PaperMetadata>({});

  useEffect(() => {
    loadPaper();
  }, [paperId]);

  const loadPaper = async () => {
    try {
      const data = await fetchPaper(paperId);
      setPaper(data);
      // Extract and set metadata with defaults
      const paperMetadata = data.metadata || {};
      setMetadata({
        institution_name: paperMetadata.institution_name || "XYZ Engineering College",
        department: paperMetadata.department || "Department of Computer Science",
        course_title: paperMetadata.course_title || "Examination",
        exam_duration: paperMetadata.exam_duration || "3 Hours",
        max_marks: paperMetadata.max_marks || data.total_marks,
      });
      setEditFormData(paperMetadata);
    } catch (err) {
      console.error("Failed to load paper", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/papers/${paperId}/export/pdf`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${paper?.title || "paper"}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert("Failed to download PDF");
    }
  };

  const isMetadataLocked = paper?.status === "FINALIZED" || (paper?.sections && paper.sections.length > 0);

  const handleEditMetadata = () => {
    if (isMetadataLocked) {
      alert("Paper metadata is locked after generation. Questions should not be regenerated.");
      return;
    }
    setEditingMetadata(true);
  };

  const handleSaveMetadata = () => {
    setMetadata(editFormData);
    setEditingMetadata(false);
  };

  const handleCancelEdit = () => {
    setEditFormData(metadata || {});
    setEditingMetadata(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading paper...</div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-700">Paper not found</div>
      </div>
    );
  }

  return (
    <div>
      {/* Metadata Editor Modal */}
      {editingMetadata && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 no-print">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Edit Institution Metadata</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Institution Name
                </label>
                <input
                  type="text"
                  value={editFormData.institution_name || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      institution_name: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={editFormData.department || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      department: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Course / Subject
                </label>
                <input
                  type="text"
                  value={editFormData.course_title || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      course_title: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Exam Duration
                </label>
                <input
                  type="text"
                  value={editFormData.exam_duration || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      exam_duration: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Max Marks
                </label>
                <input
                  type="number"
                  value={editFormData.max_marks || 0}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      max_marks: Number(e.target.value),
                    })
                  }
                  className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMetadata}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action bar - hidden in print */}
      <div className="no-print fixed top-0 left-0 right-0 bg-white border-b border-gray-300 shadow-sm z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Review
          </button>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
            >
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Printable paper content */}
      <div className="paper-container">
        <div className="paper-content">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="no-print mb-2 flex items-center justify-between px-4 py-1 bg-slate-50 rounded">
              <span className="text-xs text-slate-500">Institution Details</span>
              <button
                onClick={handleEditMetadata}
                disabled={isMetadataLocked}
                className={`text-xs px-2 py-1 rounded ${
                  isMetadataLocked
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                }`}
              >
                {isMetadataLocked ? "Locked" : "Edit"}
              </button>
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {metadata?.institution_name || "XYZ Engineering College"}
            </h1>
            <h2 className="text-lg mb-1">
              {metadata?.department || "Department of Computer Science"}
            </h2>
            <h3 className="text-base font-semibold mb-4">
              {metadata?.course_title || paper.title || "Examination"}
            </h3>
            <div className="flex justify-between text-sm border-t border-b border-gray-400 py-2">
              <span>Time: {metadata?.exam_duration || "3 Hours"}</span>
              <span>Max Marks: {metadata?.max_marks || paper.total_marks}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6 text-sm">
            <p className="font-semibold mb-1">Instructions:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Answer all questions.</li>
              <li>All questions carry equal marks within each part.</li>
              <li>Write answers in clear, legible handwriting.</li>
            </ul>
          </div>

          {/* Sections */}
          {paper.sections.map((section, idx) => {
            const totalMarks =
              section.marks_per_question * section.questions.length;
            return (
              <div key={idx} className="mb-8 page-break-inside-avoid">
                <h2 className="text-lg font-bold mb-3 border-b border-gray-400 pb-1">
                  {section.section} ({section.questions.length} ×{" "}
                  {section.marks_per_question} = {totalMarks} Marks)
                </h2>
                <div className="space-y-4">
                  {section.questions.map((question) => (
                    <div
                      key={question.question_id}
                      className="flex gap-3 page-break-inside-avoid"
                    >
                      <span className="font-semibold min-w-[2rem]">
                        {question.order}.
                      </span>
                      <p className="flex-1 leading-relaxed">{question.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Footer */}
          <div className="mt-12 pt-4 border-t border-gray-400 text-center text-sm text-gray-600">
            <p>*** End of Question Paper ***</p>
          </div>
        </div>
      </div>

      <style>{`
        /* Print styles */
        @media print {
          .no-print {
            display: none !important;
          }

          .paper-container {
            padding: 0;
            margin: 0;
          }

          .paper-content {
            max-width: 100%;
            padding: 1in;
            font-size: 12pt;
          }

          .page-break-inside-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }

        /* Screen styles */
        @media screen {
          .paper-container {
            min-height: 100vh;
            background: #f5f5f5;
            padding: 80px 20px 40px;
          }

          .paper-content {
            max-width: 8.5in;
            margin: 0 auto;
            background: white;
            padding: 1in;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.6;
          }

          .page-break-inside-avoid {
            /* No effect on screen */
          }
        }
      `}</style>
    </div>
  );
};

export default PaperPreviewPage;
