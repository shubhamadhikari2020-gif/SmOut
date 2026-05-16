import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if api_key and api_key != "your_gemini_api_key_here":
    genai.configure(api_key=api_key)
else:
    print("WARNING: GEMINI_API_KEY not properly set in .env")

# We use the text model
model = genai.GenerativeModel('gemini-pro')

def translate_and_analyze(text: str, target_lang: str, session_history: list) -> dict:
    """
    Takes user text, analyzes emotion and slang, and translates it to target_lang.
    Uses conversation history for context.
    """
    
    # Format history
    history_text = ""
    for msg in session_history[-5:]: # Get last 5 messages
        history_text += f"{msg.role}: {msg.content}\n"
        
    prompt = f"""
You are an advanced multilingual AI translator with high emotional intelligence.
Your task is to translate the given input text into {target_lang}.

Context (Previous conversation):
{history_text if history_text else "None"}

Input Text: "{text}"

Analyze the input text and provide:
1. The detected language of the input.
2. The detected emotion/tone (e.g., Happy, Angry, Polite, Sad, Sarcastic, Neutral).
3. The context-aware translation into {target_lang}, handling any slang appropriately.

Respond strictly in valid JSON format with the following keys:
- detected_language
- emotion
- translation
    """
    
    try:
        response = model.generate_content(prompt)
        import json
        # Clean up possible markdown formatting in response
        result_text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(result_text)
        return data
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return {
            "detected_language": "Unknown",
            "emotion": "Neutral",
            "translation": text # Fallback to original text
        }
