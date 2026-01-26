-- Migration: Add paper_metadata column to question_papers table
-- Stores institution & exam details (NOT sent to LLM)

-- Add paper_metadata column as JSONB for flexible storage
ALTER TABLE question_papers 
ADD COLUMN IF NOT EXISTS paper_metadata JSONB;

-- Add comment for documentation
COMMENT ON COLUMN question_papers.paper_metadata IS 'Institution & Exam metadata (institution_name, department, course_title, exam_duration, max_marks) - stored but NOT sent to LLM';

-- Optional: Create GIN index for JSONB queries if needed
-- CREATE INDEX IF NOT EXISTS idx_papers_metadata ON question_papers USING GIN (paper_metadata);
