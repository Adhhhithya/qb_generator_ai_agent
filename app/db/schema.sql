
CREATE TABLE course_outcomes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    topic TEXT NOT NULL,
    bloom_level VARCHAR(20) NOT NULL,
    keywords TEXT[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    outcome_id INTEGER REFERENCES course_outcomes(id),
    question_text TEXT NOT NULL,
    bloom_level VARCHAR(20) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    marks INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id),
    verdict VARCHAR(20) NOT NULL,
    audit_payload JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE question_papers (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    total_marks INTEGER NOT NULL,
    syllabus TEXT,
    status VARCHAR(20) DEFAULT 'DRAFT',
    generation_mode VARCHAR(20) DEFAULT 'hackathon',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE paper_sections (
    id SERIAL PRIMARY KEY,
    paper_id INTEGER NOT NULL REFERENCES question_papers(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    marks_per_question INTEGER NOT NULL,
    number_of_questions INTEGER NOT NULL,
    total_marks INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE paper_questions (
    id SERIAL PRIMARY KEY,
    section_id INTEGER NOT NULL REFERENCES paper_sections(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    question_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_paper_sections_paper_id ON paper_sections(paper_id);
CREATE INDEX idx_paper_questions_section_id ON paper_questions(section_id);