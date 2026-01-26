/**
 * CoverageMeter
 * Prop contract (locked): { percentage: number }
 * - Answers: "How much of the syllabus does this paper actually cover?"
 * - Calm, academic, informational (no judging, no animations)
 */

interface CoverageMeterProps {
  percentage: number;
}

// Helper copy, rendered only once per page by parent when appropriate
export const CoverageHelperText = () => (
  <p className="text-sm text-[#6B7280] mt-3">
    Percentage of syllabus topics covered by this question paper.
  </p>
);

const clampPercent = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
};

const getColor = (pct: number) => {
  if (pct >= 70) return "#6FAF8E";     // Soft Green - Good coverage
  if (pct >= 40) return "#F2C26B";     // Amber / Muted Yellow - Moderate
  return "#E9A15B";                    // Soft Orange - Low
};

const CoverageMeter = ({ percentage }: CoverageMeterProps) => {
  const pct = clampPercent(percentage);
  const barColor = getColor(pct);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#1F2933]">Syllabus Coverage</p>
        <span className="text-sm font-semibold text-[#1F2933]">{pct.toFixed(0)}%</span>
      </div>

      <div className="w-full bg-[#E5E7EB] rounded-full h-2" aria-label="Syllabus coverage meter">
        <div
          className="h-2 rounded-full"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
};

export default CoverageMeter;
