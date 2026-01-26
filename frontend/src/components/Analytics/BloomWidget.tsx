/**
 * BloomWidget (Visualized Bloom distribution)
 * Answers: "What kind of thinking does this paper mostly test?"
 * - Horizontal segmented bars
 * - Soft purple family only
 * - Hide zero-count levels
 * - No legends; labels are explicit
 */

interface BloomWidgetProps {
  distribution: {
    Remember?: number;
    Understand?: number;
    Apply?: number;
    Analyze?: number;
    Evaluate?: number;
    Create?: number;
    [key: string]: number | undefined;
  };
}

export const BloomHelperText = () => (
  <p className="text-sm text-[#6B7280] mt-3">
    Shows the distribution of questions across Bloom’s cognitive levels.
  </p>
);

const bloomLevels = [
  { key: "Remember", color: "#D6D0F0" },      // Light purple
  { key: "Understand", color: "#C4B8E8" },    // Slightly deeper
  { key: "Apply", color: "#B3A1E0" },         // Medium purple
  { key: "Analyze", color: "#9D8ACC" },       // Deeper purple
  { key: "Evaluate", color: "#8A79BB" },     // Muted indigo
  { key: "Create", color: "#B39AD9" },        // Soft violet
];

const BloomWidget = ({ distribution }: BloomWidgetProps) => {
  // Normalize keys: accept both capitalized and lowercase
  const getCount = (level: string) => {
    return distribution[level] ?? distribution[level.toLowerCase()] ?? 0;
  };

  const rows = bloomLevels
    .map((level) => ({ ...level, count: getCount(level.key) }))
    .filter((row) => row.count > 0);

  if (rows.length === 0) {
    return (
      <div>
        <p className="text-sm font-semibold text-[#1F2933] mb-2">Bloom’s Taxonomy Distribution</p>
        <p className="text-sm text-[#6B7280]">No data available</p>
      </div>
    );
  }

  const maxCount = Math.max(...rows.map((r) => r.count));

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-[#1F2933]">Bloom’s Taxonomy Distribution</p>

      <div className="space-y-2">
        {rows.map((row) => {
          const widthPct = maxCount > 0 ? (row.count / maxCount) * 100 : 0;

          return (
            <div key={row.key} className="flex items-center space-x-3 text-sm">
              <span className="w-28 text-[#1F2933]">{row.key}</span>
              <div className="flex-1 h-3 bg-[#ECECF4] rounded-full">
                <div
                  className="h-3 rounded-full"
                  style={{ width: `${widthPct}%`, backgroundColor: row.color }}
                />
              </div>
              <span className="w-8 text-right font-semibold text-[#1F2933]">{row.count}</span>
            </div>
          );
        })}
      </div>

      <BloomHelperText />
    </div>
  );
};

export default BloomWidget;
