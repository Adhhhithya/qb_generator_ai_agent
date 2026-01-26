from difflib import SequenceMatcher

def normalize(text: str) -> str:
    return (
        text.lower()
        .replace(",", "")
        .replace(".", "")
        .strip()
    )


def similarity(a: str, b: str) -> float:
    return SequenceMatcher(
        None,
        normalize(a),
        normalize(b)
    ).ratio()
