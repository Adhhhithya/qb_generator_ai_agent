type Props = {
  bloom: string
  difficulty: string
  search: string
  setBloom: (v: string) => void
  setDifficulty: (v: string) => void
  setSearch: (v: string) => void
}

const Filters = ({
  bloom,
  difficulty,
  search,
  setBloom,
  setDifficulty,
  setSearch,
}: Props) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4">
      <input
        type="text"
        placeholder="Search question text..."
        className="border px-3 py-2 rounded w-64"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="border px-3 py-2 rounded"
        value={bloom}
        onChange={(e) => setBloom(e.target.value)}
      >
        <option value="">All Bloom Levels</option>
        <option value="Apply">Apply</option>
        <option value="Analyze">Analyze</option>
        <option value="Understand">Understand</option>
      </select>

      <select
        className="border px-3 py-2 rounded"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="">All Difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
    </div>
  )
}

export default Filters
