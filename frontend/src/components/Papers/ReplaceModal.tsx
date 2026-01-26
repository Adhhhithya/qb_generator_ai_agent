import { useState } from "react";

interface Alternative {
  id: number;
  text: string;
  quality_score?: number;
}

interface ReplaceModalProps {
  alternatives: Alternative[];
  onConfirm: (replacementId: number) => void;
  onCancel: () => void;
}

const ReplaceModal = ({ alternatives, onConfirm, onCancel }: ReplaceModalProps) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selectedId) {
      onConfirm(selectedId);
    }
  };

  const getQualityLabel = (score?: number) => {
    if (!score) return null;
    if (score >= 90) return { label: "Excellent", color: "text-green-600" };
    if (score >= 75) return { label: "Good", color: "text-blue-600" };
    if (score >= 60) return { label: "Fair", color: "text-yellow-600" };
    return { label: "Review", color: "text-red-600" };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Replace Question</h2>
          <p className="text-sm text-gray-600 mt-1">
            Select an alternative question with matching constraints
          </p>
        </div>

        {/* Alternatives List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {alternatives.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No suitable alternatives available
            </div>
          ) : (
            <div className="space-y-3">
              {alternatives.map((alt) => {
                const quality = getQualityLabel(alt.quality_score);
                return (
                  <label
                    key={alt.id}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedId === alt.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="alternative"
                        value={alt.id}
                        checked={selectedId === alt.id}
                        onChange={() => setSelectedId(alt.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 leading-relaxed">
                          {alt.text}
                        </p>
                        {quality && (
                          <span className={`text-xs font-medium mt-2 inline-block ${quality.color}`}>
                            Quality: {quality.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedId}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Replace Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplaceModal;
