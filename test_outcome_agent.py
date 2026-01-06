import asyncio
from app.models.outcome import CourseOutcome
from app.agents.outcome_interpreter import OutcomeInterpreterAgent


async def main():
    co = CourseOutcome(
        code="CO2",
        topic="Normalization",
        bloom_level="Apply",
        keywords=["1NF", "2NF", "3NF", "Functional Dependency"]
    )

    agent = OutcomeInterpreterAgent()
    result = await agent.interpret(co)

    print(result)


asyncio.run(main())
