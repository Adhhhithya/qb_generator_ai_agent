type Props = {
  data: any
}

const GenerateResult = ({ data }: Props) => {
  return (
    <div className="mt-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
      <h3 className="text-lg font-semibold">
        Result
      </h3>

      <span
        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
          data.status === "ACCEPTED"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {data.status}
      </span>

      {data.question && (
        <>
          <p className="text-gray-700">
            {data.question.question}
          </p>

          <div className="text-sm text-gray-500">
            Bloom: {data.question.bloom_level} ·
            Difficulty: {data.question.difficulty} ·
            Marks: {data.question.marks}
          </div>
        </>
      )}

      <div className="text-sm">
        <span className="font-medium">Audit:</span>{" "}
        {data.audit?.final_verdict}
      </div>
    </div>
  )
}

export default GenerateResult