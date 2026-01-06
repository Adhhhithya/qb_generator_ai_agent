import GenerateForm from "../components/Generate/GenerateForm"

const GeneratePage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-slate-800 mb-1">
        Generate Question
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Create outcome-aligned, Bloom-verified questions
      </p>

      <GenerateForm />
    </div>
  )
}

export default GeneratePage