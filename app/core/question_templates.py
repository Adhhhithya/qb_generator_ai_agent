

"""
DEPRECATED: Subject-aware templates mapping has been removed.
LLM now handles all template generation with explicit subject grounding.
"""

TEMPLATES_BY_SUBJECT = {}

# Fallback if subject not found
GENERIC_TEMPLATES = [
    "Define {concept}.",
    "What is {concept}?",
    "Explain {concept} with a suitable example.",
    "State any two properties of {concept}.",
    "How is {concept} applied in this domain?",
]


def get_templates_for_subject(subject: str) -> list:
    """
    Get appropriate templates based on subject name.
    Tries fuzzy matching on common keywords.
    """
    if not subject:
        return GENERIC_TEMPLATES
    
    subject_lower = subject.lower()
    
    # Fuzzy match keywords
    if any(keyword in subject_lower for keyword in ["database", "dbms", "sql", "relational"]):
        return TEMPLATES_BY_SUBJECT.get("Database", GENERIC_TEMPLATES)
    elif any(keyword in subject_lower for keyword in ["discrete", "logic", "proof"]):
        return TEMPLATES_BY_SUBJECT.get("Discrete", GENERIC_TEMPLATES)
    elif any(keyword in subject_lower for keyword in ["graph", "network", "tree"]):
        return TEMPLATES_BY_SUBJECT.get("Graph", GENERIC_TEMPLATES)
    elif any(keyword in subject_lower for keyword in ["algorithm", "complexity", "sorting"]):
        return TEMPLATES_BY_SUBJECT.get("Algorithm", GENERIC_TEMPLATES)
    elif any(keyword in subject_lower for keyword in ["software", "design", "testing"]):
        return TEMPLATES_BY_SUBJECT.get("Software", GENERIC_TEMPLATES)
    
    return GENERIC_TEMPLATES


"""
Part B Question Scaffolds

Generic application-based scaffolds. These are overridden by subject-specific prompts.
"""

PART_B_SCAFFOLDS = []


"""
DEPRECATED: All DBMS-specific fallback templates have been removed.
LLM-driven generation with subject-specific grounding is now the standard.
"""

PART_B_FALLBACK_TEMPLATES = []
GENERIC_FALLBACK_TEMPLATES = {}