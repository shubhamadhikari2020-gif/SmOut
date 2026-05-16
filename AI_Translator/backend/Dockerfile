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
CMD if [ -f backend/main.py ]; then \
        uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}; \
    else \
        cd AI_Translator && uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}; \
    fi
