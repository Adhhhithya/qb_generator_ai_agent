type Props = {
  total: number
}

const Stats = ({ total }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
        <div className="text-sm text-gray-500">Total Questions</div>
        <div className="text-2xl font-bold text-indigo-600">{total}</div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
        <div className="text-sm text-gray-500">Course Outcomes</div>
        <div className="text-2xl font-bold text-gray-700">-</div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
        <div className="text-sm text-gray-500">Avg Difficulty</div>
        <div className="text-2xl font-bold text-gray-700">-</div>
      </div>
    </div>
  )
}

export default Stats
