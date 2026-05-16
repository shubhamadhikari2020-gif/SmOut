export const TranslatorView = {
    render: (container, state, data) => {
        container.innerHTML = `
            <div class="app-container animate-fade-in" style="margin: 0 auto; max-width: 600px; padding-top: 1rem;">
                <div style="display: flex; justify-content: flex-start; margin-bottom: 1.5rem;">
                    <button class="btn btn-secondary" style="padding: 0.5rem 1rem; border-radius: 8px;" onclick="window.navigate('dashboard')">← Back to Dashboard</button>
                </div>
                
                <div class="glass-card" style="padding: 2.5rem; text-align: center;">
                    <header style="margin-bottom: 2.5rem;">
                        <h1 style="font-size: 2.8rem; margin-bottom: 0.5rem; background: linear-gradient(135deg, #3b82f6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">SmOut Translation</h1>
                        <p style="color: var(--color-text-secondary); font-size: 1.1rem;">Emotion-Aware Voice Translation</p>
                    </header>

                    <main>
                        <div class="controls" style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: center; width: 100%;">
                                <select id="target-language" class="input-field" style="padding: 0.75rem 1rem; border-radius: 12px; background: rgba(255, 255, 255, 0.9); color: var(--color-text-primary); border: 1px solid rgba(0,0,0,0.1); outline: none; width: 100%;">
                                    <option value="english">English</option>
                                    <option value="hindi">Hindi</option>
                                    <option value="telugu">Telugu</option>
                                    <option value="tamil">Tamil</option>
                                </select>
                            </div>
                            
                            <div style="display: flex; gap: 0.5rem; width: 100%;">
                                <button id="record-btn" class="btn btn-primary" style="flex: 1; display: flex; justify-content: center; align-items: center; gap: 0.5rem; padding: 0.75rem; transition: all 0.3s ease; white-space: nowrap;">
                                    <span class="icon">🎙️</span> Voice
                                </button>
                                <input type="text" id="text-input" placeholder="Or type here..." style="flex: 2; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid rgba(0,0,0,0.1); outline: none; font-family: inherit; background: rgba(255,255,255,0.9);" />
                                <button id="translate-text-btn" class="btn btn-secondary" style="flex: 1; display: flex; justify-content: center; align-items: center; gap: 0.5rem; padding: 0.75rem; white-space: nowrap;">
                                    <span class="icon">✍️</span> Translate
                                </button>
                            </div>
                        </div>

                        <div id="status-indicator" style="text-align: center; font-size: 0.95rem; color: var(--color-text-secondary); min-height: 20px; margin-bottom: 2rem; font-weight: 500;">Ready to record</div>

                        <div id="mic-error-modal" style="display: none; position: fixed; inset: 0; background: rgba(255,255,255,0.8); backdrop-filter: blur(5px); z-index: 9999; align-items: center; justify-content: center;">
                            <div class="glass-card animate-fade-in" style="padding: 2rem; max-width: 400px; text-align: center; border: 2px solid #ef4444; box-shadow: 0 10px 30px rgba(239,68,68,0.2);">
                                <h2 style="color: #ef4444; margin-top: 0;">🎙️ Microphone Blocked</h2>
                                <p style="color: var(--color-text-primary);">We need access to your microphone to translate your voice.</p>
                                <p id="mic-error-desc" style="color: #ef4444; font-size: 0.85rem; font-family: monospace; margin: 0;"></p>
                                <div style="text-align: left; background: rgba(239,68,68,0.05); padding: 1rem; border-radius: 12px; margin: 1.5rem 0; border: 1px solid rgba(239,68,68,0.1);">
                                    <p style="color: var(--color-text-primary); margin-top: 0;"><strong>How to fix:</strong></p>
                                    <ol style="padding-left: 1.5rem; margin-bottom: 0; color: var(--color-text-secondary);">
                                        <li>Click the <strong>Lock icon 🔒</strong> next to "localhost" in your browser's URL bar.</li>
                                        <li>Find <strong>Microphone</strong> and toggle it to <strong>Allow</strong>.</li>
                                        <li>Reload the page or click Retry below!</li>
                                    </ol>
                                </div>
                                <button id="retry-mic-btn" class="btn btn-primary" style="width: 100%; background: #ef4444; border: none;">Retry Microphone</button>
                            </div>
                        </div>

                        <div class="results" id="results-container" style="display: none; text-align: left;">
                            <div style="background: rgba(255,255,255,0.6); padding: 1.5rem; border-radius: 16px; margin-bottom: 1rem; border: 1px solid rgba(0,0,0,0.05);">
                                <h3 style="font-size: 0.9rem; color: var(--color-text-secondary); text-transform: uppercase; margin-top: 0;">You said:</h3>
                                <p id="original-text" style="font-size: 1.25rem; margin-bottom: 1rem; color: var(--color-text-primary); font-weight: 500;"></p>
                                <span id="detected-lang" style="display: inline-block; padding: 0.35rem 0.85rem; border-radius: 999px; font-size: 0.8rem; background: rgba(59,130,246,0.1); color: #2563eb; font-weight: 600;"></span>
                            </div>

                            <div style="background: rgba(255,255,255,0.6); padding: 1.5rem; border-radius: 16px; margin-bottom: 1rem; border: 1px solid rgba(0,0,0,0.05);">
                                <h3 style="font-size: 0.9rem; color: var(--color-text-secondary); text-transform: uppercase; margin-top: 0;">Translation:</h3>
                                <p id="translation-text" style="font-size: 1.25rem; margin-bottom: 1rem; color: var(--color-text-primary); font-weight: 500;"></p>
                                <span id="detected-emotion" style="display: inline-block; padding: 0.35rem 0.85rem; border-radius: 999px; font-size: 0.8rem; background: rgba(236,72,153,0.1); color: #db2777; font-weight: 600;"></span>
                            </div>
                            
                            <audio id="audio-player" controls style="display:none; width: 100%; margin-top: 1rem;"></audio>
                        </div>
                        
                        <div style="margin-top: 2rem; text-align: left;">
                            <h3 style="color: var(--color-text-primary); margin-bottom: 1rem;">Session History</h3>
                            <div id="history-list" style="display: flex; flex-direction: column; gap: 0.75rem;"></div>
                        </div>
                    </main>
                </div>
            </div>
        `;

        // Logic
        let mediaRecorder;
        let audioChunks = [];
        let isRecording = false;

        const recordBtn = container.querySelector('#record-btn');
        const textInput = container.querySelector('#text-input');
        const translateTextBtn = container.querySelector('#translate-text-btn');
        const statusIndicator = container.querySelector('#status-indicator');
        const targetLanguageSelect = container.querySelector('#target-language');
        const resultsContainer = container.querySelector('#results-container');
        const audioPlayer = container.querySelector('#audio-player');
        const historyList = container.querySelector('#history-list');
        const micErrorModal = container.querySelector('#mic-error-modal');
        const retryMicBtn = container.querySelector('#retry-mic-btn');

        // For production, this will automatically use the current domain.
        // If your backend is on a different server, you can change this to your Render URL.
        const API_BASE_URL = window.location.origin;

        // Session ID bound to user name for memory context
        const sessionId = "session_" + (state.user && state.user.name ? state.user.name.replace(/\s/g, '') : "guest") + "_" + Math.floor(Math.random() * 10000);

        recordBtn.addEventListener('click', toggleRecording);
        translateTextBtn.addEventListener('click', sendTextOnlyToServer);
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendTextOnlyToServer();
        });
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
                
                recordBtn.style.background = '#ef4444'; 
                recordBtn.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.4)';
                recordBtn.style.animation = 'pulse 1.5s infinite';
                recordBtn.innerHTML = '<span class="icon">⏹️</span> Stop Recording';
                statusIndicator.textContent = "Listening...";
                
            } catch (err) {
                console.error("Error accessing microphone:", err);
                statusIndicator.textContent = "Microphone error: " + err.message;
                const errDesc = container.querySelector('#mic-error-desc');
                if(errDesc) errDesc.textContent = "Technical Error: " + err.name + " - " + err.message;
                micErrorModal.style.display = 'flex';
            }
        }

        function stopRecording() {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            isRecording = false;
            
            recordBtn.style.background = ''; // reset to default
            recordBtn.style.boxShadow = '';
            recordBtn.style.animation = '';
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
                // Ensure request goes to python backend port 8000
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

        async function sendTextOnlyToServer() {
            const text = textInput.value.trim();
            if (!text) return;
            
            statusIndicator.textContent = "Translating text...";
            
            const formData = new FormData();
            formData.append('text', text);
            formData.append('target_lang', targetLanguageSelect.value);
            formData.append('session_id', sessionId);

            try {
                const response = await fetch(`${API_BASE_URL}/api/translate/text`, {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) throw new Error(`Server error: ${response.status}`);
                
                const data = await response.json();
                displayResults(data);
                fetchHistory();
                textInput.value = ''; // clear input
                
            } catch (err) {
                console.error("Text translation failed:", err);
                statusIndicator.textContent = "Error occurred during text translation.";
            }
        }

        function displayResults(data) {
            statusIndicator.textContent = "Translation complete.";
            resultsContainer.style.display = 'block';
            
            container.querySelector('#original-text').textContent = data.original_text;
            container.querySelector('#detected-lang').textContent = data.detected_language;
            container.querySelector('#detected-emotion').textContent = "Mood: " + data.emotion;
            
            // Animated typing effect for translation
            const translationEl = container.querySelector('#translation-text');
            translationEl.textContent = '';
            let charIndex = 0;
            const textToType = data.translation;
            const typingInterval = setInterval(() => {
                if (charIndex < textToType.length) {
                    translationEl.textContent += textToType.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 25);
            
            if (data.audio_url) {
                audioPlayer.src = data.audio_url;
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
                    div.style.padding = '1rem';
                    div.style.background = 'rgba(255,255,255,0.6)';
                    div.style.borderRadius = '12px';
                    div.style.fontSize = '0.95rem';
                    div.style.color = 'var(--color-text-primary)';
                    div.style.border = '1px solid rgba(0,0,0,0.05)';
                    div.style.borderLeft = msg.role === 'user' ? '4px solid #3b82f6' : '4px solid #ec4899';
                    
                    const strong = document.createElement('strong');
                    strong.textContent = msg.role === 'user' ? 'You: ' : 'Translator: ';
                    div.appendChild(strong);
                    
                    const span = document.createElement('span');
                    span.textContent = msg.content;
                    div.appendChild(span);
                    
                    if (msg.emotion) {
                        const em = document.createElement('em');
                        em.style.color = '#db2777';
                        em.textContent = ` (${msg.emotion})`;
                        div.appendChild(em);
                    }
                    historyList.appendChild(div);
                });
                
            } catch (err) {
                console.error("Failed to fetch history:", err);
            }
        }
    }
};
