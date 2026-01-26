import asyncio
import os
import json
from unittest.mock import patch, MagicMock

# Force mock mode to avoid ImportError for missing groq package
os.environ["LLM_MOCK"] = "1"

from app.core.subject_analyzer import SubjectAnalyzer

async def test_normalization():
    print("=" * 70)
    print("TEST: Syllabus Normalization (with Mocks)")
    print("=" * 70)

    # Syllabus that needs normalization
    syllabus = "UNIT I RANDOM VARIABLES..."

    # 1. Test Standard Dict Response
    print("\n🔹 CASE 1: LLM returns standard Dict")
    with patch('app.core.llm_client.LLMClient.generate') as mock_generate:
        mock_generate.return_value = json.dumps({
            "topics": ["Binomial Distribution", "Poisson Distribution"]
        })
        
        analyzer = SubjectAnalyzer()
        topics = await analyzer.normalize_syllabus_to_topics(syllabus)
        
        print(f"Result: {topics}")
        assert "Binomial Distribution" in topics
        assert isinstance(topics, list)
        print("✅ PASS")

    # 2. Test List Response (The Fix)
    print("\n🔹 CASE 2: LLM returns List (Safety Patch Trigger)")
    with patch('app.core.llm_client.LLMClient.generate') as mock_generate:
        # LLM "slips" and returns a list directly
        mock_generate.return_value = json.dumps([
            "Normal Distribution", "Exponential Distribution"
        ])
        
        analyzer = SubjectAnalyzer()
        topics = await analyzer.normalize_syllabus_to_topics(syllabus)
        
        print(f"Result: {topics}")
        assert "Normal Distribution" in topics
        assert isinstance(topics, list)
        print("✅ PASS: Safety patch handled list response")

if __name__ == "__main__":
    asyncio.run(test_normalization())

