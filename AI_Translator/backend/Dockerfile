FROM python:3.10-slim

# Install system dependencies (ffmpeg is required for OpenAI Whisper)
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Set root work directory
WORKDIR /app

# Copy all project files into the container
COPY . /app/

# Install Python dependencies
RUN pip install --no-cache-dir -r AI_Translator/backend/requirements.txt

# Set the working directory to where the backend python module starts
WORKDIR /app/AI_Translator

# The port is dynamic in cloud environments like Render
# We will use the $PORT environment variable, defaulting to 8000
CMD uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}
