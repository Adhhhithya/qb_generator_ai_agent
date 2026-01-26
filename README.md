# Outcome-Aligned Question Bank Generator and Auditor

This repository contains a full-stack EdTech system designed to generate, audit, store, and manage outcome-aligned assessment questions.
The system enforces Bloom’s Taxonomy alignment through a rule-based audit pipeline and exposes both generation and query workflows via a modern web interface.

The project is intended to demonstrate a production-oriented approach to AI-assisted educational content generation, with a strong emphasis on correctness, auditability, and system design rather than raw LLM output.

---

## Problem Statement

In many educational settings, assessment questions are created manually with limited verification of:

* Alignment with Course Outcomes (COs)
* Correct Bloom’s Taxonomy level
* Concept scope compliance
* Consistency across assessments

This project addresses that gap by introducing an automated, auditable pipeline that ensures every generated question satisfies predefined academic constraints before being persisted or presented to users.

---

## System Overview

The system is composed of three major layers:

### 1. AI & Rule-Based Pipeline

* Interprets outcome specifications
* Generates candidate questions using an LLM
* Audits questions against Bloom’s Taxonomy and concept constraints
* Automatically retries generation when violations occur
* Rejects non-compliant questions deterministically

### 2. Backend API

* Built using FastAPI
* Exposes endpoints for:

	* Question generation and auditing
	* Querying the stored question bank
* Persists only accepted questions
* Maintains a full audit trail for traceability

### 3. Frontend Dashboard

* Built with React, TypeScript, and Tailwind CSS
* Provides a dashboard-style interface for:

	* Generating questions interactively
	* Viewing audit outcomes
	* Browsing and filtering the question bank
* Designed to resemble internal academic/admin tools rather than a public-facing app

---

## Core Features

* Outcome-aligned question generation
* Bloom’s Taxonomy enforcement
* Rule-first validation (LLM output is never trusted blindly)
* Auto-rewrite loop for failed generations
* Persistent question bank with audit logs
* Search and filter functionality
* Dashboard-style UI for usability

---

## Integration Architecture

The frontend and backend are loosely coupled via a RESTful API.

### Connection Details
* **Backend Origin**: `http://127.0.0.1:8000` (FastAPI default)
* **Frontend Origin**: `http://localhost:5173` (Vite default)
* **Protocol**: HTTP/JSON

### Configuration
1. **Frontend Client**: The API base URL is defined in `frontend/src/api/client.ts`.
   ```typescript
   const API_BASE = "http://127.0.0.1:8000"
   ```
2. **CORS (Cross-Origin Resource Sharing)**: The backend is configured to accept requests from the frontend origin. This is handled in `app/main.py` using `CORSMiddleware`.

### Data Flow
1. **Request**: Frontend components (e.g., `usePaperGenerator` hook) call functions in `src/api/`.
2. **Execution**: TypeScript functions use `fetch` to send JSON payloads to `http://127.0.0.1:8000/<endpoint>`.
3. **Response**: Backend processes the request (generating questions, accessing DB) and returns JSON.
4. **State Update**: Frontend updates React state (e.g., questions list) based on the response.

## Technology Stack

### Backend

* Python
* FastAPI
* PostgreSQL
* SQLAlchemy
* Groq LLM API

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Infrastructure & Tooling

* REST-based API architecture
* Environment-based configuration
* Git-based version control

---

## API Endpoints

### POST `/generate`

Generates and audits a question based on the provided outcome specification.

**Request payload (example):**

```json
{
	"code": "CO1",
	"topic": "Database Normalization",
	"bloom_level": "Apply",
	"keywords": ["1NF", "2NF", "3NF"],
	"marks": 13,
	"difficulty": "Medium"
}
```

**Behavior:**

* Runs the full AI + audit pipeline
* Retries generation if Bloom alignment fails
* Persists the question only if accepted

---

### GET `/questions`

Retrieves stored questions from the question bank.

**Supports filtering by:**

* Course Outcome code
* Bloom level
* Difficulty

---

## Data Model Overview

The backend persists data across three main tables:

* `course_outcomes` — stores outcome metadata
* `questions` — stores accepted questions only
* `audit_logs` — stores audit decisions and reasoning

Rejected questions are intentionally not stored.

---

## Project Structure

```text
outcome-qb-ai/
├── app/                 # FastAPI backend
│   ├── api/
│   ├── agents/
│   ├── core/
│   ├── db/
│   └── main.py
├── frontend/            # React dashboard
│   ├── src/
│   ├── index.html
│   └── vite.config.ts
├── .env.example
├── .gitignore
└── README.md
```

---

## Running the Project Locally

### Backend

```bash
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Design Philosophy

* Correctness over creativity
* Rule-based validation over blind trust in LLMs
* Deterministic behavior wherever possible
* Clear separation of concerns
* Production-oriented structure even in a prototype setting

This project intentionally avoids treating LLMs as authoritative and instead uses them as assistants within a controlled system.

---

## Intended Use Cases

* Academic assessment preparation
* Internal question bank tooling
* EdTech platform prototyping
* Demonstration of AI governance patterns
* Full-stack system design showcase

---

## Future Enhancements

* Bloom coverage analytics and charts
* Export functionality (CSV / PDF)
* Authentication and role-based access
* Pagination and sorting at scale
* Deployment automation

---

## License

This project is intended for educational and demonstration purposes.

