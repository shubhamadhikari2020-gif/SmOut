// Simple SPA Router & State Management
const state = {
    user: null, // { name, email, tasteProfile: null }
    currentView: 'home',
    groups: [],
    history: []
};

// Views
import { HomeView } from './views/HomeView.js';
import { SignupView } from './views/SignupView.js';
import { OnboardingView } from './views/OnboardingView.js';
import { DashboardView } from './views/DashboardView.js';
import { GroupChatView } from './views/GroupChatView.js';
import { PlannerView } from './views/PlannerView.js';
import { PlaceView } from './views/PlaceView.js';
import { ProfileView } from './views/ProfileView.js';
import { TranslatorView } from './views/TranslatorView.js';

const routes = {
    'home': HomeView,
    'signup': SignupView,
    'onboarding': OnboardingView,
    'dashboard': DashboardView,
    'groupChat': GroupChatView,
    'planner': PlannerView,
    'place': PlaceView,
    'profile': ProfileView,
    'translator': TranslatorView
};

function generateMiniMapCard(place) {
    return `
        <div style="display: flex; gap: 1rem; padding: 0.75rem; border-radius: var(--radius-md); transition: all 0.2s; background: rgba(255,255,255,0.5); cursor: pointer;" class="hover-bg" onclick="window.navigate('place', {id: '${place.id}'})">
            <div style="width: 70px; height: 70px; background: rgba(42,36,78,0.05); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; flex-shrink: 0;">
                ${place.imageIcon}
            </div>
            <div style="display: flex; flex-direction: column; justify-content: center; flex-grow: 1;">
                <strong style="display: block; color: var(--color-text-primary); font-size: 1rem; margin-bottom: 0.1rem;">${place.name}</strong>
                <div style="font-size: 0.8rem; color: var(--color-text-primary); margin-bottom: 0.1rem; font-weight: 500;">
                    ⭐ ${place.qualityScore} • ${place.category}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.2rem;">
                    <div style="font-size: 0.8rem; color: var(--color-text-muted);">
                        ${place.priceLevel} • <span style="color: #10b981; font-weight: 600;">Open</span>
                    </div>
                    <button class="btn btn-primary" style="padding: 0.2rem 0.5rem; font-size: 0.7rem;" onclick="event.stopPropagation(); window.startNavigation('${place.id}')">📍 Navigate</button>
                </div>
            </div>
        </div>
    `;
}

function navigate(viewName, data = {}) {
    if (!routes[viewName]) return;
    state.currentView = viewName;
    const appContainer = document.getElementById('app-container');
    appContainer.innerHTML = ''; // Clear current

    // Render navigation
    appContainer.innerHTML += `
        <header class="nav-header animate-fade-in" style="position: relative; z-index: 50;">
            <div class="logo" onclick="window.navigate('home')" style="cursor:pointer;">SmOut</div>
            <div class="nav-actions" style="display: flex; gap: 1rem; align-items: center;">
                ${state.user && state.user.tasteProfile ?
            `<button class="btn btn-secondary" onclick="window.navigate('dashboard')">Dashboard</button>
                     <button class="btn btn-primary" onclick="window.navigate('planner')">Smart Planner</button>
                     <button class="btn btn-primary" style="background: linear-gradient(135deg, #8b5cf6, #ec4899); border: none;" onclick="window.navigate('translator')">🎙️ AI Translator</button>
                     
                     <div style="position: relative; margin-left: 0.5rem;" id="nav-profile-container">
                         <div id="profile-icon" onclick="document.getElementById('profile-dropdown').style.display = document.getElementById('profile-dropdown').style.display === 'block' ? 'none' : 'block'" style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #8b5cf6, #ec4899); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem; cursor: pointer; box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                             ${state.user.name ? state.user.name.charAt(0).toUpperCase() : 'G'}
                         </div>
                         <div id="profile-dropdown" class="glass-card" style="display: none; position: absolute; top: 120%; right: 0; width: 200px; padding: 0.5rem; z-index: 1000; animation: fadeIn 0.2s ease-out; box-shadow: var(--shadow-glass); background: white;">
                             <div style="padding: 0.5rem; border-bottom: 1px solid rgba(42,36,78,0.1); margin-bottom: 0.5rem;">
                                 <strong style="color: var(--color-text-primary); display: block;">${state.user.name || 'Guest User'}</strong>
                                 <span style="font-size: 0.75rem; color: var(--color-text-muted);">SmOut Explorer</span>
                             </div>
                             <button class="btn" style="width: 100%; text-align: left; padding: 0.5rem; background: transparent; color: var(--color-text-primary); border: none; cursor: pointer;" onclick="document.getElementById('profile-dropdown').style.display='none'; window.navigate('profile')" onmouseover="this.style.background='rgba(42,36,78,0.05)'" onmouseout="this.style.background='transparent'">👤 View Profile</button>
                             <button class="btn" style="width: 100%; text-align: left; padding: 0.5rem; background: transparent; color: var(--color-text-primary); border: none; cursor: pointer;" onclick="document.getElementById('profile-dropdown').style.display='none'; window.navigate('onboarding')" onmouseover="this.style.background='rgba(42,36,78,0.05)'" onmouseout="this.style.background='transparent'">⚙️ Edit Preferences</button>
                             <button class="btn" style="width: 100%; text-align: left; padding: 0.5rem; background: transparent; color: #ef4444; border: none; cursor: pointer;" onclick="window.logoutUser()" onmouseover="this.style.background='rgba(239,68,68,0.1)'" onmouseout="this.style.background='transparent'">🚪 Logout / Clear Data</button>
                         </div>
                     </div>
                     ` :
            `<button class="btn btn-primary" onclick="window.navigate('onboarding')">Get Started</button>
                     <button class="btn btn-secondary" onclick="window.navigate('signup')">Login to Sync</button>`
        }
            </div>
        </header>

        <!-- Global Create Group Modal -->
        <div id="global-create-group-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); z-index: 9999; align-items: center; justify-content: center;">
            <div class="glass-card animate-fade-in" style="width: 100%; max-width: 400px; padding: 2rem;">
                <h2 style="margin-top: 0;">Create New Hangout</h2>
                <p style="color: var(--color-text-secondary); margin-bottom: 1.5rem;">Give your group a name to get started.</p>
                <input type="text" id="global-new-group-name" class="input-field" placeholder="e.g. Weekend Squad" style="margin-bottom: 1.5rem; width: 100%;" onkeypress="if(event.key === 'Enter') window.submitCreateGroup()">
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button class="btn btn-secondary" onclick="document.getElementById('global-create-group-modal').style.display='none'">Cancel</button>
                    <button class="btn btn-primary" onclick="window.submitCreateGroup()">Create Group</button>
                </div>
            </div>
        </div>
    `;

    // Render view
    const viewElement = document.createElement('main');
    viewElement.className = 'animate-fade-in';
    viewElement.style.animationDelay = '0.1s';

    routes[viewName].render(viewElement, state, data);
    appContainer.appendChild(viewElement);
}

// Make globally available
window.navigate = navigate;
window.state = state;
window.logoutUser = () => {
    localStorage.removeItem('smout_user_profile');
    localStorage.removeItem('smout_user_history');
    state.user = null;
    state.history = [];
    navigate('home');
};

window.createGroup = () => {
    document.getElementById('global-create-group-modal').style.display = 'flex';
    document.getElementById('global-new-group-name').value = '';
    document.getElementById('global-new-group-name').focus();
};

window.submitCreateGroup = () => {
    const groupName = document.getElementById('global-new-group-name').value;
    if (groupName && groupName.trim()) {
        const newGroup = {
            id: 'g' + Date.now(),
            name: groupName.trim(),
            members: [{ name: state.user.name, tasteProfile: state.user.tasteProfile }],
            chat: [{ sender: 'System', msg: `Welcome to ${groupName.trim()}! Share the invite link to add friends.`, time: 'Now', isSystem: true }],
            picks: []
        };
        state.groups.push(newGroup);
        localStorage.setItem('smout_groups', JSON.stringify(state.groups));
        document.getElementById('global-create-group-modal').style.display = 'none';
        window.navigate('groupChat', { groupId: newGroup.id });
    }
};

// Close dropdown if clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('profile-dropdown');
    const container = document.getElementById('nav-profile-container');
    if (dropdown && container && !container.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

// Init
document.addEventListener('DOMContentLoaded', () => {
    // Check local storage for existing guest session
    const savedProfile = localStorage.getItem('smout_user_profile');
    if (savedProfile) {
        state.user = { name: JSON.parse(savedProfile).name || "Guest Explorer", tasteProfile: JSON.parse(savedProfile) };
        state.history = JSON.parse(localStorage.getItem('smout_user_history')) || [];
    }

    // Load groups from local storage
    const loadGroups = () => {
        const savedGroups = localStorage.getItem('smout_groups');
        if (savedGroups) {
            state.groups = JSON.parse(savedGroups);
        } else {
            // Mock initial groups if empty
            state.groups = [
                {
                    id: 'g1', name: 'Weekend Squad', members: [{ name: 'Alex' }, { name: 'Sam' }],
                    chat: [{ sender: 'Alex', msg: 'Where are we going this weekend?', time: '10:00 AM' }], picks: []
                },
                {
                    id: 'g2', name: 'Work Colleagues', members: [{ name: 'David' }, { name: 'Sarah' }, { name: 'Mike' }, { name: 'Emma' }],
                    chat: [{ sender: 'David', msg: "Let's finalize the team dinner for Friday.", time: '09:00 AM' }], picks: []
                }
            ];
            localStorage.setItem('smout_groups', JSON.stringify(state.groups));
        }
    };
    loadGroups();

    // Listen for storage events for real-time cross-tab sync
    window.addEventListener('storage', (e) => {
        if (e.key === 'smout_groups') {
            state.groups = JSON.parse(e.newValue);
            // Re-render current view if it depends on groups
            if (state.currentView === 'dashboard' || state.currentView === 'groupChat') {
                navigate(state.currentView, { groupId: window.currentGroupId });
            }
        }
    });

    window.joinGroup = (joinGroupId) => {
        const group = state.groups.find(g => g.id === joinGroupId);
        if (group) {
            if (!group.members.some(m => m.name === state.user.name)) {
                group.members.push({ name: state.user.name, tasteProfile: state.user.tasteProfile });
                group.chat.push({ sender: 'System', msg: `${state.user.name} joined the group!`, time: 'Now', isSystem: true });
                localStorage.setItem('smout_groups', JSON.stringify(state.groups));
            }
            navigate('groupChat', { groupId: joinGroupId });
        } else {
            alert('Group not found!');
            navigate('dashboard');
        }
    };

    // Intercept Join Links
    const hash = window.location.hash;
    if (hash.startsWith('#join?groupId=')) {
        const joinGroupId = hash.split('=')[1];
        window.location.hash = ''; // Clear hash

        if (state.user) {
            window.joinGroup(joinGroupId);
            return;
        } else {
            localStorage.setItem('smout_pending_join', joinGroupId);
            navigate('signup');
            return;
        }
    }

    if (state.user && state.user.tasteProfile) {
        navigate('dashboard');
    } else {
        navigate('home');
    }
});
