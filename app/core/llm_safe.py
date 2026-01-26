from app.core.llm_client import LLMClient
from app.core.json_utils import safe_llm_json_parse
from app.core.pipeline_config import PipelineConfig, PipelineStageError
import asyncio
import logging

logger = logging.getLogger(__name__)

class SafeLLM:
    def __init__(self, default_config: PipelineConfig = None):
        self.llm = LLMClient()
        # Default fallback config if none provided per call
        self.default_config = default_config or PipelineConfig(
            stage_name="default", max_retries=1, timeout=15  # Reduced from 30s
        )

    async def generate_json(self, system_prompt, user_prompt, config: PipelineConfig = None):
        """
        Generate JSON with stage-specific configuration.
        """
        cfg = config or self.default_config
        last_error = None

        logger.info(f"Starting LLM stage: {cfg.stage_name} (Retries: {cfg.max_retries}, Timeout: {cfg.timeout}s)")

        # Enforce fresh context
        if cfg.system_prompt_prefix:
            system_prompt = cfg.system_prompt_prefix + "\n" + system_prompt

        for attempt in range(cfg.max_retries + 1):
            try:
                # Apply hard timeout
                response = await asyncio.wait_for(
                    self.llm.generate(system_prompt, user_prompt),
                    timeout=cfg.timeout
                )

                parsed = safe_llm_json_parse(response)
                
                # FAIL FAST: Check for task drift (e.g. LLM generating questions when asking for topics)
                for check in cfg.fail_fast_checks:
                    if not check(parsed):
                        raise PipelineStageError(f"Fail-fast check failed for stage {cfg.stage_name}")

                # SAFETY PATCH: Wrap list responses into dict
                if isinstance(parsed, list):
                    logger.info(f"Wrapping list response for stage {cfg.stage_name}")
                    parsed = {"topics": parsed}

                return parsed

            except asyncio.TimeoutError:
                logger.warning(f"Stage {cfg.stage_name} timed out (Attempt {attempt+1}/{cfg.max_retries+1})")
                if attempt == cfg.max_retries:
                    raise asyncio.TimeoutError(f"Stage {cfg.stage_name} failed after {cfg.timeout}s timeout")
            
            except PipelineStageError as e:
                # Fatal error, do not retry
                logger.error(f"Stage {cfg.stage_name} fatal error: {str(e)}")
                raise e

            except Exception as e:
                logger.warning(f"Stage {cfg.stage_name} error: {str(e)}")
                last_error = e
                # Only retry if we have retries left
                if attempt < cfg.max_retries:
                     user_prompt += "\n\nError: Invalid JSON. Retry."

        raise ValueError(f"Stage {cfg.stage_name} failed: {last_error}")

