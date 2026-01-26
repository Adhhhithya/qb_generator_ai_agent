interface QuestionCardProps {
  questionId: string;
  questionText: string;
  marks: number;
  bloomLevel: string;
  topicsUsed: string[];
  status: "NORMAL" | "REPLACING" | "REPLACED";
  onReplaceRequest: () => void;
}

const QuestionCard = ({
  questionId,
  questionText,
  marks,
  bloomLevel,
  topicsUsed,
  status,
  onReplaceRequest,
}: QuestionCardProps) => {
  const isReplacing = status === "REPLACING";
  const isReplaced = status === "REPLACED";
  const disableReplace = isReplacing || isReplaced;

  const statusMessage = () => {
    if (isReplacing) return "Generating an alternative question…";
    if (isReplaced) return "Question replaced successfully.";
    return "";
  };

  return (
    <div className={`border rounded-md p-4 space-y-3 ${isReplacing ? "opacity-60" : "opacity-100"}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold">Question {questionId}</p>
        </div>
        <div className="text-sm font-semibold">{marks} marks</div>
      </div>

      {/* Question Text */}
      <div className="text-base leading-relaxed">{questionText}</div>

      {/* Metadata */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Bloom:</span>
          <span>{bloomLevel}</span>
        </div>
        <div>
          <span className="font-semibold">Topics:</span>
          {topicsUsed.length > 0 ? (
            <span className="ml-2">{topicsUsed.join(", ")}</span>
          ) : (
            <span className="ml-2 text-gray-500">No topics provided</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">{statusMessage()}</div>
        <button
          type="button"
          onClick={onReplaceRequest}
          disabled={disableReplace}
          className="px-4 py-2 border rounded text-sm font-medium disabled:opacity-50"
        >
          Replace Question
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
