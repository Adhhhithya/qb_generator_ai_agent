from typing import List, Dict, Set
from app.db.models import Question

BLOOM_LEVELS = [
  "Remember",
  "Understand",
  "Apply",
  "Analyze",
  "Evaluate",
  "Create"
]

def calculate_syllabus_coverage(all_topics: List[str], questions: List[Question]) -> int:
    """
    Calculates the percentage of syllabus topics covered by the questions.
    
    Definition:
    Coverage % = (Unique syllabus topics used in questions ÷ Total syllabus topics) × 100
    
    Args:
        all_topics: List of all normalized topics in the syllabus.
        questions: List of Question objects (with topics_used populated).
        
    Returns:
        int: Coverage percentage (0-100)
    """
    if not all_topics:
        return 0
        
    # Standardize topics for loose matching (case-insensitive)
    normalized_syllabus = {t.lower().strip() for t in all_topics}
    used_topics: Set[str] = set()
    
    for q in questions:
        if not q.topics_used:
            continue
            
        for topic in q.topics_used:
            t_norm = topic.lower().strip()
            # Count only if it's in the known syllabus
            if t_norm in normalized_syllabus:
                used_topics.add(t_norm)
                
    if not normalized_syllabus:
        return 0
        
    coverage = (len(used_topics) / len(normalized_syllabus)) * 100
    return round(coverage)

def calculate_bloom_distribution(questions: List[Question]) -> Dict[str, int]:
    """
    Counts how many questions fall under each Bloom level.
    Returns raw counts.
    """
    distribution = {level: 0 for level in BLOOM_LEVELS}
    
    for q in questions:
        # Normalize incoming bloom level (capitalize)
        if q.bloom_level:
            # Handle standard case "Remember", "Apply" etc.
            # Also handle if incoming is "remember"
            bloom = q.bloom_level.capitalize()
            if bloom in distribution:
                distribution[bloom] += 1
            else:
                # If unforeseen bloom level, maybe ignore or log? 
                # For now, strict mapping to the 6 levels.
                pass
                
    return distribution
