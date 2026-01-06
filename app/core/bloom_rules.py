
BLOOM_VERBS = {
    "Remember": [
        "define", "list", "recall", "identify", "state"
    ],
    "Understand": [
        "explain", "describe", "summarize", "interpret"
    ],
    "Apply": [
        "apply", "solve", "demonstrate", "use", "implement"
    ],
    "Analyze": [
        "analyze", "compare", "differentiate", "examine"
    ],
    "Evaluate": [
        "evaluate", "justify", "critique", "assess"
    ],
    "Create": [
        "design", "develop", "formulate", "construct"
    ]
}


def is_verb_allowed(bloom_level: str, question_text) -> bool:
    if not isinstance(question_text, str):
        return False

    verbs = BLOOM_VERBS.get(bloom_level, [])
    question_lower = question_text.lower()

    return any(verb in question_lower for verb in verbs)
