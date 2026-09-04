import os
from pathlib import Path
from dotenv import load_dotenv
import redis

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

REDIS_URL = os.getenv("REDIS_URL")

redis_client = redis.from_url(REDIS_URL, decode_responses=True)