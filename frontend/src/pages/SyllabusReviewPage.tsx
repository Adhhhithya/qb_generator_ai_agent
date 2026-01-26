import { useState } from "react";
import { useParams } from "react-router-dom";

interface SyllabusUnit {
  unit_title: string;
  topics: string[];
}

interface SyllabusReviewPageProps {
  onSyllabusConfirmed: (paperId: number) => void;
}

const SyllabusReviewPage = ({ onSyllabusConfirmed }: SyllabusReviewPageProps) => {
  const { paperId } = useParams<{ paperId: string }>();
  const [units, setUnits] = useState<SyllabusUnit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingUnitIndex, setEditingUnitIndex] = useState<number | null>(null);
  const [editingTopicIndex, setEditingTopicIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Load syllabus structure from backend
  const loadSyllabusStructure = async () => {
    if (!paperId) return;

    setLoading(true);
    setError(null);

    try {
      // First, fetch the syllabus status
      const response = await fetch(
        `http://127.0.0.1:8000/syllabus/status/${paperId}`
      );

      if (!response.ok) {
        throw new Error("Failed to load syllabus");
      }

      const data = await response.json();

      if (data.status === "CONFIRMED" && data.structured) {
        setUnits(data.structured.units);
      } else {
        setError("Syllabus not yet processed. Please process the syllabus first.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load syllabus"
      );
    } finally {
      setLoading(false);
    }
  };

  // Rename unit title
  const handleRenameUnit = (index: number, newTitle: string) => {
    const newUnits = [...units];
    newUnits[index].unit_title = newTitle;
    setUnits(newUnits);
  };

  // Add new topic to unit
  const handleAddTopic = (unitIndex: number) => {
    const newUnits = [...units];
    newUnits[unitIndex].topics.push("New Topic");
    setUnits(newUnits);
  };

  // Edit topic text
  const handleEditTopic = (unitIndex: number, topicIndex: number, newText: string) => {
    const newUnits = [...units];
    newUnits[unitIndex].topics[topicIndex] = newText;
    setUnits(newUnits);
  };

  // Remove topic from unit
  const handleRemoveTopic = (unitIndex: number, topicIndex: number) => {
    const newUnits = [...units];
    newUnits[unitIndex].topics.splice(topicIndex, 1);

    // If unit has no topics, remove the unit
    if (newUnits[unitIndex].topics.length === 0) {
      newUnits.splice(unitIndex, 1);
    }

    setUnits(newUnits);
  };

  // Reorder units
  const handleMoveUnitUp = (index: number) => {
    if (index === 0) return;
    const newUnits = [...units];
    [newUnits[index - 1], newUnits[index]] = [newUnits[index], newUnits[index - 1]];
    setUnits(newUnits);
  };

  const handleMoveUnitDown = (index: number) => {
    if (index === units.length - 1) return;
    const newUnits = [...units];
    [newUnits[index], newUnits[index + 1]] = [newUnits[index + 1], newUnits[index]];
    setUnits(newUnits);
  };

  // Confirm syllabus
  const handleConfirmSyllabus = async () => {
    if (!paperId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/syllabus/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paper_id: Number(paperId),
          structured_units: units,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to confirm syllabus");
      }

      const data = await response.json();
      setEditMode(false);
      onSyllabusConfirmed(Number(paperId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to confirm syllabus"
      );
    } finally {
      setLoading(false);
    }
  };

  // Initialize on mount
  useState(() => {
    loadSyllabusStructure();
  }, [paperId]);

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">
          Review Syllabus Structure
        </h1>
        <p className="text-sm text-slate-500">
          Review and organize the extracted syllabus topics into units. You can rename units,
          remove topics, and reorder as needed.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="text-slate-500">Loading syllabus...</div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Units Display */}
          {units.length > 0 ? (
            units.map((unit, unitIndex) => (
              <div
                key={unitIndex}
                className="border border-slate-200 rounded-lg p-4 bg-white hover:shadow-md transition"
              >
                {/* Unit Title */}
                <div className="flex items-center justify-between mb-3">
                  {editMode ? (
                    <input
                      type="text"
                      value={unit.unit_title}
                      onChange={(e) => handleRenameUnit(unitIndex, e.target.value)}
                      className="flex-1 border border-indigo-300 rounded px-2 py-1 text-sm font-medium"
                    />
                  ) : (
                    <h3 className="text-lg font-semibold text-slate-800">
                      {unit.unit_title}
                    </h3>
                  )}

                  {/* Unit Controls */}
                  {editMode && (
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() => handleMoveUnitUp(unitIndex)}
                        disabled={unitIndex === 0}
                        className="p-1 text-slate-500 hover:text-slate-700 disabled:opacity-50"
                        title="Move up"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleMoveUnitDown(unitIndex)}
                        disabled={unitIndex === units.length - 1}
                        className="p-1 text-slate-500 hover:text-slate-700 disabled:opacity-50"
                        title="Move down"
                      >
                        ▼
                      </button>
                    </div>
                  )}
                </div>

                {/* Topics */}
                <div className="space-y-2 mb-3">
                  {unit.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="flex items-center gap-2">
                      <span className="text-slate-400 text-sm">→</span>
                      {editMode ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={topic}
                            onChange={(e) =>
                              handleEditTopic(unitIndex, topicIndex, e.target.value)
                            }
                            className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm"
                          />
                          <button
                            onClick={() => handleRemoveTopic(unitIndex, topicIndex)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-700">{topic}</span>
                      )}
                    </div>
                  ))}

                  {/* Add Topic Button (edit mode only) */}
                  {editMode && (
                    <button
                      onClick={() => handleAddTopic(unitIndex)}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium ml-6"
                    >
                      + Add Topic
                    </button>
                  )}
                </div>

                {/* Unit Topic Count */}
                <div className="text-xs text-slate-500">
                  {unit.topics.length} topic{unit.topics.length !== 1 ? "s" : ""}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-lg">
              <p className="text-slate-500">No syllabus structure loaded</p>
            </div>
          )}

          {/* Summary */}
          {units.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-indigo-900">
                Summary: <strong>{units.length}</strong> units,{" "}
                <strong>{units.reduce((sum, u) => sum + u.topics.length, 0)}</strong> topics total
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end mt-6">
            {!editMode ? (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 font-medium transition"
                >
                  Edit Manually
                </button>
                <button
                  onClick={handleConfirmSyllabus}
                  disabled={loading || units.length === 0}
                  className={`px-6 py-2 rounded-md font-medium transition ${
                    loading || units.length === 0
                      ? "bg-slate-400 text-white cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {loading ? "Confirming..." : "Confirm Syllabus"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditMode(false);
                    loadSyllabusStructure(); // Reload to discard changes
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSyllabus}
                  disabled={loading || units.length === 0}
                  className={`px-6 py-2 rounded-md font-medium transition ${
                    loading || units.length === 0
                      ? "bg-slate-400 text-white cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SyllabusReviewPage;
