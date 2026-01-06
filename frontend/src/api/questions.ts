const API_BASE = "http://127.0.0.1:8000"

export async function fetchQuestions() {
  const res = await fetch(`${API_BASE}/questions`)
  if (!res.ok) {
    throw new Error("Failed to fetch questions")
  }
  return res.json()
}