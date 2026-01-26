-- Migration: Add subject grounding fields to question_papers table
-- This establishes the SINGLE SOURCE OF TRUTH for subject context

-- Add subject grounding columns
ALTER TABLE question_papers 
ADD COLUMN IF NOT EXISTS subject VARCHAR(255),
ADD COLUMN IF NOT EXISTS domain VARCHAR(255),
ADD COLUMN IF NOT EXISTS core_topics TEXT[],
ADD COLUMN IF NOT EXISTS forbidden_topics TEXT[];

-- Add comments for documentation
COMMENT ON COLUMN question_papers.subject IS 'LLM-extracted subject name (e.g., "Discrete Mathematics and Graph Theory") - SINGLE SOURCE OF TRUTH';
COMMENT ON COLUMN question_papers.domain IS 'Academic domain (e.g., "Computer Science", "Mathematics")';
COMMENT ON COLUMN question_papers.core_topics IS '6-10 core topics extracted from syllabus by LLM';
COMMENT ON COLUMN question_papers.forbidden_topics IS 'Topics that should NEVER appear in questions (prevents cross-subject contamination)';

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_papers_subject ON question_papers(subject);
CREATE INDEX IF NOT EXISTS idx_papers_domain ON question_papers(domain);
