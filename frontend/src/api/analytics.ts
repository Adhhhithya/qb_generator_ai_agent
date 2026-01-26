const API_BASE = "http://127.0.0.1:8000"

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE}/analytics/summary`)
  if (!res.ok) {
    throw new Error("Failed to fetch analytics")
  }
  return res.json()
}
