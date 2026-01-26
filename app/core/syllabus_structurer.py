"""
Syllabus structuring service - converts raw text to structured units/topics using LLM.

This module handles the LLM-based conversion of raw syllabus text into structured format.
"""

import json
import logging
from typing import Optional

from app.core.llm_client import LLMClient
from app.core.json_utils import safe_llm_json_parse

logger = logging.getLogger(__name__)


class SyllabusStructurer:
    """Service to structure raw syllabus text using LLM."""
    
    def __init__(self):
        self.llm = LLMClient()
    
    @staticmethod
    def create_structuring_prompt(raw_syllabus_text: str) -> str:
        """
        Create the exact LLM prompt for structuring syllabus.
        
        This prompt ensures:
        - No topics are added or removed
        - Only organizes existing content
        - Groups topics logically if units not mentioned
        - Returns valid JSON
        
        Args:
            raw_syllabus_text: Raw extracted text from STEP 2
            
        Returns:
            Complete prompt for LLM
        """
        prompt = f"""You are given raw syllabus text extracted from a document.

Your task:
- DO NOT add new topics
- DO NOT remove topics
- ONLY organize the content that already exists

Convert the syllabus into a structured JSON format with:
- units (if mentioned)
- topics under each unit
- if units are not explicitly mentioned, group topics logically

Raw syllabus text:
<<<
{raw_syllabus_text}
>>>

Output format (JSON only, no additional text):
{{
  "units": [
    {{
      "unit_title": "string",
      "topics": ["topic 1", "topic 2", "..."]
    }}
  ]
}}

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no explanation."""
        return prompt
    
    def structure_syllabus(self, raw_syllabus_text: str) -> dict:
        """
        Structure raw syllabus text using LLM in one call.
        
        Args:
            raw_syllabus_text: Raw extracted text from STEP 2
            
        Returns:
            Dictionary with structured syllabus:
            {
                "units": [
                    {
                        "unit_title": "...",
                        "topics": ["topic1", "topic2", ...]
                    },
                    ...
                ]
            }
            
        Raises:
            ValueError: If LLM response is invalid JSON
            Exception: If LLM call fails
        """
        prompt = self.create_structuring_prompt(raw_syllabus_text)
        
        logger.info("Calling LLM to structure syllabus...")
        logger.debug(f"Raw text length: {len(raw_syllabus_text)} characters")
        
        try:
            # Single LLM call - no retries as per requirement
            response = self.llm.generate(prompt)
            
            logger.debug(f"LLM Response: {response[:200]}...")
            
            # Parse JSON response
            structured = safe_llm_json_parse(response)
            
            # Validate structure
            self._validate_structure(structured)
            
            logger.info(
                f"Syllabus structured successfully. "
                f"Units: {len(structured.get('units', []))} | "
                f"Topics: {sum(len(u.get('topics', [])) for u in structured.get('units', []))}"
            )
            
            return structured
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LLM JSON response: {str(e)}")
            logger.error(f"Response was: {response[:500]}")
            raise ValueError(f"LLM returned invalid JSON: {str(e)}")
        
        except Exception as e:
            logger.error(f"Error during syllabus structuring: {str(e)}")
            raise
    
    @staticmethod
    def _validate_structure(structured: dict) -> None:
        """
        Validate that the structured syllabus has correct format.
        
        Args:
            structured: Dictionary to validate
            
        Raises:
            ValueError: If structure is invalid
        """
        if not isinstance(structured, dict):
            raise ValueError("Response must be a dictionary")
        
        if "units" not in structured:
            raise ValueError("Response must contain 'units' key")
        
        if not isinstance(structured["units"], list):
            raise ValueError("'units' must be a list")
        
        if len(structured["units"]) == 0:
            raise ValueError("'units' list cannot be empty")
        
        for i, unit in enumerate(structured["units"]):
            if not isinstance(unit, dict):
                raise ValueError(f"Unit {i} must be a dictionary")
            
            if "unit_title" not in unit:
                raise ValueError(f"Unit {i} missing 'unit_title'")
            
            if "topics" not in unit:
                raise ValueError(f"Unit {i} missing 'topics'")
            
            if not isinstance(unit["topics"], list):
                raise ValueError(f"Unit {i} topics must be a list")
            
            if len(unit["topics"]) == 0:
                raise ValueError(f"Unit {i} ({unit['unit_title']}) has no topics")
