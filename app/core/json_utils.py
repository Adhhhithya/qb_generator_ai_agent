import json


def safe_json_parse(text: str) -> dict:
    # Short-circuit if already a dict
    if isinstance(text, dict):
        return text
    
    if not text:
        raise ValueError("Empty LLM response")

    text = text.strip()

    # Remove markdown fences if present
    if text.startswith("```"):
        text = text.split("```")[1]

    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON from LLM: {e}")
