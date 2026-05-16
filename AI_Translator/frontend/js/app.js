let mediaRecorder;
let audioChunks = [];
let isRecording = false;

const recordBtn = document.getElementById('record-btn');
const statusIndicator = document.getElementById('status-indicator');
const targetLanguageSelect = document.getElementById('target-language');
const resultsContainer = document.getElementById('results-container');
const audioPlayer = document.getElementById('audio-player');
const historyList = document.getElementById('history-list');
const micErrorModal = document.getElementById('mic-error-modal');
const retryMicBtn = document.getElementById('retry-mic-btn');

// For production, this will automatically use the current domain.
// If your backend is on a different server, you can change this to your Render URL.
const API_BASE_URL = window.location.origin;

// We use a constant session ID for the demo
const sessionId = "demo_session_" + Math.floor(Math.random() * 10000);

recordBtn.addEventListener('click', toggleRecording);
retryMicBtn.addEventListener('click', () => {
    micErrorModal.style.display = 'none';
    startRecording();
});

async function toggleRecording() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = sendAudioToServer;
        
        mediaRecorder.start();
        isRecording = true;
        
        recordBtn.classList.add('recording');
        recordBtn.innerHTML = '<span class="icon">⏹️</span> Stop Recording';
        statusIndicator.textContent = "Listening...";
        
    } catch (err) {
        console.error("Error accessing microphone:", err);
        statusIndicator.textContent = "Microphone error: " + err.message;
        const errDesc = document.getElementById('mic-error-desc');
        if(errDesc) errDesc.textContent = "Technical Error: " + err.name + " - " + err.message;
        micErrorModal.style.display = 'flex';
    }
}

function stopRecording() {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
    isRecording = false;
    
    recordBtn.classList.remove('recording');
    recordBtn.innerHTML = '<span class="icon">🎙️</span> Start Recording';
    statusIndicator.textContent = "Processing audio...";
}

async function sendAudioToServer() {
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('target_lang', targetLanguageSelect.value);
    formData.append('session_id', sessionId);

    try {
        const response = await fetch(`${API_BASE_URL}/api/translate/voice`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        
        displayResults(data);
        fetchHistory();
        
    } catch (err) {
        console.error("Translation failed:", err);
        statusIndicator.textContent = "Error occurred during translation.";
    }
}

function displayResults(data) {
    statusIndicator.textContent = "Translation complete.";
    resultsContainer.style.display = 'block';
    
    document.getElementById('original-text').textContent = data.original_text;
    document.getElementById('detected-lang').textContent = data.detected_language;
    
    document.getElementById('translation-text').textContent = data.translation;
    document.getElementById('detected-emotion').textContent = "Mood: " + data.emotion;
    
    // Play audio automatically
    if (data.audio_url) {
        audioPlayer.src = API_BASE_URL + data.audio_url;
        audioPlayer.play().catch(e => console.log("Auto-play prevented by browser"));
    }
}

async function fetchHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/session/${sessionId}`);
        const data = await response.json();
        
        historyList.innerHTML = '';
        
        data.history.forEach(msg => {
            const div = document.createElement('div');
            div.className = `history-item ${msg.role}`;
            
            let content = `<strong>${msg.role === 'user' ? 'You' : 'Translator'}:</strong> ${msg.content}`;
            if (msg.emotion) {
                content += ` <em>(${msg.emotion})</em>`;
            }
            
            div.innerHTML = content;
            historyList.appendChild(div);
        });
        
    } catch (err) {
        console.error("Failed to fetch history:", err);
    }
}
