import { mockPlaces } from '../data/mockPlaces.js';

export const ProfileView = {
    render: (container, state, data) => {
        if (!state.user) {
            window.navigate('onboarding');
            return;
        }

        const taste = state.user.tasteProfile || {};
        const history = state.history || [];
        const name = state.user.name || "Guest User";
        const bio = state.user.bio || "Exploring the best spots in the city. 🌆✨";

        let totalExplored = history.length;
        let followers = Math.floor(Math.random() * 500) + 100; // Mock stat
        let following = Math.floor(Math.random() * 300) + 50;  // Mock stat

        // Mock current active location
        const activePlaceId = history.length > 0 ? history[history.length - 1].placeId : mockPlaces[0].id;
        const activePlace = mockPlaces.find(p => p.id === activePlaceId) || mockPlaces[0];
        
        // Mock active explorers at the same location
        const activeExplorers = [
            { name: 'Sarah', icon: '👩🏻' },
            { name: 'Rahul', icon: '👨🏽' },
            { name: 'Priya', icon: '👩🏽‍🦱' },
            { name: 'Alex', icon: '👨🏼' }
        ];

        // Generate Grid Items for History
        const historyPlaces = history.map(h => mockPlaces.find(p => p.id === h.placeId)).filter(Boolean);
        // Pad with mock places if history is too short for a nice grid
        while (historyPlaces.length < 6) {
            historyPlaces.push(mockPlaces[Math.floor(Math.random() * mockPlaces.length)]);
        }

        container.innerHTML = `
            <style>
                .profile-header {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    margin-bottom: 2rem;
                }
                .profile-avatar {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #8b5cf6, #ec4899);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 3.5rem;
                    box-shadow: var(--shadow-glass);
                    flex-shrink: 0;
                    border: 4px solid white;
                }
                .profile-stats {
                    display: flex;
                    gap: 2rem;
                    margin-bottom: 1rem;
                }
                .stat-item {
                    text-align: center;
                }
                .stat-value {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--color-text-primary);
                }
                .stat-label {
                    font-size: 0.85rem;
                    color: var(--color-text-secondary);
                }
                .profile-bio {
                    font-size: 0.95rem;
                    color: var(--color-text-secondary);
                    line-height: 1.4;
                    max-width: 400px;
                }
                .edit-mode .display-el { display: none !important; }
                .edit-mode .edit-el { display: block !important; }
                .edit-el { display: none; }
                
                .active-radar {
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    border-radius: var(--radius-md);
                    padding: 1rem;
                    margin-bottom: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .explorer-avatar {
                    width: 40px; height: 40px; border-radius: 50%;
                    background: white; border: 2px solid #10b981;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.2rem; cursor: pointer; transition: transform 0.2s;
                }
                .explorer-avatar:hover { transform: translateY(-3px); }
                
                .profile-tabs {
                    display: flex;
                    border-top: 1px solid rgba(42,36,78,0.1);
                    margin-bottom: 1rem;
                }
                .profile-tab {
                    flex: 1; text-align: center; padding: 1rem;
                    font-weight: 600; cursor: pointer; color: var(--color-text-muted);
                    position: relative; transition: all 0.2s;
                }
                .profile-tab.active {
                    color: var(--color-primary);
                }
                .profile-tab.active::before {
                    content: ''; position: absolute; top: -1px; left: 0; right: 0;
                    height: 2px; background: var(--color-primary);
                }
                
                .photo-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.5rem;
                }
                .grid-item {
                    aspect-ratio: 1;
                    background: rgba(42,36,78,0.05);
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    cursor: pointer;
                    transition: transform 0.2s;
                    position: relative;
                    overflow: hidden;
                }
                .grid-item:hover {
                    transform: scale(0.98);
                }
                .grid-item-overlay {
                    position: absolute; inset: 0; background: rgba(42,36,78,0.8);
                    color: white; display: flex; align-items: center; justify-content: center;
                    opacity: 0; transition: opacity 0.2s; font-size: 1rem; font-weight: 600; text-align: center; padding: 0.5rem;
                }
                .grid-item:hover .grid-item-overlay {
                    opacity: 1;
                }
                @media (max-width: 600px) {
                    .profile-header { flex-direction: column; text-align: center; gap: 1rem; }
                    .profile-stats { justify-content: center; }
                    .profile-bio { margin: 0 auto; }
                    .profile-actions { justify-content: center; }
                }
            </style>

            <div class="animate-fade-in" style="max-width: 800px; margin: 0 auto; padding: 1rem;">
                <!-- Header Section -->
                <div id="profile-card" class="glass-card" style="padding: 2rem;">
                    <div class="profile-header">
                        <div class="profile-avatar">
                            ${name.charAt(0).toUpperCase()}
                        </div>
                        
                        <div style="flex-grow: 1;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
                                <h2 class="display-el" style="margin: 0; font-size: 1.8rem;">${name}</h2>
                                <input type="text" id="edit-name" class="input-field edit-el" value="${name}" style="font-size: 1.2rem; font-weight: 600; max-width: 250px;">
                                
                                <div class="display-el" style="display: flex; gap: 0.5rem;">
                                    <button class="btn btn-secondary" style="padding: 0.4rem 1rem; font-size: 0.9rem;" onclick="window.toggleEditProfile()">Edit Profile</button>
                                    <button class="btn btn-secondary" style="padding: 0.4rem; font-size: 0.9rem;" onclick="window.navigate('onboarding')">⚙️</button>
                                </div>
                                <div class="edit-el" style="display: flex; gap: 0.5rem;">
                                    <button class="btn btn-primary" style="padding: 0.4rem 1rem; font-size: 0.9rem;" onclick="window.saveProfile()">Save</button>
                                    <button class="btn btn-secondary" style="padding: 0.4rem 1rem; font-size: 0.9rem;" onclick="window.toggleEditProfile()">Cancel</button>
                                </div>
                            </div>
                            
                            <div class="profile-stats display-el">
                                <div class="stat-item">
                                    <div class="stat-value">${totalExplored}</div>
                                    <div class="stat-label">Places</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-value">${followers}</div>
                                    <div class="stat-label">Followers</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-value">${following}</div>
                                    <div class="stat-label">Following</div>
                                </div>
                            </div>
                            
                            <div class="display-el profile-bio">
                                ${bio}
                            </div>
                            <textarea id="edit-bio" class="input-field edit-el" style="width: 100%; min-height: 80px; resize: none; margin-top: 0.5rem;">${bio}</textarea>
                        </div>
                    </div>

                    <!-- Active Radar Section -->
                    <div class="active-radar display-el">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span style="font-size: 0.8rem; font-weight: bold; color: #10b981; text-transform: uppercase; letter-spacing: 1px;">📍 Live Radar</span>
                                <div style="font-weight: 600; color: var(--color-text-primary); margin-top: 0.2rem;">Currently at: ${activePlace.name}</div>
                            </div>
                            <span style="display: flex; gap: 4px; align-items: center;">
                                <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block; animation: pulse 2s infinite;"></span>
                                <span style="font-size: 0.8rem; color: #10b981;">Active</span>
                            </span>
                        </div>
                        
                        <div style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--color-text-secondary);">
                            <strong>Explore people here right now:</strong>
                            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                                ${activeExplorers.map(e => `
                                    <div class="explorer-avatar" title="${e.name}">
                                        ${e.icon}
                                    </div>
                                `).join('')}
                                <div class="explorer-avatar" style="background: rgba(16,185,129,0.1); border: 2px dashed #10b981; color: #10b981;">
                                    +12
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tabs -->
                    <div class="profile-tabs display-el">
                        <div class="profile-tab active" id="tab-grid" onclick="window.switchProfileTab('grid')">📷 GRID</div>
                        <div class="profile-tab" id="tab-taste" onclick="window.switchProfileTab('taste')">✨ TASTE</div>
                    </div>

                    <!-- Content Area -->
                    <div id="content-grid" class="display-el photo-grid">
                        ${historyPlaces.map(place => `
                            <div class="grid-item" onclick="window.navigate('place', {id: '${place.id}'})">
                                ${place.imageIcon}
                                <div class="grid-item-overlay">
                                    ${place.name}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div id="content-taste" class="display-el" style="display: none; background: rgba(42,36,78,0.02); padding: 1.5rem; border-radius: var(--radius-md);">
                        <h3 style="border-bottom: 1px solid rgba(42,36,78,0.1); padding-bottom: 0.5rem; margin-bottom: 1rem;">Taste Profile</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div>
                                <strong>Preferred Vibes:</strong>
                                <div style="margin-top: 0.5rem;">
                                    ${(taste.vibes || []).map(v => `<span style="background: rgba(255,255,255,0.8); padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.85rem; display: inline-block; margin: 0 0.2rem 0.2rem 0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">${v}</span>`).join('') || 'None'}
                                </div>
                            </div>
                            <div>
                                <strong>Preferred Food:</strong>
                                <div style="margin-top: 0.5rem;">
                                    ${(taste.foods || []).map(v => `<span style="background: rgba(255,255,255,0.8); padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.85rem; display: inline-block; margin: 0 0.2rem 0.2rem 0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">${v}</span>`).join('') || 'None'}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <style>
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }
            </style>
        `;

        window.toggleEditProfile = () => {
            const card = document.getElementById('profile-card');
            card.classList.toggle('edit-mode');
        };

        window.saveProfile = () => {
            const newName = document.getElementById('edit-name').value;
            const newBio = document.getElementById('edit-bio').value;
            window.state.user.name = newName;
            window.state.user.bio = newBio;
            
            // Save to localStorage if guest session exists
            const savedProfile = localStorage.getItem('smout_user_profile');
            if(savedProfile) {
                const parsed = JSON.parse(savedProfile);
                parsed.name = newName;
                parsed.bio = newBio;
                localStorage.setItem('smout_user_profile', JSON.stringify(parsed));
            }
            
            window.navigate('profile'); // Re-render to show changes
        };

        window.switchProfileTab = (tab) => {
            document.getElementById('tab-grid').classList.remove('active');
            document.getElementById('tab-taste').classList.remove('active');
            
            document.getElementById('content-grid').style.display = 'none';
            document.getElementById('content-taste').style.display = 'none';

            if (tab === 'grid') {
                document.getElementById('tab-grid').classList.add('active');
                document.getElementById('content-grid').style.display = 'grid';
            } else {
                document.getElementById('tab-taste').classList.add('active');
                document.getElementById('content-taste').style.display = 'block';
            }
        };
    }
};
