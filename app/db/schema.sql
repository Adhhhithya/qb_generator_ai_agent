
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
