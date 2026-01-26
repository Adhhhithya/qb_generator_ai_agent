# Frontend-Backend Architecture: Outcome-Aligned Question Bank AI

## Overview

This is a full-stack application for generating outcome-aligned exam questions using AI. The system consists of:

- **Frontend**: React + TypeScript + Vite (running on `http://127.0.0.1:5173`)
- **Backend**: FastAPI + Python (running on `http://127.0.0.1:8000`)
- **Database**: PostgreSQL via SQLAlchemy ORM
- **AI Integration**: Groq API for LLM operations

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React/TypeScript)                 │
│                         Port: 5173                               │
├─────────────────────────────────────────────────────────────────┤
│  Pages:                                                           │
│  • DashboardPage (Statistics & Analytics)                        │
│  • GeneratePage (Question Generation Wizard)                     │
│  • QuestionBankPage (Browse/Manage Questions)                    │
│  • PapersListPage (Draft/Finalized Papers)                       │
│  • SettingsPage (Configuration)                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP/JSON
                           │ CORS Enabled
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI)                             │
│                         Port: 8000                               │
├─────────────────────────────────────────────────────────────────┤
│  API Routers:                                                    │
│  ├─ /health (Health Check)                                       │
│  ├─ /generate (Question Generation)                              │
│  ├─ /questions (Question CRUD & Retrieval)                       │
│  ├─ /papers (Paper Management)                                   │
│  ├─ /analytics (Statistics & Coverage)                           │
│  ├─ /dashboard (Dashboard Stats)                                 │
│  ├─ /export (CSV/PDF Export)                                     │
│  ├─ /syllabus (Syllabus Upload & Processing)                     │
│  └─ /audit (Question Quality Auditing)                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │ SQLAlchemy ORM
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                         │
├─────────────────────────────────────────────────────────────────┤
│  Tables:                                                          │
│  • course_outcomes (Learning Objectives)                         │
│  • questions (Generated Questions)                               │
│  • question_papers (Exam Papers)                                 │
│  • paper_sections (Paper Sections)                               │
│  • paper_questions (Question Selection & Order)                  │
│  • audit_logs (Quality Audit History)                            │
└─────────────────────────────────────────────────────────────────┘
```

## CORS Configuration

The backend enables CORS for frontend development:

```python
# Backend: app/main.py
CORSMiddleware configured with:
- allow_origins: ["http://localhost:5173", "http://127.0.0.1:5173"]
- allow_credentials: True
- allow_methods: ["*"]
- allow_headers: ["*"]
```

## API Client Setup

All frontend API calls use a centralized base URL:

```typescript
// Frontend: frontend/src/api/client.ts
const API_BASE = "http://127.0.0.1:8000"
```

## Endpoint Connections

### 1. **Dashboard Module**

**Frontend:** `DashboardPage` → `fetchDashboardStats()`, `fetchRecentPapers()`

**Backend:** `GET /dashboard/stats`, `GET /dashboard/recent-papers`

**Database Tables:** `question_papers`, `questions`

**Data Flow:**
```
Dashboard Component
    ↓
  useEffect() → fetchDashboardStats()
    ↓
  API Call: GET /dashboard/stats
    ↓
  Backend: /dashboard/stats endpoint
    ↓
  Query Database:
    - Count total papers
    - Count finalized papers
    - Average quality scores
    - Bloom & Difficulty distributions
    ↓
  Return JSON Response
    ↓
  Update React State
    ↓
  Render DashboardStats Component
```

**Response Schema:**
```json
{
  "total_papers": 10,
  "finalized_papers": 7,
  "avg_quality_score": 78.5,
  "rejected_attempts": 2,
  "bloom_distribution": {
    "Remember": 15,
    "Understand": 25,
    "Apply": 18
  },
  "difficulty_distribution": {
    "Easy": 10,
    "Medium": 28,
    "Hard": 20
  }
}
```

---

### 2. **Question Generation Module**

**Frontend:** `GeneratePage` → `GenerateWizard` component

**Backend:** `POST /generate`

**Database Tables:** `course_outcomes`, `questions`, `audit_logs`

**Data Flow:**
```
GenerateWizard Form
    ↓
  User Input:
    - Bloom Level
    - Topic/Keywords
    - Difficulty Level
    - Marks
    ↓
  postGenerate(payload)
    ↓
  API Call: POST /generate
    ↓
  Backend: /generate endpoint
    ↓
  Process Request:
    1. Parse Bloom Levels (handle list or single)
    2. Create CourseOutcome object
    3. Run QuestionPipeline
    4. Check for duplicate questions
    5. Calculate quality scores
    6. Perform audit checks
    ↓
  Database Operations:
    - Store CourseOutcome
    - Store Question
    - Store AuditLog
    ↓
  Return JSON Response:
    - status: "ACCEPTED" | "REJECTED"
    - reason: If rejected (duplicate, low quality)
    - question_id: If accepted
    ↓
  Update Frontend State
```

**Request Schema:**
```json
{
  "code": "CS101",
  "topic": "Data Structures",
  "bloom_level": "Apply",
  "keywords": ["arrays", "sorting"],
  "marks": 5,
  "difficulty": "Medium"
}
```

**Response Schema:**
```json
{
  "status": "ACCEPTED",
  "question_id": 42,
  "question": "Given an array of integers...",
  "bloom_level": "Apply",
  "difficulty": "Medium",
  "quality_score": 85
}
```

---

### 3. **Question Bank Module**

**Frontend:** `QuestionBankPage` → `fetchQuestions()`

**Backend:** `GET /questions`

**Database Tables:** `questions`, `course_outcomes`

**Data Flow:**
```
QuestionBankPage
    ↓
  useEffect() → fetchQuestions()
    ↓
  API Call: GET /questions?code=CS101&bloom_level=Apply&difficulty=Medium&limit=10
    ↓
  Backend: /questions endpoint
    ↓
  Query Database:
    - Filter by code (optional)
    - Filter by bloom_level (optional)
    - Filter by difficulty (optional)
    - Limit results
    ↓
  Join with CourseOutcome table
    ↓
  Return QuestionListResponse
    ↓
  Update React State
    ↓
  Render DetailedQuestionCard components with:
    - Question text
    - Bloom level
    - Difficulty
    - Marks
    - Quality score
    - Audit status
```

**Query Parameters:**
```
GET /questions?code=CS101&bloom_level=Apply&difficulty=Medium&limit=10
```

**Response Schema:**
```json
{
  "questions": [
    {
      "id": 1,
      "code": "CS101",
      "question": "What is the time complexity...",
      "bloom_level": "Apply",
      "difficulty": "Medium",
      "marks": 5,
      "quality_score": 85,
      "topics_used": ["arrays", "sorting"],
      "audit": {
        "status": "pass",
        "verdict": "Question meets quality standards"
      }
    }
  ],
  "total": 1,
  "limit": 10
}
```

---

### 4. **Paper Management Module**

**Frontend:** `PapersListPage`, `CreatePaperPage` → Multiple paper API calls

**Backend:** 
- `POST /papers` (Create)
- `GET /papers` (List)
- `GET /papers/{id}` (Get specific)
- `PUT /papers/{id}` (Update)
- `DELETE /papers/{id}` (Delete)
- `POST /papers/{id}/regenerate` (Regenerate question)

**Database Tables:** `question_papers`, `paper_sections`, `paper_questions`, `questions`

**Data Flow - Paper Creation:**
```
CreatePaperPage Form
    ↓
  User Input:
    - Paper Title
    - Sections with questions count per section
    - Total marks
    - Metadata (institution, department, etc.)
    ↓
  POST /papers
    ↓
  Backend: Create QuestionPaper record
    ↓
  For each section:
    1. Create PaperSection record
    2. Select questions matching section criteria
    3. Create PaperQuestion records with order
    ↓
  Calculate Analytics:
    - Syllabus coverage %
    - Bloom distribution
    ↓
  Return paper_id with all sections and questions
    ↓
  Frontend stores paper state
```

**Request Schema:**
```json
{
  "title": "CS101 Midterm Exam",
  "total_marks": 50,
  "metadata": {
    "institution_name": "XYZ University",
    "course_title": "Data Structures",
    "exam_duration": "2 hours"
  },
  "sections": [
    {
      "section": "Part A",
      "marks_per_question": 2,
      "number_of_questions": 5
    }
  ]
}
```

**Response Schema:**
```json
{
  "paper_id": 10,
  "title": "CS101 Midterm Exam",
  "status": "DRAFT",
  "total_marks": 50,
  "sections": [
    {
      "id": 1,
      "section": "Part A",
      "marks_per_question": 2,
      "number_of_questions": 5,
      "questions": [
        {
          "question_id": 42,
          "order": 1,
          "text": "What is...",
          "bloom": "Apply",
          "difficulty": "Medium",
          "marks": 2
        }
      ]
    }
  ],
  "analytics": {
    "coverage_percent": 75,
    "bloom_distribution": {"Apply": 5}
  }
}
```

---

### 5. **Syllabus Upload & Processing Module**

**Frontend:** `GenerateWizard` → `uploadSyllabus()`

**Backend:** `POST /syllabus/upload`

**Data Flow:**
```
Upload Form (file input)
    ↓
  User selects syllabus file (PDF/DOCX)
    ↓
  uploadSyllabus(file: File)
    ↓
  Create FormData with file
    ↓
  API Call: POST /syllabus/upload (multipart/form-data)
    ↓
  Backend: /syllabus/upload endpoint
    ↓
  Detect file type (PDF or DOCX)
    ↓
  Extract text:
    - If PDF: Use PyPDF2
    - If DOCX: Use python-docx
    ↓
  Normalize extracted text
    ↓
  Return SyllabusExtractResponse
    ↓
  Frontend displays extracted text for review
```

**Response Schema:**
```json
{
  "raw_text": "Chapter 1: Introduction to Data Structures...",
  "file_name": "syllabus.pdf",
  "file_size_kb": 245.5,
  "extraction_method": "PDF"
}
```

---

### 6. **Analytics Module**

**Frontend:** `DashboardAnalyticsPreview` → `fetchAnalytics()`

**Backend:** `GET /analytics/summary`

**Database Tables:** `questions`

**Data Flow:**
```
Analytics Component
    ↓
  useEffect() → fetchAnalytics()
    ↓
  API Call: GET /analytics/summary
    ↓
  Backend Query:
    - Count total questions
    - Group by bloom_level
    - Group by difficulty
    ↓
  Return aggregated statistics
    ↓
  Display in charts/graphs
```

**Response Schema:**
```json
{
  "total_questions": 125,
  "bloom_distribution": {
    "Remember": 15,
    "Understand": 32,
    "Apply": 45,
    "Analyze": 20,
    "Evaluate": 10,
    "Create": 3
  },
  "difficulty_distribution": {
    "Easy": 30,
    "Medium": 65,
    "Hard": 30
  }
}
```

---

### 7. **Export Module**

**Frontend:** Export button in QuestionBank/Papers

**Backend:** 
- `GET /export/questions/csv` (Export filtered questions as CSV)
- `GET /export/papers/pdf` (Export paper as PDF)

**Data Flow:**
```
User clicks Export Button
    ↓
  API Call with filters:
    - /export/questions/csv?bloom=Apply&difficulty=Medium
    ↓
  Backend Query:
    - Fetch questions matching filters
    - Format as CSV
    ↓
  Return file with Content-Disposition header
    ↓
  Browser downloads file
```

---

## Database Models Overview

### CourseOutcome
```python
- id: Primary Key
- code: String (e.g., "CS101")
- topic: Text
- bloom_level: String
- keywords: Array
- created_at: Timestamp
```

### Question
```python
- id: Primary Key
- outcome_id: Foreign Key → CourseOutcome
- question_text: Text
- bloom_level: String
- difficulty: String
- marks: Integer
- quality_score: Integer (0-100)
- difficulty_drift: JSON
- topics_used: Array
- created_at: DateTime
```

### QuestionPaper
```python
- id: Primary Key
- title: String
- total_marks: Integer
- syllabus: Text
- paper_metadata: JSON (institution, dept, course, duration)
- analytics: JSON (coverage %, bloom distribution)
- subject: String
- domain: String
- core_topics: Array
- forbidden_topics: Array
- status: String ("DRAFT" or "FINALIZED")
- generation_mode: String ("hackathon" or "strict")
```

### PaperSection
```python
- id: Primary Key
- paper_id: Foreign Key → QuestionPaper
- section: String (e.g., "Part A")
- marks_per_question: Integer
- number_of_questions: Integer
```

### PaperQuestion
```python
- id: Primary Key
- paper_section_id: Foreign Key → PaperSection
- question_id: Foreign Key → Question
- order: Integer
```

### AuditLogDB
```python
- id: Primary Key
- question_id: Foreign Key → Question
- verdict: String
- audit_payload: JSON
- created_at: Timestamp
```

---

## Technology Stack

### Frontend
```
React 18.3.1
TypeScript 5.9.3
Vite 7.3.1
Tailwind CSS 4.1.18
Framer Motion 11.15.0
Lucide React 0.562.0 (Icons)
```

### Backend
```
FastAPI (Web Framework)
uvicorn (ASGI Server)
SQLAlchemy (ORM)
Pydantic (Data Validation)
psycopg2-binary (PostgreSQL Driver)
Groq (LLM API)
reportlab (PDF Generation)
PyPDF2 (PDF Extraction)
python-docx (DOCX Extraction)
```

---

## Request/Response Flow Example

### Complete Example: Generate a Question

1. **User Action**: Fill form in GeneratePage and click "Generate"

2. **Frontend Preparation**:
   ```typescript
   const payload = {
     code: "CS101",
     topic: "Arrays",
     bloom_level: "Apply",
     keywords: ["sorting", "indexing"],
     marks: 5,
     difficulty: "Medium"
   }
   ```

3. **HTTP Request**:
   ```
   POST http://127.0.0.1:8000/generate
   Headers:
     - Content-Type: application/json
     - (CORS automatically handled)
   Body: JSON payload
   ```

4. **Backend Processing**:
   - Parse request with Pydantic model `GenerateQuestionRequest`
   - Instantiate `QuestionPipeline`
   - Call LLM (Groq API) with course outcome
   - Validate response
   - Check for duplicates (similarity threshold: 0.85)
   - Score question quality
   - Store in database

5. **HTTP Response**:
   ```json
   {
     "status": "ACCEPTED",
     "question_id": 42,
     "question": "...",
     "bloom_level": "Apply",
     "difficulty": "Medium",
     "marks": 5,
     "quality_score": 87
   }
   ```

6. **Frontend Update**:
   - Store response in React state
   - Display success message
   - Update question count
   - Add to question list

---

## Key Features Enabled by Frontend-Backend Integration

1. **Real-time Question Generation**: Frontend sends requirements → Backend generates using AI → Returns validated question

2. **Quality Assurance**: Backend performs duplicate checking, quality scoring, and audit logging

3. **Analytics & Reporting**: Backend aggregates database statistics for dashboard visualization

4. **Document Processing**: Frontend uploads syllabus → Backend extracts text → Returns for LLM grounding

5. **Paper Management**: Complex multi-step creation with section-based question selection

6. **Export Capabilities**: Convert questions and papers to CSV/PDF format

7. **Audit Trail**: All question generation attempts logged with verdicts

---

## Development Setup

### Start Backend
```bash
cd outcome-qb-ai
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Start Frontend
```bash
cd frontend
npm run dev
```

Frontend will be available at: `http://127.0.0.1:5173`
Backend will be available at: `http://127.0.0.1:8000`

---

## Error Handling

### Frontend Error Handling
- All fetch calls check `res.ok`
- Throw errors with descriptive messages
- Components handle errors gracefully with UI feedback

### Backend Error Handling
- Pydantic validation errors return 422
- HTTPException for business logic errors
- Database errors wrapped with meaningful messages

### Common Error Scenarios
```
1. Duplicate Question Detected
   Status: REJECTED
   Reason: Similarity score exceeded threshold

2. Low Quality Score
   Status: REJECTED
   Reason: Question failed quality audit

3. Invalid File Format
   Status: 400
   Reason: Only PDF and DOCX supported

4. Database Connection Error
   Status: 500
   Reason: Internal server error
```

---

## Summary

The Outcome-Aligned Question Bank AI uses a modern, decoupled architecture where:

- **Frontend** (React/Vite) handles UI, user input, and state management
- **Backend** (FastAPI) provides RESTful APIs, business logic, AI integration, and database access
- **Communication** happens via HTTP/JSON with CORS enabled for local development
- **Database** (PostgreSQL) stores all domain entities and audit logs
- **AI Processing** leverages Groq API through backend-only integration

This architecture enables scalability, maintainability, and clear separation of concerns.
