import { useState } from "react"
import { postGenerate } from "../../api/client"
import GenerateResult from "./GenerateResult"

const GenerateForm = () => {
  const [code, setCode] = useState("")
  const [topic, setTopic] = useState("")
  const [bloom, setBloom] = useState("Apply")
  const [difficulty, setDifficulty] = useState("Medium")
  const [marks, setMarks] = useState(10)
  const [keywords, setKeywords] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const payload = {
        code,
        topic,
        bloom_level: bloom,
        difficulty,
        marks,
        keywords: keywords.split(",").map(k => k.trim()),
      }

      const res = await postGenerate(payload)
      setResult(res)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <div>
        <label className="block text-sm font-medium">CO Code</label>
        <input
          className="mt-1 w-full border rounded px-3 py-2"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="CO1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Topic</label>
        <input
          className="mt-1 w-full border rounded px-3 py-2"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Database Normalization"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Bloom Level</label>
          <select
            className="mt-1 w-full border rounded px-3 py-2"
            value={bloom}
            onChange={(e) => setBloom(e.target.value)}
          >
            <option>Apply</option>
            <option>Analyze</option>
            <option>Understand</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Difficulty</label>
          <select
            className="mt-1 w-full border rounded px-3 py-2"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Marks</label>
          <input
            type="number"
            className="mt-1 w-full border rounded px-3 py-2"
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Keywords</label>
        <input
          className="mt-1 w-full border rounded px-3 py-2"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="1NF, 2NF, 3NF"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2.5 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Question"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {result && <GenerateResult data={result} />}
    </div>
  )
}

export default GenerateForm