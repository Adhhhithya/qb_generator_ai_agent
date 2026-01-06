from google import genai
from app.core.config import settings

client = genai.Client(api_key=settings.LLM_API_KEY)

models = client.models.list()

for m in models:
    print(m.name)
