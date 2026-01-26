import React from 'react';

interface BloomData {
    remember: number;
    understand: number;
    apply: number;
    analyze: number;
}

interface Props {
    distribution: BloomData;
}

const BloomDistributionChart: React.FC<Props> = ({ distribution }) => {
    const total = distribution.remember + distribution.understand + distribution.apply + distribution.analyze;

    const getPercent = (value: number) => total > 0 ? (value / total) * 100 : 0;

    return (
        <div className="w-full">
            <h4 className="text-sm font-medium text-neutral-muted mb-3">Bloom's Taxonomy Distribution</h4>

            {/* Visual Bar */}
            <div className="flex w-full h-4 rounded-full overflow-hidden mb-4">
                <div style={{ width: `${getPercent(distribution.remember)}%` }} className="bg-bloom-light opacity-60" title="Remember" />
                <div style={{ width: `${getPercent(distribution.understand)}%` }} className="bg-bloom-light" title="Understand" />
                <div style={{ width: `${getPercent(distribution.apply)}%` }} className="bg-bloom" title="Apply" />
                <div style={{ width: `${getPercent(distribution.analyze)}%` }} className="bg-bloom opacity-80" title="Analyze" />
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-bloom-light opacity-60 mr-2" />
                    <span className="text-neutral-dark">Remember ({distribution.remember})</span>
                </div>
                <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-bloom-light mr-2" />
                    <span className="text-neutral-dark">Understand ({distribution.understand})</span>
                </div>
                <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-bloom mr-2" />
                    <span className="text-neutral-dark">Apply ({distribution.apply})</span>
                </div>
                <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-bloom opacity-80 mr-2" />
                    <span className="text-neutral-dark">Analyze ({distribution.analyze})</span>
                </div>
            </div>
        </div>
    );
};

export default BloomDistributionChart;
