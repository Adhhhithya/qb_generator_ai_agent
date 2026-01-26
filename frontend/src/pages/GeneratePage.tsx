import GenerateWizard from "../components/Generate/GenerateWizard"

const GeneratePage = () => {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Paper Generator Wizard
        </h2>
        <p className="text-slate-500">
          Define exam details, configure sections, and generate a complete Question Paper.
        </p>
      </div>

      <GenerateWizard />
    </div>
  )
}

export default GeneratePage