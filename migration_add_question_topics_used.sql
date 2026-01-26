-- Adds topics_used column to questions for syllabus topic tracking
-- Safe to run multiple times using IF NOT EXISTS

ALTER TABLE IF EXISTS questions
ADD COLUMN IF NOT EXISTS topics_used TEXT[] DEFAULT '{}';
