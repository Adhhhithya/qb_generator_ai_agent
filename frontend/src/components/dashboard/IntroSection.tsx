import React from 'react';

const IntroSection: React.FC = () => {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-dark mb-2">
                StaffRoom AI
            </h1>
            <h2 className="text-xl text-primary font-medium mb-4">
                An AI-powered workspace for syllabus-aligned question paper creation.
            </h2>
            <p className="text-neutral-muted max-w-2xl text-lg leading-relaxed">
                Streamline your academic workflow with intelligent tools designed for faculty productivity.
                Ensure syllabus correctness and academic reliability in every question paper you generate.
            </p>
        </div>
    );
};

export default IntroSection;
