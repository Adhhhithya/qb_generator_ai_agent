import { useEffect, useState } from "react"
import { fetchQuestions } from "../api/questions"
import Stats from "../components/QuestionBank/Stats"
import Filters from "../components/QuestionBank/Filters"

const QuestionBankPage = () => {
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [bloom, setBloom] = useState("")
  const [difficulty, setDifficulty] = useState("")

  useEffect(() => {
    fetchQuestions().then((res) => {
      setQuestions(res.questions)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-slate-500">
        Loading questions…
      </div>
    )
  }

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(search.toLowerCase())

    const matchesBloom = bloom ? q.bloom_level === bloom : true
    const matchesDifficulty = difficulty
      ? q.difficulty === difficulty
      : true

    return matchesSearch && matchesBloom && matchesDifficulty
  })

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-slate-800 mb-1">Question Bank</h2>
      <p className="text-sm text-slate-500 mb-6">
        Browse and filter all generated questions
      </p>

      <Stats total={filteredQuestions.length} />

      <Filters
        search={search}
        bloom={bloom}
        difficulty={difficulty}
        setSearch={setSearch}
        setBloom={setBloom}
        setDifficulty={setDifficulty}
      />

      {filteredQuestions.length === 0 && (
        <div className="bg-white p-6 rounded-lg border text-center text-slate-500">
          No questions match the selected filters.
        </div>
      )}

      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition"
          >
            <p className="text-gray-800">{q.question}</p>

            <div className="mt-2 text-sm text-gray-500">
              CO: {q.code} · Bloom: {q.bloom_level} ·
              Difficulty: {q.difficulty} · Marks: {q.marks}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuestionBankPage