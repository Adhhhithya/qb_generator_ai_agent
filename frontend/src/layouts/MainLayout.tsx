type Props = {
  children: React.ReactNode
  page: string
  setPage: (p: string) => void
}

import TopNavTabs from "../components/layout/TopNavTabs"

const MainLayout = ({ children, page, setPage }: Props) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Navigation */}
      <TopNavTabs activeTab={page} onTabChange={setPage} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}

export default MainLayout
