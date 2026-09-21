import os

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))

# Generation directories
GENERATED_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "generated_files")
os.makedirs(GENERATED_DIR, exist_ok=True)
