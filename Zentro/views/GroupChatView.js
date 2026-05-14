import { resolveGroupConflict } from '../utils/groupDecisionEngine.js';

export const GroupChatView = {
    render: (container, state, data) => {
        if (!state.user) { window.navigate('onboarding'); return; }

        window.currentGroupId = data?.groupId || (state.groups.length > 0 ? state.groups[0].id : null);
        if (!window.currentGroupId) {
            window.navigate('dashboard');
            return;
        }

        const group = state.groups.find(g => g.id === window.currentGroupId);
        if (!group) {
            window.navigate('dashboard');
            return;
        }

        window.resolveGroup = () => {
            const picks = resolveGroupConflict(group.members);
            group.picks = picks.map(p => ({ ...p, votes: 0, votedByMe: false }));
            group.chat.push({ sender: 'AI Assistant', msg: `I found the best 3 spots for you all! Check the sidebar to vote.`, time: 'Now', isSystem: true });
            renderView();

            // Simulate live voting from other members
            if (window.liveVoteInterval) clearInterval(window.liveVoteInterval);
            window.liveVoteInterval = setInterval(() => {
                if (group.picks.length > 0 && document.getElementById('chat-history')) {
                    const randomPickIndex = Math.floor(Math.random() * group.picks.length);
                    group.picks[randomPickIndex].votes += 1;
                    
                    // Add a mock message occasionally
                    if (Math.random() > 0.6) {
                        const randomMember = group.members[1 + Math.floor(Math.random() * (group.members.length - 1))].name;
                        group.chat.push({ sender: 'AI Assistant', msg: `🔔 ${randomMember} just voted for ${group.picks[randomPickIndex].name}!`, time: 'Now', isSystem: true });
                    }
                    renderView();
                } else {
                    clearInterval(window.liveVoteInterval);
                }
            }, 4000); // Live update every 4 seconds
        };

        window.castVote = (index) => {
            const pick = group.picks[index];
            if (pick.votedByMe) {
                pick.votes -= 1;
                pick.votedByMe = false;
            } else {
                pick.votes += 1;
                pick.votedByMe = true;
                group.chat.push({ sender: 'AI Assistant', msg: `You voted for ${pick.name}`, time: 'Now', isSystem: true });
            }
            renderView();
        };

        window.sendGroupMessage = () => {
            const input = document.getElementById('chat-input');
            const msg = input.value.trim();
            if (msg) {
                group.chat.push({ sender: state.user.name, msg: msg, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
                input.value = '';
                localStorage.setItem('smout_groups', JSON.stringify(state.groups));
                renderView();
            }
        };

        window.removeGroupMember = (memberName) => {
            if (confirm(`Are you sure you want to remove ${memberName} from the group?`)) {
                group.members = group.members.filter(m => m.name !== memberName);
                group.chat.push({ sender: 'System', msg: `${memberName} was removed from the group.`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), isSystem: true });
                localStorage.setItem('smout_groups', JSON.stringify(state.groups));
                renderView();
            }
        };

        window.deleteGroup = () => {
            if (confirm(`Are you sure you want to permanently delete "${group.name}"? This action cannot be undone.`)) {
                state.groups = state.groups.filter(g => g.id !== group.id);
                localStorage.setItem('smout_groups', JSON.stringify(state.groups));
                window.navigate('dashboard');
            }
        };

        const renderView = () => {
            const inviteLink = window.location.origin + window.location.pathname + '#join?groupId=' + group.id;

            container.innerHTML = `
                <style>
                    .chat-bubble { padding: 0.75rem 1rem; border-radius: var(--radius-md); max-width: 80%; margin-bottom: 1rem; }
                    .chat-system { background: rgba(139, 92, 246, 0.1); border: 1px solid var(--color-primary); margin: 1rem auto; text-align: center; }
                    .chat-user { background: rgba(255,255,255,0.1); margin-right: auto; }
                    .chat-me { background: var(--color-primary); color: white; margin-left: auto; }
                    .group-sidebar-item { padding: 1rem; border-radius: var(--radius-md); cursor: pointer; transition: 0.2s; background: rgba(0,0,0,0.2); margin-bottom: 0.5rem; }
                    .group-sidebar-item.active { background: rgba(139, 92, 246, 0.3); border-left: 3px solid var(--color-primary); }
                    .group-sidebar-item:hover { background: rgba(255,255,255,0.1); }
                    .vote-badge { background: var(--color-primary); color: white; padding: 0.2rem 0.6rem; border-radius: 12px; font-weight: bold; font-size: 0.8rem; }
                </style>
                <div style="display: grid; grid-template-columns: 250px 1fr 300px; gap: 1rem; height: calc(100vh - 150px); margin-top: 1rem;">
                    
                    <!-- Left Sidebar: Groups List -->
                    <div class="glass-card" style="padding: 1rem; overflow-y: auto;">
                        <h3 style="margin-bottom: 1rem;">My Hangouts</h3>
                        ${state.groups.map(g => `
                            <div class="group-sidebar-item ${window.currentGroupId === g.id ? 'active' : ''}" onclick="window.navigate('groupChat', {groupId: '${g.id}'})">
                                <strong>${g.name}</strong> <br>
                                <span style="font-size: 0.8rem; color: var(--color-text-secondary);">${g.members.length} members</span>
                            </div>
                        `).join('')}
                        <button class="btn btn-secondary" style="width: 100%; margin-top: 1rem;" onclick="window.createGroup()">+ New Group</button>
                    </div>

                    <!-- Middle: Chat Area -->
                    <div class="glass-card" style="display: flex; flex-direction: column; padding: 0;">
                        <div style="padding: 1rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; position: relative;">
                            <h2 style="margin: 0;">${group.name}</h2>
                            <div style="display: flex; gap: 0.5rem; align-items: center;">
                                <button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="navigator.clipboard.writeText('${inviteLink}'); const toast = document.getElementById('copy-toast'); toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(-10px)'; }, 2000);">🔗 Copy Invite Link</button>
                                <button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="document.getElementById('group-settings-modal').style.display='flex'">⚙️ Settings</button>
                            </div>
                            <div id="copy-toast" style="position: absolute; right: 1.5rem; top: 3.5rem; background: var(--color-primary); color: white; padding: 0.4rem 0.8rem; border-radius: var(--radius-md); font-size: 0.8rem; font-weight: bold; opacity: 0; transform: translateY(-10px); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3); z-index: 10;">Copied to clipboard!</div>
                        </div>
                        
                        <div id="chat-history" style="flex-grow: 1; padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; scroll-behavior: smooth;">
                            ${group.chat.map(c => `
                                <div class="chat-bubble ${c.isSystem ? 'chat-system' : (c.sender === state.user.name ? 'chat-me' : 'chat-user')}">
                                    ${c.isSystem ? '' : `<strong style="font-size: 0.8rem; display: block; margin-bottom: 0.25rem;">${c.sender}</strong>`}
                                    ${c.msg}
                                </div>
                            `).join('')}
                        </div>

                        <div style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 0.5rem;">
                            <input type="text" id="chat-input" class="input-field" placeholder="Type a message..." style="flex-grow: 1; margin: 0;" onkeypress="if(event.key === 'Enter') window.sendGroupMessage()">
                            <button class="btn btn-primary" style="padding: 0 1.5rem;" onclick="window.sendGroupMessage()">Send</button>
                        </div>
                    </div>

                    <!-- Right Sidebar: Decision Engine -->
                    <div class="glass-card" style="padding: 1rem; overflow-y: auto; display: flex; flex-direction: column;">
                        <h3 style="margin-bottom: 1rem;">Group Consensus</h3>
                        
                        ${group.picks.length === 0 ? `
                            <p style="font-size: 0.9rem; color: var(--color-text-secondary); margin-bottom: 1.5rem;">
                                Waiting to resolve preferences for ${group.members.length} members.
                            </p>
                            <button class="btn btn-primary" style="width: 100%; background: linear-gradient(135deg, #10b981, #3b82f6);" onclick="window.resolveGroup()">🤖 AI: Find Top 3 Places</button>
                        ` : `
                            <div style="display: flex; flex-direction: column; gap: 1rem;">
                                ${group.picks.map((pick, i) => `
                                    <div style="background: rgba(0,0,0,0.2); border-radius: var(--radius-md); padding: 1rem; border: ${pick.votedByMe ? '2px solid #10b981' : '2px solid transparent'}; position: relative;">
                                        <div style="position: absolute; top: -10px; right: -10px; z-index: 10;" class="vote-badge">
                                            🔥 ${pick.votes} Votes
                                        </div>
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                            <span style="font-weight: bold; color: var(--color-accent);">#${i + 1} Pick</span>
                                            <span style="font-size: 0.8rem;">${pick.matchPercentage}% Match</span>
                                        </div>
                                        <h4 style="margin-bottom: 0.25rem;">${pick.name}</h4>
                                        <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">${pick.tags.join(' • ')}</p>
                                        <button class="btn ${pick.votedByMe ? 'btn-primary' : 'btn-secondary'}" style="width: 100%; padding: 0.4rem; font-size: 0.8rem; margin-top: 0.5rem;" onclick="window.castVote(${i})">
                                            ${pick.votedByMe ? '✅ Voted' : '👍 Vote for this'}
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>
                </div>

                <!-- Group Settings Modal -->
                <div id="group-settings-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); z-index: 9999; align-items: center; justify-content: center;">
                    <div class="glass-card animate-fade-in" style="width: 100%; max-width: 450px; padding: 2rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                            <h2 style="margin: 0;">Group Settings</h2>
                            <button class="btn" style="background: transparent; color: white; border: none; font-size: 1.2rem; cursor: pointer;" onclick="document.getElementById('group-settings-modal').style.display='none'">✕</button>
                        </div>
                        
                        <h3 style="margin-bottom: 0.5rem; font-size: 1rem; color: var(--color-text-secondary);">Members (${group.members.length})</h3>
                        <div style="background: rgba(0,0,0,0.2); border-radius: var(--radius-md); padding: 0.5rem; max-height: 200px; overflow-y: auto; margin-bottom: 1.5rem;">
                            ${group.members.map(m => `
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
                                    <span>${m.name} ${m.name === state.user.name ? '(You)' : ''}</span>
                                    ${m.name !== state.user.name ? `<button class="btn btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.7rem; color: #ef4444; border-color: rgba(239, 68, 68, 0.3);" onclick="window.removeGroupMember('${m.name}')">Remove</button>` : ''}
                                </div>
                            `).join('')}
                        </div>

                        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem;">
                            <button class="btn btn-primary" style="width: 100%; background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.5);" onclick="window.deleteGroup()">🗑️ Delete Group</button>
                        </div>
                    </div>
                </div>
            `;

            // Auto-scroll chat to bottom
            setTimeout(() => {
                const chatBox = document.getElementById('chat-history');
                if(chatBox) chatBox.scrollTop = chatBox.scrollHeight;
            }, 50);
        };

        renderView();
    }
};
