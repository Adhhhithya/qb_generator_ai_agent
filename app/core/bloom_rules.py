"""
Bloom Level Verb Enforcement and Validation

This module implements strict verb gating for Bloom levels.
Questions must start with allowed verbs or they are rejected.
"""

from app.core.generation_safety import BLOOM_ALLOWED_VERBS, FORBIDDEN_TOPICS


def is_verb_allowed(bloom_level: str, question_text: str) -> bool:
    """
    STRICT VERB GATING: Question must START with allowed verb.
    
    NOT just contain the verb - must START with it.
    
    Examples:
    VALID: "Define an eigenvalue" - starts with "define" (Remember)
    VALID: "Explain how..." - starts with "explain" (Understand)
    INVALID: "An eigenvalue is defined as..." - doesn't start with verb
    INVALID: "Solve this system..." for Remember level - wrong Bloom level
    """
    if not isinstance(question_text, str) or not question_text.strip():
        return False

    verbs = BLOOM_ALLOWED_VERBS.get(bloom_level, [])
    if not verbs:
        return False

    question_lower = question_text.lower().strip()

    # Extract first word/phrase (up to first comma or period)
    first_phrase = question_lower.split(",")[0].split(".")[0].strip()

    # Check if question starts with any allowed verb
    for verb in verbs:
        if first_phrase.startswith(verb):
            return True

    return False


def check_forbidden_topics(question_text: str) -> bool:
    """
    MANDATORY GUARD: Reject if any DBMS topics detected.
    
    This is deterministic and fast - always applied.
    
    Returns:
        True if question is SAFE (no forbidden topics)
        False if question contains forbidden topics (REJECT)
    """
    if not isinstance(question_text, str):
        return True

    question_lower = question_text.lower()

    # Check each forbidden topic
    for forbidden in FORBIDDEN_TOPICS:
        if forbidden in question_lower:
            return False  # UNSAFE - contains forbidden topic

    return True  # SAFE


def get_bloom_verbs(bloom_level: str) -> list[str]:
    """Get the list of allowed verbs for a Bloom level."""
    return BLOOM_ALLOWED_VERBS.get(bloom_level, [])
