/**
 * ReplaceQuestionModal
 * Review-first replacement flow: compare original vs proposed, require explicit confirmation.
 * No generation logic inside; parent controls open/close and applies replacement.
 */

interface QuestionSummary {
  text: string;
  marks: number;
  bloomLevel: string;
  topicsUsed: string[];
}

interface ReplaceQuestionModalProps {
  isOpen: boolean;
  originalQuestion: QuestionSummary;
  proposedQuestion: QuestionSummary;
  onConfirm: () => void;
  onCancel: () => void;
}

const ReplaceQuestionModal = ({
  isOpen,
  originalQuestion,
  proposedQuestion,
  onConfirm,
  onCancel,
}: ReplaceQuestionModalProps) => {
  if (!isOpen) return null;

  const renderCard = (label: string, q: QuestionSummary) => (
    <div className="border rounded-md p-4 space-y-3">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold">{label}</h3>
        <span className="text-sm font-semibold">{q.marks} marks</span>
      </div>
      <p className="text-base leading-relaxed">{q.text}</p>
      <div className="space-y-1 text-sm">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Bloom:</span>
          <span>{q.bloomLevel}</span>
        </div>
        <div className="flex items-start space-x-2">
          <span className="font-semibold">Topics:</span>
          <span className="flex-1">
            {q.topicsUsed && q.topicsUsed.length > 0 ? q.topicsUsed.join(", ") : "No topics provided"}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 p-6 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Replace Question</h2>
          <p className="text-sm text-gray-600">The replacement will update syllabus coverage and analytics.</p>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderCard("Original Question", originalQuestion)}
          {renderCard("Proposed Alternative", proposedQuestion)}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium border rounded"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold rounded border"
          >
            Confirm Replacement
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplaceQuestionModal;
