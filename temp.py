import asyncio
from app.core.llm_client import LLMClient

async def main():
    llm = LLMClient()
    res = await llm.generate(
        system_prompt="You are an academic assistant.",
        user_prompt="Define Bloom's Taxonomy in one sentence."
    )
    print(res)

asyncio.run(main())
