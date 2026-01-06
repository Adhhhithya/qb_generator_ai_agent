import asyncio
from app.agents.question_generator import QuestionGeneratorAgent

outcome_spec = {
    "normalized_bloom": "Apply",
    "refined_topic": "Applying Normal Forms (1NF, 2NF, 3NF)",
    "allowed_concepts": [
        "Functional Dependency",
        "1NF", "2NF", "3NF"
    ],
    "forbidden_concepts": [
        "BCNF", "4NF", "5NF"
    ],
    "cognitive_intent": "Apply normalization rules to decompose relations."
}


async def main():
    agent = QuestionGeneratorAgent()
    q = await agent.generate(
        outcome_spec=outcome_spec,
        marks=13,
        difficulty="Medium"
    )
    print(q)


asyncio.run(main())
