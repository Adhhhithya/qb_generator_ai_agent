import { useEffect, useState } from "react"
import { fetchQuestions } from "../api/questions"
import Stats from "../components/QuestionBank/Stats"
import Filters from "../components/QuestionBank/Filters"
import DetailedQuestionCard from "../components/QuestionBank/DetailedQuestionCard"

const QuestionBankPage = () => {
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [bloom, setBloom] = useState("")
  const [difficulty, setDifficulty] = useState("")

  useEffect(() => {
    fetchQuestions().then((res) => {
      // Ensure data shape matches QuestionProps
      const mapped = res.questions.map((q: any) => ({
        ...q,
        audit: q.audit || { status: 'pass' } // Fallback if no audit data
      }));
      setQuestions(mapped)
      setLoading(false)
    })
  }, [])

  const handleEdit = (id: number) => alert(`Edit question ${id}`)
  const handleRegenerate = (id: number) => {
    // Example of setting 'loading' state for a specific card could go here
    console.log(`Regenerating ${id}...`)
  }
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this question?")) {
      setQuestions(prev => prev.filter(q => q.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-slate-400 gap-3">
        <div className="w-8 h-8 border-4 border-brand-primary-100 border-t-brand-primary-500 rounded-full animate-spin"></div>
        <span className="font-medium animate-pulse">Loading questions...</span>
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
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Question Bank</h2>
        <p className="text-slate-500">
          Browse, manageable, and audit your generated questions.
        </p>
      </div>

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
        <div className="bg-slate-50 p-12 rounded-2xl border-2 border-dashed border-slate-200 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">No questions found</h3>
          <p className="text-slate-500">Try adjusting your filters or generate new questions.</p>
        </div>
      )}

      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <DetailedQuestionCard
            key={q.id}
            question={{
              id: q.id,
              text: q.question,
              bloom: q.bloom_level || 'Apply',
              difficulty: q.difficulty || 'Medium',
              code: q.code || 'CO1',
              marks: q.marks,
              audit: q.audit
            }}
            onEdit={handleEdit}
            onRegenerate={handleRegenerate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}

export default QuestionBankPage