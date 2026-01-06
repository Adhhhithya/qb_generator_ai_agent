const API_BASE = "http://127.0.0.1:8000"

export async function postGenerate(payload: any) {
  const res = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error("Failed to generate question")
  }

  return res.json()
}