def expected_difficulty(
    bloom: str,
    marks: int,
    quality_score: int
) -> str:
    if bloom == "Apply":
        if marks <= 10 and quality_score <= 60:
            return "Easy"
        if marks <= 13:
            return "Medium"
        return "Hard"

    if bloom == "Analyze":
        if marks <= 10:
            return "Medium"
        if quality_score >= 75:
            return "Hard"
        return "Medium"

    return "Medium"
