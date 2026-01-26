import { useState } from "react"
import GeneratePage from "./pages/GeneratePage"
import QuestionBankPage from "./pages/QuestionBankPage"
import PapersListPage from "./pages/PapersListPage"
import DashboardPage from "./pages/DashboardPage"
import SettingsPage from "./pages/SettingsPage"
import ShellLayout from "./layouts/ShellLayout"

function App() {
  const [page, setPage] = useState("dashboard")

  // ShellLayout handles Sidebar, TopBar, and Content Areas
  return (
    <ShellLayout activePage={page} setPage={setPage}>
      {page === "dashboard" && <DashboardPage setPage={setPage} />}
      {page === "generate" && <GeneratePage />}

      {page === "drafts" && (
        <PapersListPage
          title="Draft Papers"
          description="Continue working on your saved question papers."
          status="DRAFT"
          onCreateNew={() => setPage("generate")}
        />
      )}

      {page === "finalized" && (
        <PapersListPage
          title="Finalized Papers"
          description="View and download your completed question papers."
          status="FINALIZED"
          onCreateNew={() => setPage("generate")}
        />
      )}

      {page === "history" && (
        <PapersListPage
          title="Paper History"
          description="All your created papers, including drafts and archived ones."
          status={undefined}
        />
      )}

      {page === "bank" && <QuestionBankPage />}
      {page === "settings" && <SettingsPage />}
    </ShellLayout>
  )
}

export default App
