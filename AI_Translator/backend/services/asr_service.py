import whisper
import os

# Load model globally to avoid reloading on every request
# Using 'base' model to balance accuracy and speed on a laptop
print("Loading Whisper model...")
model = whisper.load_model("base")
print("Whisper model loaded.")

def transcribe_audio(file_path: str) -> str:
    """
    Transcribes an audio file to text using Whisper.
    """
    result = model.transcribe(file_path)
    return result["text"].strip()
