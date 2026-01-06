import asyncio
from app.agents.alignment_auditor import AlignmentAuditorAgent

question_obj = {
    "question": "Apply Third Normal Form (3NF) to normalize the given relation schema based on the provided functional dependencies. Clearly justify each step of decomposition.",
    "bloom_level": "Apply",
    "difficulty": "Medium",
    "marks": 13
}

outcome_spec = {
    "normalized_bloom": "Apply",
    "allowed_concepts": ["1NF", "2NF", "3NF", "Functional Dependency"],
    "forbidden_concepts": ["BCNF", "4NF", "5NF"]
}

async def main():
    auditor = AlignmentAuditorAgent()
    result = await auditor.audit(question_obj, outcome_spec)
    print(result)

asyncio.run(main())
