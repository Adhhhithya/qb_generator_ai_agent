interface BloomDistributionProps {
  distribution: {
    remember?: number;
    understand?: number;
    apply?: number;
    analyze?: number;
    evaluate?: number;
    create?: number;
  };
}

const bloomLevels = [
  { key: 'remember', label: 'Remember', color: '#8B7FBF' },
  { key: 'understand', label: 'Understand', color: '#6B8EC4' },
  { key: 'apply', label: 'Apply', color: '#5FA8B5' },
  { key: 'analyze', label: 'Analyze', color: '#6FAF8E' },
  { key: 'evaluate', label: 'Evaluate', color: '#E9A15B' },
  { key: 'create', label: 'Create', color: '#E76F6F' },
];

const BloomDistribution = ({ distribution }: BloomDistributionProps) => {
  const totalQuestions = Object.values(distribution).reduce((sum, val) => sum + (val || 0), 0);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-sm">
      <h3 className="text-base font-semibold text-[#1F2933] mb-5">
        Bloom Taxonomy Distribution
      </h3>

      <div className="space-y-4">
        {bloomLevels.map((level) => {
          const count = distribution[level.key as keyof typeof distribution] || 0;
          const percentage = totalQuestions > 0 ? (count / totalQuestions) * 100 : 0;

          return (
            <div key={level.key}>
              {/* Level Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: level.color }}
                  />
                  <span className="text-sm font-medium text-[#1F2933]">
                    {level.label}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-[#6B7280]">
                    {count} questions
                  </span>
                  <span className="text-sm font-semibold text-[#52606D] min-w-[3rem] text-right">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full h-2 bg-[#F5F6F8] rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500 ease-out rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: level.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-5 pt-4 border-t border-[#E2E8F0]">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-[#1F2933]">Total Questions</span>
          <span className="font-semibold text-[#4A6FA5]">{totalQuestions}</span>
        </div>
      </div>
    </div>
  );
};

export default BloomDistribution;
