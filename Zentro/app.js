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

const routes = {
    'home': HomeView,
    'signup': SignupView,
    'onboarding': OnboardingView,
    'dashboard': DashboardView,
    'groupChat': GroupChatView,
    'planner': PlannerView,
    'place': PlaceView,
    'profile': ProfileView
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
        <header class="nav-header animate-fade-in">
            <div class="logo" onclick="window.navigate('home')" style="cursor:pointer;">SmOut</div>
            <div class="nav-actions" style="display: flex; gap: 1rem; align-items: center;">
                ${state.user && state.user.tasteProfile ? 
                    `<button class="btn btn-secondary" onclick="window.navigate('dashboard')">Dashboard</button>
                     <button class="btn btn-primary" onclick="window.navigate('planner')">Smart Planner</button>
                     
                     <div style="position: relative; margin-left: 0.5rem;" id="nav-profile-container">
                         <div id="profile-icon" onclick="document.getElementById('profile-dropdown').style.display = document.getElementById('profile-dropdown').style.display === 'block' ? 'none' : 'block'" style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #8b5cf6, #ec4899); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem; cursor: pointer; box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                             ${state.user.name ? state.user.name.charAt(0).toUpperCase() : 'G'}
                         </div>
                         <div id="profile-dropdown" class="glass-card" style="display: none; position: absolute; top: 120%; right: 0; width: 200px; padding: 0.5rem; z-index: 1000; animation: fadeIn 0.2s ease-out; box-shadow: var(--shadow-glass);">
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
    // Intercept Join Links
    const hash = window.location.hash;
    if (hash.startsWith('#join?groupId=')) {
        const joinGroupId = hash.split('=')[1];
        alert(`You have been invited to join group: ${joinGroupId}! Please sign up or log in to continue.`);
        navigate('signup');
        return;
    }

    // Check local storage for existing guest session
    const savedProfile = localStorage.getItem('smout_user_profile');
    if (savedProfile) {
        state.user = { name: "Guest Explorer", tasteProfile: JSON.parse(savedProfile) };
        state.history = JSON.parse(localStorage.getItem('smout_user_history')) || [];
    }

    if (state.user && state.user.tasteProfile) {
        navigate('dashboard');
    } else {
        navigate('home');
    }
});
