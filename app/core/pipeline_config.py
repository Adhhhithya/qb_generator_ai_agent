from dataclasses import dataclass, field
from typing import Optional, Any, Callable

@dataclass
class PipelineConfig:
    """Configuration for a specific pipeline stage."""
    stage_name: str
    max_retries: int
    timeout: int
    system_prompt_prefix: str = ""
    fail_fast_checks: list[Callable[[Any], bool]] = field(default_factory=list)
    # If true, list responses are accepted even if JSON object was requested
    relax_json_validation: bool = False 

class PipelineStageError(Exception):
    """Raised when a pipeline stage fails its specific constraints."""
    pass

# --- Stage Configurations ---

TOPIC_EXTRACTION_CONFIG = PipelineConfig(
    stage_name="topic_extraction",
    max_retries=0,  # No retries - use fallback if fails
    timeout=5,      # Fast timeout: 5 seconds max
    relax_json_validation=True # Accept "Good Enough" lists
)

SECTION_GENERATION_CONFIG = PipelineConfig(
    stage_name="section_generation",
    max_retries=0,
    timeout=8,
    relax_json_validation=True
)

QUESTION_GENERATION_CONFIG = PipelineConfig(
    stage_name="question_generation",
    max_retries=1, # Only 1 retry for speed
    timeout=12,    # Reduced from 20
    relax_json_validation=False # Strict schema for final output
)
