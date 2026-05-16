FROM python:3.10-slim

# Install system dependencies (ffmpeg is required for OpenAI Whisper)
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Set root work directory
WORKDIR /app

# Copy all project files into the container
COPY . /app/

# Flexible Requirement Install: Works if context is root OR backend folder
RUN if [ -f requirements.txt ]; then \
        pip install --no-cache-dir -r requirements.txt; \
    else \
        pip install --no-cache-dir -r AI_Translator/backend/requirements.txt; \
    fi

# Flexible Start: Detects location and runs uvicorn properly
# 1. If we are already in the backend folder (main.py is here)
# 2. If we are in the root and 'backend' is a subfolder
# 3. If we are in the root and 'AI_Translator' is a subfolder
CMD if [ -f main.py ]; then \
        uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}; \
    elif [ -f backend/main.py ]; then \
        uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}; \
    elif [ -d AI_Translator ]; then \
        cd AI_Translator && uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}; \
    else \
        echo "Error: Could not find main.py or backend module" && exit 1; \
    fi
