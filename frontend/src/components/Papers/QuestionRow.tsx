import { useState } from "react";
import type { PaperQuestion } from "../../api/papers";

interface QuestionRowProps {
  question: PaperQuestion;
  onRegenerate: (questionId: number) => Promise<void>;
  onReplace: (questionId: number) => void;
}

const QuestionRow = ({
  question,
  onRegenerate,
  onReplace,
}: QuestionRowProps) => {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerate(question.question_id);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-400 font-medium min-w-[2rem]">
        {question.order}.
      </span>

      <div className="flex-1">
        <p className="text-gray-900 text-sm leading-relaxed">{question.text}</p>

        <div className="mt-2 flex gap-2">
          <Badge label={question.bloom} />
          <Badge label={question.difficulty} variant="muted" />
          <Badge label={`${question.marks} marks`} variant="outline" />
          <QualityIndicator score={question.quality_score} />
        </div>

        <div className="mt-3 flex gap-4 text-sm">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRegenerating ? "Regenerating..." : "Regenerate"}
          </button>
          <button
            onClick={() => onReplace(question.question_id)}
            className="text-gray-600 hover:underline"
          >
            Replace
          </button>
        </div>
      </div>
    </div>
  );
};

// Quality Score Indicator
const QualityIndicator = ({ score }: { score?: number }) => {
  if (score == null) return null;

  let color = "bg-green-100 text-green-700";
  let label = "Excellent";

  if (score < 90) {
    color = "bg-blue-100 text-blue-700";
    label = "Good";
  }
  if (score < 75) {
    color = "bg-yellow-100 text-yellow-700";
    label = "Fair";
  }
  if (score < 60) {
    color = "bg-red-100 text-red-700";
    label = "Review";
  }

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
      {label}
    </span>
  );
};

// Simple Badge component
const Badge = ({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "muted" | "outline" | "success";
}) => {
  const variants = {
    default: "bg-blue-100 text-blue-700",
    muted: "bg-gray-100 text-gray-700",
    outline: "bg-white border border-gray-300 text-gray-700",
    success: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${variants[variant]}`}
    >
      {label}
    </span>
  );
};

export default QuestionRow;
