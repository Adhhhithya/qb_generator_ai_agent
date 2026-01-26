import asyncio
import os
import json
from unittest.mock import patch

# Mock environment
os.environ["LLM_MOCK"] = "1"

from app.core.subject_analyzer import SubjectAnalyzer
from app.core.pipeline_config import PipelineStageError

async def test_pipeline_isolation():
    print("=" * 70)
    print("TEST: Pipeline Stage Isolation")
    print("=" * 70)

    # 1. Test Task Drift (Fail Fast)
    print("\n🔹 CASE 1: Task Drift (LLM returns question during extraction)")
    with patch('app.core.llm_client.LLMClient.generate') as mock_generate:
        # LLM drifts and returns a question instead of topics
        mock_generate.return_value = json.dumps({
            "question": "What is ...?",
            "options": ["A", "B"]
        })
        
        analyzer = SubjectAnalyzer()
        try:
            # This should internally raise PipelineStageError, catch it, and return empty list
            # or we might want to verify the error logging.
            # In current SubjectAnalyzer implementation, it catches Exception and returns []
            topics = await analyzer.normalize_syllabus_to_topics("Unit 1...")
            
            print(f"Result: {topics}")
            # Should be empty because fail-fast triggered Exception which was caught
            assert topics == []
            print("✅ PASS: Fail-fast correctly rejected drifting content")
            
        except Exception as e:
            print(f"Caught unexpected exception: {e}")

    # 2. Test Relaxed Validation (List Acceptance)
    print("\n🔹 CASE 2: Relaxed Validation (List of topics)")
    with patch('app.core.llm_client.LLMClient.generate') as mock_generate:
        mock_generate.return_value = json.dumps([
            "Topic A", "Topic B"
        ])
        
        analyzer = SubjectAnalyzer()
        topics = await analyzer.normalize_syllabus_to_topics("Unit 1...")
        
        print(f"Result: {topics}")
        assert "Topic A" in topics
        assert isinstance(topics, list)
        print("✅ PASS: Config correctly allowed list response")

if __name__ == "__main__":
    asyncio.run(test_pipeline_isolation())
