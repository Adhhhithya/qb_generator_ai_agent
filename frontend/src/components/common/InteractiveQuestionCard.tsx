import React, { useState } from 'react';

interface Question {
    id: string | number;
    text: string;
    marks: number;
    bloomLevel: string;
    topics: string[];
}

interface Props {
    question: Question;
    onReplace?: () => void;
    onViewDetails?: () => void;
}

const InteractiveQuestionCard: React.FC<Props> = ({ question, onReplace, onViewDetails }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className={`
        bg-white rounded-xl border border-neutral-border shadow-sm hover:shadow-md transition-all duration-300
        overflow-hidden cursor-pointer group
        ${expanded ? 'ring-2 ring-primary ring-opacity-50' : ''}
      `}
            onClick={() => setExpanded(!expanded)}
        >
            <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-dark text-xs font-medium rounded-md">
                            {question.marks} Marks
                        </span>
                        <span className="px-2 py-1 bg-bloom-light bg-opacity-20 text-bloom text-xs font-medium rounded-md">
                            {question.bloomLevel}
                        </span>
                    </div>
                    {expanded && (
                        <div className="flex space-x-2">
                            {onReplace && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onReplace(); }}
                                    className="p-1 text-neutral-muted hover:text-warning transition-colors"
                                    title="Replace Question"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Question Text */}
                <div className="mb-4">
                    <p className="text-neutral-dark font-medium leading-relaxed">
                        {question.text}
                    </p>
                </div>

                {/* Footer / Topics */}
                <div className="flex flex-wrap gap-2">
                    {question.topics.map((topic, idx) => (
                        <span key={idx} className="text-xs text-neutral-muted bg-neutral-50 px-2 py-1 rounded border border-neutral-100">
                            {topic}
                        </span>
                    ))}
                </div>
            </div>

            {/* Expanded Actions Area */}
            {expanded && onViewDetails && (
                <div className="bg-neutral-50 px-5 py-3 border-t border-neutral-border flex justify-end">
                    <button
                        onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
                        className="text-sm text-primary font-medium hover:text-primary-dark transition-colors"
                    >
                        View Details →
                    </button>
                </div>
            )}
        </div>
    );
};

export default InteractiveQuestionCard;
