-- Adds analytics column to question_papers for coverage/bloom storage
-- Safe to run multiple times using IF NOT EXISTS

ALTER TABLE IF EXISTS question_papers
ADD COLUMN IF NOT EXISTS analytics JSONB DEFAULT '{}'::jsonb;
