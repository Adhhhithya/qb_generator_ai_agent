/**
 * VISUAL ANALYTICS ARCHITECTURE - PHASE 1: STRUCTURE ONLY
 * 
 * PaperAnalyticsPanel: Reusable container for analytics
 * - Receives analytics data
 * - Chooses which widgets to render
 * - Handles empty states
 * - NO CHARTS, NO COLORS, NO ANIMATIONS YET
 */

import CoverageMeter, { CoverageHelperText } from "./CoverageMeter";
import BloomWidget from "./BloomWidget";

interface PaperAnalyticsPanelProps {
  coveragePercent: number;
  bloomDistribution: Record<string, number>;
  context: "DASHBOARD" | "EDITOR" | "VIEW";
}

const PaperAnalyticsPanel = ({ 
  coveragePercent, 
  bloomDistribution,
  context 
}: PaperAnalyticsPanelProps) => {
  
  const hasData = coveragePercent > 0 || Object.values(bloomDistribution).some((v) => v > 0);

  // Determine layout based on context
  const isCompact = context === "DASHBOARD";
  const containerClass = isCompact ? "space-y-4 max-w-md" : "space-y-6 w-full";

  return (
    <div className={containerClass}>
      <div className="border border-gray-300 rounded p-4">
        <h3 className="font-semibold mb-3">
          Analytics {context === "DASHBOARD" ? "(Overview)" : ""}
        </h3>

        {!hasData && (
          <p className="text-sm text-[#6B7280] mb-3">No analytics data yet. Showing 0% coverage.</p>
        )}

        {/* Coverage Meter Widget */}
        <div className="mb-4">
          <CoverageMeter percentage={coveragePercent} />
          {context !== "DASHBOARD" && <CoverageHelperText />}
        </div>

        {/* Bloom Distribution Widget */}
        <div>
          <BloomWidget distribution={bloomDistribution} />
        </div>
      </div>
    </div>
  );
};

export default PaperAnalyticsPanel;
