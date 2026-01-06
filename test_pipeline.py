import asyncio
from app.core.pipeline import QuestionPipeline
from app.models.outcome import CourseOutcome


async def main():
    pipeline = QuestionPipeline()

    co = CourseOutcome(
        code="CO2",
        topic="Normalization",
        bloom_level="Apply",
        keywords=["1NF", "2NF", "3NF", "Functional Dependency"]
    )

    result = await pipeline.run(
        course_outcome=co,
        marks=13,
        difficulty="Medium"
    )

    print("\nFINAL OUTPUT:\n")
    print(result)


asyncio.run(main())
