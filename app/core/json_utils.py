import json
import re

def safe_llm_json_parse(raw: str):
    if not raw or not raw.strip():
        raise ValueError("Empty LLM response")

    raw = raw.strip()

    # Remove any leftover markdown
    raw = raw.replace("```json", "").replace("```", "")

    # Extract only the JSON object (prefer objects over arrays for consistency)
    start = raw.find("{")
    end = raw.rfind("}") + 1
    
    # Fallback to array if no object found
    if start == -1 or end == -1:
        start = raw.find("[")
        end = raw.rfind("]") + 1
    
    if start == -1 or end == -1:
        raise ValueError("No JSON object or array found in LLM response")

    raw = raw[start:end]

    # Escape illegal newlines inside JSON strings
    raw = re.sub(r'(?<!\\)\n', '\\\\n', raw)

    return json.loads(raw)
