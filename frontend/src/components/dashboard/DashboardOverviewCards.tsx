import React from 'react';

interface CardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    colorClass: string;
}

const Card: React.FC<CardProps> = ({ title, description, icon, onClick, colorClass }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-start p-6 bg-white rounded-xl border border-neutral-border shadow-sm hover:shadow-md transition-all duration-200 group text-left w-full h-full"
    >
        <div className={`p-3 rounded-lg mb-4 ${colorClass} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-neutral-dark mb-2 group-hover:text-primary transition-colors">
            {title}
        </h3>
        <p className="text-sm text-neutral-muted">
            {description}
        </p>
    </button>
);

interface Props {
    onNavigate: (page: string) => void;
}

const DashboardOverviewCards: React.FC<Props> = ({ onNavigate }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card
                title="Generate Question Paper"
                description="Create a new syllabus-aligned question paper from scratch."
                onClick={() => onNavigate('createPaper')}
                colorClass="bg-primary text-primary"
                icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                }
            />
            <Card
                title="View Drafts"
                description="Continue working on your in-progress question papers."
                onClick={() => onNavigate('drafts')}
                colorClass="bg-warning text-warning"
                icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                }
            />
            <Card
                title="Finalized Papers"
                description="Access and export your completed question papers."
                onClick={() => onNavigate('finalized')}
                colorClass="bg-success text-success"
                icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                }
            />
            <Card
                title="Question Bank"
                description="Browse and manage your repository of questions."
                onClick={() => onNavigate('bank')} // Assuming 'bank' is a valid page/tab
                colorClass="bg-bloom text-bloom"
                icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                }
            />
        </div>
    );
};

export default DashboardOverviewCards;
