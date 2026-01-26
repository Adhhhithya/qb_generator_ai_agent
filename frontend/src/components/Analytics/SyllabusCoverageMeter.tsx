import React from 'react';

interface Props {
    percentage: number;
}

const SyllabusCoverageMeter: React.FC<Props> = ({ percentage }) => {
    // Determine color based on percentage
    let colorClass = 'bg-warning'; // Low
    if (percentage >= 70) {
        colorClass = 'bg-success'; // High
    } else if (percentage >= 40) {
        colorClass = 'bg-warning-light'; // Medium (using warning light as amber substitute for now)
    }

    return (
        <div className="flex flex-col w-full">
            <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-neutral-muted">Syllabus Coverage</span>
                <span className="text-lg font-bold text-neutral-dark">{percentage}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default SyllabusCoverageMeter;
