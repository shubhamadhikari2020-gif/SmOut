from gtts import gTTS
import os
import time

def generate_tts(text: str, lang_code: str = 'english') -> str:
    """
    Generates TTS audio and returns the filepath.
    """
    # Map to gTTS supported codes
    lang_map = {
        "english": "en",
        "hindi": "hi",
        "telugu": "te",
        "tamil": "ta"
    }
    
    safe_lang_code = lang_map.get(lang_code.lower(), "en")
    
    tts = gTTS(text=text, lang=safe_lang_code, slow=False)
    
    # Ensure a tmp directory exists
    os.makedirs("tmp", exist_ok=True)
    filename = f"tmp/tts_{int(time.time())}.mp3"
    tts.save(filename)
    return filename
