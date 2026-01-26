import { useState, useEffect } from "react";

interface FinalizedPaper {
  paper_id: number;
  title: string;
  total_marks: number;
  status: string;
  created_at: string;
  finalized_at?: string;
}

const FinalizedPapersPage = () => {
  const [papers, setPapers] = useState<FinalizedPaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinalizedPapers();
  }, []);

  const fetchFinalizedPapers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/papers?status=FINALIZED");
      const data = await response.json();
      setPapers(data.papers || []);
    } catch (error) {
      console.error("Failed to fetch finalized papers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (paperId: number, format: 'pdf' | 'docx') => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/papers/${paperId}/export/${format}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `paper_${paperId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-[#6B7280]">Loading finalized papers...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#4A6FA5] mb-2">
          Finalized Papers
        </h1>
        <p className="text-base text-[#6B7280]">
          Export-ready question papers locked for distribution
        </p>
      </div>

      {papers.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-12 text-center">
          <p className="text-[#6B7280]">No finalized papers yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {papers.map((paper) => (
            <div
              key={paper.paper_id}
              className="bg-white border border-[#E2E8F0] rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-[#1F2933]">
                      {paper.title || "Untitled Paper"}
                    </h3>
                    <span className="px-3 py-1 bg-[#6FAF8E] text-white text-xs font-medium rounded-full">
                      Finalized
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-[#6B7280]">
                    <span>{paper.total_marks} marks</span>
                    <span>•</span>
                    <span>
                      Finalized {paper.finalized_at ? new Date(paper.finalized_at).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleExport(paper.paper_id, 'pdf')}
                    className="px-4 py-2 bg-[#4A6FA5] text-white text-sm rounded-md hover:bg-[#3D5A8A] transition font-medium"
                  >
                    Export PDF
                  </button>
                  <button
                    onClick={() => handleExport(paper.paper_id, 'docx')}
                    className="px-4 py-2 border border-[#E2E8F0] text-[#52606D] text-sm rounded-md hover:bg-[#F5F6F8] transition font-medium"
                  >
                    Export DOCX
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinalizedPapersPage;
