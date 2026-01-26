import { useState, useEffect } from "react";

interface HistoricalPaper {
  paper_id: number;
  title: string;
  total_marks: number;
  status: string;
  created_at: string;
  metadata?: {
    institution_name?: string;
    course_title?: string;
  };
}

const HistoryPage = () => {
  const [papers, setPapers] = useState<HistoricalPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | '30days' | '90days'>('all');

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/papers");
      const data = await response.json();
      
      let filtered = data.papers || [];
      
      if (filter === '30days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter((p: HistoricalPaper) => 
          new Date(p.created_at) >= thirtyDaysAgo
        );
      } else if (filter === '90days') {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        filtered = filtered.filter((p: HistoricalPaper) => 
          new Date(p.created_at) >= ninetyDaysAgo
        );
      }
      
      setPapers(filtered);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-[#6B7280]">Loading history...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#4A6FA5] mb-2">
          Paper History
        </h1>
        <p className="text-base text-[#6B7280]">
          View all previously generated question papers
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-[#52606D]">Filter by:</span>
          <div className="flex space-x-2">
            {(['all', '30days', '90days'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 text-sm rounded-md transition font-medium ${
                  filter === filterOption
                    ? 'bg-[#4A6FA5] text-white'
                    : 'bg-[#F5F6F8] text-[#52606D] hover:bg-[#E2E8F0]'
                }`}
              >
                {filterOption === 'all' ? 'All Time' : filterOption === '30days' ? 'Last 30 Days' : 'Last 90 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {papers.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-12 text-center">
          <p className="text-[#6B7280]">No papers found</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F5F6F8]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1F2933]">
                  Paper Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1F2933]">
                  Institution
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-[#1F2933]">
                  Marks
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-[#1F2933]">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-[#1F2933]">
                  Created
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-[#1F2933]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {papers.map((paper) => (
                <tr key={paper.paper_id} className="hover:bg-[#FAFBFC] transition">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-[#1F2933]">
                      {paper.title || "Untitled Paper"}
                    </div>
                    {paper.metadata?.course_title && (
                      <div className="text-xs text-[#6B7280] mt-1">
                        {paper.metadata.course_title}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#52606D]">
                    {paper.metadata?.institution_name || '—'}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-[#4A6FA5]">
                    {paper.total_marks}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        paper.status === 'FINALIZED'
                          ? 'bg-[#6FAF8E] text-white'
                          : 'bg-[#E9A15B] text-white'
                      }`}
                    >
                      {paper.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-[#6B7280]">
                    {new Date(paper.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-sm text-[#4A6FA5] hover:text-[#3D5A8A] font-medium">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
