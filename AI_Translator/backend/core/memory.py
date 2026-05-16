from typing import Dict, List, Optional
from pydantic import BaseModel
import time

class Message(BaseModel):
    role: str # 'user' or 'system' or 'translator'
    content: str
    emotion: Optional[str] = None
    language: Optional[str] = None
    timestamp: float

class SessionMemory:
    def __init__(self):
        # Store memory as session_id -> List of Messages
        self.sessions: Dict[str, List[Message]] = {}
        # Max history to keep per session to avoid context limits
        self.max_history = 10

    def add_message(self, session_id: str, message: Message):
        if session_id not in self.sessions:
            self.sessions[session_id] = []
        self.sessions[session_id].append(message)
        if len(self.sessions[session_id]) > self.max_history:
            self.sessions[session_id].pop(0)

    def get_history(self, session_id: str) -> List[Message]:
        return self.sessions.get(session_id, [])

    def clear_session(self, session_id: str):
        if session_id in self.sessions:
            del self.sessions[session_id]

memory_db = SessionMemory()
