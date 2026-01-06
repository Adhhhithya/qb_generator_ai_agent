type Props = {
  children: React.ReactNode
  page: string
  setPage: (p: string) => void
}

const MainLayout = ({ children, page, setPage }: Props) => {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-4">
        <h2 className="text-lg font-bold text-indigo-600 mb-6">
          Outcome QB
        </h2>

        <nav className="space-y-2">
          <button
            onClick={() => setPage("generate")}
            className={`w-full text-left px-3 py-2 rounded-md transition ${
              page === "generate"
                ? "bg-indigo-50 text-indigo-700 font-medium"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Generate Question
          </button>

          <button
            onClick={() => setPage("bank")}
            className={`w-full text-left px-3 py-2 rounded-md transition ${
              page === "bank"
                ? "bg-indigo-50 text-indigo-700 font-medium"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Question Bank
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export default MainLayout
