from fastapi import APIRouter, File, UploadFile, Form, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
import os
import time
import shutil
from core.memory import memory_db, Message
from services.asr_service import transcribe_audio
from services.llm_service import translate_and_analyze
from services.tts_service import generate_tts

router = APIRouter()

@router.post("/translate/voice")
async def translate_voice(
    background_tasks: BackgroundTasks,
    audio: UploadFile = File(...),
    target_lang: str = Form("english"),
    session_id: str = Form("default_session")
):
    # 1. Save uploaded audio
    os.makedirs("tmp", exist_ok=True)
    temp_audio_path = f"tmp/uploaded_{int(time.time())}_{audio.filename}"
    with open(temp_audio_path, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)
        
    try:
        # 2. ASR - Speech to Text
        transcribed_text = transcribe_audio(temp_audio_path)
        
        # Add to memory
        memory_db.add_message(session_id, Message(role="user", content=transcribed_text, timestamp=time.time()))
        
        # 3. LLM - Analyze & Translate
        history = memory_db.get_history(session_id)
        llm_result = translate_and_analyze(transcribed_text, target_lang, history)
        
        translation = llm_result.get("translation", transcribed_text)
        emotion = llm_result.get("emotion", "Neutral")
        
        # Add system response to memory
        memory_db.add_message(session_id, Message(
            role="translator", 
            content=translation, 
            emotion=emotion,
            language=target_lang,
            timestamp=time.time()
        ))
        
        # 4. TTS - Text to Speech
        tts_file_path = generate_tts(translation, target_lang)
        
        # Cleanup input audio
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)
            
        audio_url = f"/api/audio/{os.path.basename(tts_file_path)}"
        
        return JSONResponse({
            "original_text": transcribed_text,
            "translation": translation,
            "emotion": emotion,
            "detected_language": llm_result.get("detected_language", "Unknown"),
            "audio_url": audio_url
        })
        
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@router.post("/translate/text")
async def translate_text(
    text: str = Form(...),
    target_lang: str = Form("english"),
    session_id: str = Form("default_session")
):
    try:
        # Add to memory
        memory_db.add_message(session_id, Message(role="user", content=text, timestamp=time.time()))
        
        # LLM - Analyze & Translate
        history = memory_db.get_history(session_id)
        llm_result = translate_and_analyze(text, target_lang, history)
        
        translation = llm_result.get("translation", text)
        emotion = llm_result.get("emotion", "Neutral")
        
        # Add system response to memory
        memory_db.add_message(session_id, Message(
            role="translator", 
            content=translation, 
            emotion=emotion,
            language=target_lang,
            timestamp=time.time()
        ))
        
        # TTS - Text to Speech
        tts_file_path = generate_tts(translation, target_lang)
        audio_url = f"/api/audio/{os.path.basename(tts_file_path)}"
        
        return JSONResponse({
            "original_text": text,
            "translation": translation,
            "emotion": emotion,
            "detected_language": llm_result.get("detected_language", "Unknown"),
            "audio_url": audio_url
        })
        
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@router.get("/audio/{filename}")
async def get_audio(filename: str):
    file_path = f"tmp/{filename}"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="audio/mpeg")
    return JSONResponse({"error": "File not found"}, status_code=404)

@router.get("/session/{session_id}")
async def get_session_history(session_id: str):
    history = memory_db.get_history(session_id)
    return {"session_id": session_id, "history": [msg.dict() for msg in history]}
