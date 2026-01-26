BLOOM_VERBS = {
    "Apply": ["apply", "demonstrate", "use", "solve", "implement"],
    "Analyze": ["analyze", "compare", "differentiate", "examine", "justify"],
    "Understand": ["explain", "describe", "summarize"],
}

VAGUE_TERMS = [
    "discuss",
    "elaborate",
    "briefly explain",
    "write a note",
]


def score_question(question: str, bloom_level: str) -> int:
    q_lower = question.lower()
    score = 0

    # 1. Bloom verb presence (30)
    verbs = BLOOM_VERBS.get(bloom_level, [])
    if any(v in q_lower for v in verbs):
        score += 30

    # 2. Length heuristic (25)
    length = len(question.split())
    if 20 <= length <= 60:
        score += 25
    elif 10 <= length < 20 or 60 < length <= 80:
        score += 15

    # 3. Structural intent cues (25)
    if any(x in q_lower for x in ["how", "why", "based on", "given", "using"]):
        score += 25

    # 4. Vague wording penalty (-20)
    if any(v in q_lower for v in VAGUE_TERMS):
        score -= 20

    return max(score, 0)
