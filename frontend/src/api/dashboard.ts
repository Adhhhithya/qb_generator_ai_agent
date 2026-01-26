const API_URL = "http://127.0.0.1:8000";

export interface DashboardStats {
  total_papers: number;
  finalized_papers: number;
  avg_quality_score: number;
  rejected_attempts: number;
  bloom_distribution: Record<string, number>;
  difficulty_distribution: Record<string, number>;
}

export interface RecentPaper {
  id: number;
  title: string;
  total_marks: number;
  status: string;
  created_at: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_URL}/dashboard/stats`);
  if (!response.ok) throw new Error("Failed to fetch dashboard stats");
  return response.json();
}

export async function fetchRecentPapers(limit = 10): Promise<RecentPaper[]> {
  const response = await fetch(`${API_URL}/dashboard/recent-papers?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch recent papers");
  return response.json();
}
