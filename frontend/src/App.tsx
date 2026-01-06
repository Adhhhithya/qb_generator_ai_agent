import { useState } from "react"
import GeneratePage from "./pages/GeneratePage"
import QuestionBankPage from "./pages/QuestionBankPage"
import MainLayout from "./layouts/MainLayout"

function App() {
  const [page, setPage] = useState("generate")

  return (
    <MainLayout page={page} setPage={setPage}>
      {page === "generate" && <GeneratePage />}
      {page === "bank" && <QuestionBankPage />}
    </MainLayout>
  )
}

export default App
