"""
Global Constants for Question Generation Safety

This module defines universal guards and constraints applied to ALL LLM calls:
- Bloom verb enforcement
- DBMS topic elimination
- Duplicate prevention
- Subject protection
"""

# ============================================================================
# BLOOM LEVEL VERB ENFORCEMENT
# ============================================================================
# These are the ONLY allowed starting verbs for each Bloom level
# Questions that don't start with these verbs will be REJECTED

BLOOM_ALLOWED_VERBS = {
    "Remember": [
        "define", "what is", "what are", "list", "state", "identify",
        "name", "label", "tell", "recall", "describe briefly",
        "arrange", "duplicate", "memorize", "recognize", "reproduce",
        "select", "show", "spell", "tell", "write"
    ],
    "Understand": [
        "explain", "describe", "summarize", "clarify", "classify",
        "compare", "contrast", "interpret", "outline", "paraphrase",
        "rephrase", "represent", "review", "rewrite", "translate",
        "associate", "distinguish", "estimate", "extend", "generalize",
        "give example", "infer", "predict", "relate", "reorganize"
    ],
    "Apply": [
        "apply", "solve", "demonstrate", "illustrate", "use", "practice",
        "construct", "dramatize", "employ", "exhibit", "implement",
        "interpret", "operate", "schedule", "sketch", "solve",
        "translate", "calculate", "complete", "compute", "show how",
        "modify", "prepare", "produce", "transfer", "develop"
    ],
    "Analyze": [
        "analyze", "compare", "differentiate", "examine", "investigate",
        "distinguish", "separate", "appraise", "criticize", "diagnose",
        "diagram", "discriminate", "experiment", "identify", "point out",
        "debate", "relate", "resolve", "select", "subdivide",
        "uncover", "break down", "categorize", "compare and contrast",
        "how are they different", "what is the relationship"
    ],
    "Evaluate": [
        "evaluate", "assess", "judge", "critique", "justify", "defend",
        "argue", "conclude", "support", "appraise", "compare", "decide",
        "deduct", "estimate", "interpret", "rank", "rate", "resolve",
        "select", "validate", "verify", "why", "why not", "which is best",
        "make a judgment", "form an opinion", "take a position"
    ],
    "Create": [
        "create", "design", "develop", "build", "construct", "compose",
        "generate", "formulate", "plan", "produce", "synthesize",
        "arrange", "assemble", "combine", "compile", "devise", "invent",
        "make", "organize", "propose", "set up", "write", "what would you"
    ]
}

# ============================================================================
# FORBIDDEN TOPICS (PRODUCTION-GRADE SAFETY)
# ============================================================================
# These topics indicate DBMS content - if found, question is REJECTED
# This is NOT a hack - it's deterministic, fast, and prevents contamination

FORBIDDEN_TOPICS = [
    "dbms", "database", "relation", "normalization", "sql",
    "functional dependency", "3nf", "bcnf", "first normal form",
    "second normal form", "third normal form", "boyce codd",
    "schema", "transaction", "acid", "query", "index",
    "constraint", "primary key", "foreign key", "join",
    "decomposition", "anomaly", "atomic", "consistency",
    "isolation", "durability", "relational model", "tuple"
]

# ============================================================================
# SYSTEM PROMPT TEMPLATE (For ALL LLM Calls)
# ============================================================================
# This must be prepended to EVERY system prompt to prevent DBMS bias
# CRITICAL: This MUST appear FIRST before any other instructions

UNIVERSAL_SYSTEM_PREFIX = """SUBJECT LOCK (NON-NEGOTIABLE):
You are generating questions ONLY for the specified subject.

CRITICAL RULES:
- Do NOT mention DBMS, databases, relations, schemas, normalization, tables, SQL, or data models
- If a generated question contains any database-related term, it is INVALID
- All questions must be appropriate ONLY to the stated subject
- Do NOT assume this is Computer Science or DBMS
- Ignore any implicit bias toward database topics

You are an academic question paper generator.
Generate questions ONLY from the given subject and topics.
Use subject-appropriate academic language.

This is a multi-domain system. Adapt strictly to the specified subject."""

# ============================================================================
# DUPLICATE PREVENTION
# ============================================================================
# Threshold for considering questions as duplicates (cosine similarity)
DUPLICATE_THRESHOLD = 0.85
