import { resolveGroupConflict } from '../utils/groupDecisionEngine.js';

export const GroupChatView = {
    render: (container, state, data) => {
        if (!state.user) { window.navigate('onboarding'); return; }

        const groupId = data?.groupId || 'g1';
        
        // Mock group data
        let group;
        if (groupId === 'g1') {
            group = {
                id: 'g1',
                name: 'Weekend Squad',
                members: [
                    { name: state.user.name, tasteProfile: state.user.tasteProfile },
                    { name: 'Alex', tasteProfile: { vibes: ['Lively', 'Street Food'], foods: ['Street Food'] } },
                    { name: 'Sam', tasteProfile: { vibes: ['Aesthetic', 'Cafes'], foods: ['Cafes', 'Fine Dining'] } }
                ],
                chat: [
                    { sender: 'Alex', msg: 'Where are we going this weekend?', time: '10:00 AM' },
                    { sender: 'Sam', msg: 'I want something aesthetic.', time: '10:05 AM' },
                    { sender: 'AI Assistant', msg: 'I am analyzing your preferences... Click "Resolve Conflict" to see top 3 picks.', time: '10:06 AM', isSystem: true }
                ],
                picks: []
            };
        } else if (groupId === 'g2') {
            group = {
                id: 'g2',
                name: 'Work Colleagues',
                members: [
                    { name: state.user.name, tasteProfile: state.user.tasteProfile },
                    { name: 'David', tasteProfile: { vibes: ['Quiet', 'Premium'], foods: ['Fine Dining'], budgets: ['High'] } },
                    { name: 'Sarah', tasteProfile: { vibes: ['Aesthetic', 'Quiet'], foods: ['Cafes', 'Fine Dining'] } },
                    { name: 'Mike', tasteProfile: { vibes: ['Chill'], foods: ['Local Cuisine'], budgets: ['Medium'] } },
                    { name: 'Emma', tasteProfile: { vibes: ['Aesthetic', 'Premium'], foods: ['Fine Dining'], budgets: ['High'] } }
                ],
                chat: [
                    { sender: 'David', msg: 'Let\'s finalize the team dinner for Friday.', time: '09:00 AM' },
                    { sender: 'Sarah', msg: 'Needs to be somewhere quiet so we can talk.', time: '09:15 AM' },
                    { sender: 'Mike', msg: 'And good food please. Fine dining or good local places.', time: '09:30 AM' },
                    { sender: 'AI Assistant', msg: 'I am analyzing your preferences... Click "Resolve Conflict" to see top 3 picks.', time: '09:35 AM', isSystem: true }
                ],
                picks: []
            };
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
                        <div class="group-sidebar-item ${groupId === 'g1' ? 'active' : ''}" onclick="window.navigate('groupChat', {groupId: 'g1'})">
                            <strong>Weekend Squad</strong> <br>
                            <span style="font-size: 0.8rem; color: var(--color-text-secondary);">3 members</span>
                        </div>
                        <div class="group-sidebar-item ${groupId === 'g2' ? 'active' : ''}" onclick="window.navigate('groupChat', {groupId: 'g2'})">
                            <strong>Work Colleagues</strong> <br>
                            <span style="font-size: 0.8rem; color: var(--color-text-secondary);">5 members</span>
                        </div>
                        <button class="btn btn-secondary" style="width: 100%; margin-top: 1rem;" onclick="alert('Feature coming soon!')">+ New Group</button>
                    </div>

                    <!-- Middle: Chat Area -->
                    <div class="glass-card" style="display: flex; flex-direction: column; padding: 0;">
                        <div style="padding: 1rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
                            <h2 style="margin: 0;">${group.name}</h2>
                            <button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="navigator.clipboard.writeText('${inviteLink}'); alert('Invite link copied: ${inviteLink}');">🔗 Copy Invite Link</button>
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
                            <input type="text" class="input-field" placeholder="Type a message..." style="flex-grow: 1; margin: 0;">
                            <button class="btn btn-primary" style="padding: 0 1.5rem;">Send</button>
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
