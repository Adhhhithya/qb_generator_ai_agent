from app.core.pipeline import QuestionPipeline
from app.models.outcome import CourseOutcome

pipeline = QuestionPipeline()


async def run_pipeline(
    marks: int, 
    syllabus: str | None, 
    section_name: str,
    force_question_type: str | None = None,
    avoid_questions: list[str] | None = None,
    # Subject grounding context (single source of truth)
    subject: str | None = None,
    domain: str | None = None,
    core_topics: list[str] | None = None,
    forbidden_topics: list[str] | None = None,
):
    # Build a minimal course outcome context
    # OPTIMIZATION: Use core_topics (clean keywords) instead of raw syllabus
    # This reduces prompt size from 5000+ chars to ~200 chars
    topics_str = ", ".join(core_topics[:5]) if core_topics else "General"
    
    co = CourseOutcome(
        code=f"PAPER-SECTION-{section_name}",
        topic=topics_str,  # ✅ SHORT topic list instead of raw syllabus
        bloom_level="Apply",
        keywords=core_topics[:5] if core_topics else [],
    )

    return await pipeline.run(
        course_outcome=co,
        marks=marks,
        difficulty="Medium",
        section_name=section_name,
        force_question_type=force_question_type,
        avoid_questions=avoid_questions or [],
        # Pass subject grounding context
        subject=subject,
        domain=domain,
        core_topics=core_topics or [],
        forbidden_topics=forbidden_topics or [],
    )
