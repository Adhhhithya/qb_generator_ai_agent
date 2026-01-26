const IntroHeader = ({ userName = "Educator" }: { userName?: string }) => {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Welcome back, {userName} <span className="text-2xl">👋</span>
            </h1>
            <h2 className="text-xl text-slate-600 mb-1">
                An AI-powered workspace for syllabus-aligned question paper creation.
            </h2>
            <p className="text-slate-500">
                Designed to help faculty generate, review, and finalize exam-ready question papers efficiently.
            </p>
        </div>
    );
};

export default IntroHeader;
