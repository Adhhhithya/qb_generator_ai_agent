interface PaperSummary {
  title: string
  totalQuestions: number
  coveragePercent: number
  bloomDistribution: Record<string, number>
}

interface FinalizePaperModalProps {
  isOpen: boolean
  paperSummary: PaperSummary
  onConfirm: () => void
  onCancel: () => void
}

const FinalizePaperModal = ({
  isOpen,
  paperSummary,
  onConfirm,
  onCancel,
}: FinalizePaperModalProps) => {
  if (!isOpen) return null

  const { title, totalQuestions, coveragePercent, bloomDistribution } = paperSummary

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Finalize Question Paper</h2>
          <p className="text-sm text-gray-600">
            Once finalized, the question paper cannot be edited.
          </p>
        </div>

        <div className="space-y-3">
          <div className="border rounded-md p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">Paper</span>
              <span>{title || "Untitled"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">Total Questions</span>
              <span>{totalQuestions}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">Syllabus Coverage</span>
              <span>{Math.round(coveragePercent)}%</span>
            </div>
          </div>

          <div className="border rounded-md p-4 space-y-2">
            <h3 className="text-sm font-semibold">Bloom’s Taxonomy Distribution</h3>
            {Object.keys(bloomDistribution || {}).length === 0 ? (
              <p className="text-sm text-gray-600">No data available</p>
            ) : (
              <div className="space-y-1 text-sm">
                {Object.entries(bloomDistribution).map(([level, count]) => (
                  <div key={level} className="flex items-center justify-between">
                    <span>{level}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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
            className="px-4 py-2 text-sm font-semibold border rounded"
          >
            Confirm Finalization
          </button>
        </div>
      </div>
    </div>
  )
}

export default FinalizePaperModal