const API_URL = "http://127.0.0.1:8000";

// --- Interfaces ---

export interface PaperQuestion {
  order: number;
  question_id: number;
  text: string;
  bloom: string;
  difficulty: string;
  marks: number;
  quality_score?: number;
}

export interface PaperSection {
  id?: number;
  section: string; // Backend sends "section" in GET, "name" in POST response (handling both)
  name?: string;
  marks_per_question: number;
  number_of_questions: number;
  total_marks: number;
  questions?: PaperQuestion[];
}

export interface PaperMetadata {
  institution_name?: string;
  department?: string;
  course_title?: string;
  exam_duration?: string;
  max_marks?: number;
}

export interface Paper {
  paper_id: number;
  title: string;
  status: string; // DRAFT, FINALIZED, GENERATING (CustomFE)
  total_marks: number;
  created_at?: string;
  syllabus?: string;
  subject?: string;
  domain?: string;
  metadata?: PaperMetadata;
  sections: PaperSection[];
  analytics?: {
    coverage_percent?: number;
    bloom_distribution?: Record<string, number>;
  };
}

export interface PaperCreateData {
  title: string;
  total_marks: number;
  syllabus: string;
  institution_name?: string;
  department?: string;
  course_title?: string;
  exam_duration?: string;
  max_marks?: number;
}

export interface SectionCreateData {
  name: string;
  marks_per_question: number;
  number_of_questions: number;
}

export interface GenerationProgressItem {
  section: string;
  status: string;
  questions_generated?: number;
  bloom_level?: string;
  note?: string;
}

export interface GenerationResponse {
  paper_id: number;
  status: string; // SUCCESS or DRAFT (partial)
  progress: GenerationProgressItem[];
  warnings?: string[];
  total_llm_calls: number;
}

// --- API Functions ---

export async function fetchPaper(paperId: number): Promise<Paper> {
  const response = await fetch(`${API_URL}/papers/${paperId}`);
  if (!response.ok) throw new Error("Failed to fetch paper");
  return response.json();
}

export async function createPaper(data: PaperCreateData): Promise<{ paper_id: number; status: string }> {
  const response = await fetch(`${API_URL}/papers/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create paper");
  return response.json();
}

export async function addSection(paperId: number, data: SectionCreateData): Promise<PaperSection> {
  const response = await fetch(`${API_URL}/papers/${paperId}/sections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to add section" }));
    throw new Error(errorData.detail || "Failed to add section");
  }
  return response.json();
}

export async function deleteSection(paperId: number, sectionId: number): Promise<{ status: string }> {
  const response = await fetch(`${API_URL}/papers/${paperId}/sections/${sectionId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete section");
  return response.json();
}

export async function generatePaper(paperId: number): Promise<GenerationResponse> {
  // This can be a long-running request (up to 2 mins for full paper)
  // Ensure your frontend timeout handling accounts for this, or use polling if backend supported it (currently simple async)
  const response = await fetch(`${API_URL}/papers/${paperId}/generate`, {
    method: "POST",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Generation failed" }));
    throw new Error(errorData.detail || "Failed to generate paper");
  }

  return response.json();
}

export async function regenerateQuestion(
  paperId: number,
  questionId: number
): Promise<{ success: boolean; old_question_id?: number; new_question?: any; error?: string }> {
  const response = await fetch(
    `${API_URL}/papers/${paperId}/questions/${questionId}/regenerate`,
    { method: "POST" }
  );
  return response.json();
}

export async function getQuestionAlternatives(
  paperId: number,
  questionId: number
): Promise<{ alternatives?: Array<{ id: number; text: string; quality_score?: number }>; error?: string }> {
  const response = await fetch(
    `${API_URL}/papers/${paperId}/questions/${questionId}/alternatives`
  );
  return response.json();
}

export async function replaceQuestion(
  paperId: number,
  questionId: number,
  replacementId: number
): Promise<{ success: boolean; old_question_id?: number; new_question?: any; error?: string }> {
  const response = await fetch(
    `${API_URL}/papers/${paperId}/questions/${questionId}/replace?replacement_id=${replacementId}`,
    { method: "POST" }
  );
  return response.json();
}

export async function finalizePaper(
  paperId: number
): Promise<{ paper_id: number; status: string }> {
  const response = await fetch(`${API_URL}/papers/${paperId}/finalize`, {
    method: "POST",
  });
  return response.json();
}

export async function archivePaper(
  paperId: number
): Promise<{ paper_id: number; status: string }> {
  const response = await fetch(`${API_URL}/papers/${paperId}/archive`, {
    method: "POST",
  });
  return response.json();
}

export async function listPapers(status?: string): Promise<{ papers: Paper[] }> {
  const query = status ? `?status=${status}` : "";
  const response = await fetch(`${API_URL}/papers/${query}`);
  if (!response.ok) throw new Error("Failed to fetch papers");
  return response.json();
}
