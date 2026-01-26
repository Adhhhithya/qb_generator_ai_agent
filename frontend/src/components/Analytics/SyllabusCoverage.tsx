interface SyllabusCoverageProps {
  coveragePercentage: number;
  totalTopics: number;
  coveredTopics: number;
}

const SyllabusCoverage = ({ 
  coveragePercentage, 
  totalTopics, 
  coveredTopics 
}: SyllabusCoverageProps) => {
  // Determine color based on coverage level
  const getColorClass = () => {
    if (coveragePercentage >= 75) return 'bg-[#6FAF8E]'; // Soft Green - High
    if (coveragePercentage >= 50) return 'bg-[#E9A15B]'; // Soft Orange - Medium
    return 'bg-[#E76F6F]'; // Soft Red - Low
  };

  const getTextColorClass = () => {
    if (coveragePercentage >= 75) return 'text-[#4F9070]';
    if (coveragePercentage >= 50) return 'text-[#D18A45]';
    return 'text-[#D64545]';
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-[#1F2933]">
          Syllabus Coverage
        </h3>
        <span className={`text-2xl font-bold ${getTextColorClass()}`}>
          {coveragePercentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-[#F5F6F8] rounded-full overflow-hidden mb-3">
        <div
          className={`h-full ${getColorClass()} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${coveragePercentage}%` }}
        />
      </div>

      {/* Topic Count */}
      <div className="flex items-center justify-between text-sm text-[#6B7280]">
        <span>
          {coveredTopics} of {totalTopics} topics covered
        </span>
        <span className="text-xs">
          {coveragePercentage >= 75 ? 'Excellent' : coveragePercentage >= 50 ? 'Good' : 'Needs Improvement'}
        </span>
      </div>
    </div>
  );
};

export default SyllabusCoverage;
