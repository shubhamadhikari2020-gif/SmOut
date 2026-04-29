import { getRecommendations } from '../utils/recommendationEngine.js';
import { mockPlaces } from '../data/mockPlaces.js';

export const DashboardView = {
    render: (container, state) => {
        if (!state.user) {
            window.navigate('onboarding');
            return;
        }

        window.currentViewMode = window.currentViewMode || 'list';
        window.currentMood = window.currentMood || '';
        window.currentTimeAvail = window.currentTimeAvail || '';
        window.currentBudget = window.currentBudget || 'Any';
        window.currentDistance = window.currentDistance || 'Any';
        window.currentAmbience = window.currentAmbience || 'Any';
        window.currentCrowd = window.currentCrowd || 'Any';

        const renderContent = () => {
            const context = { 
                mood: window.currentMood, 
                timeAvailability: window.currentTimeAvail, 
                budget: window.currentBudget,
                distance: window.currentDistance,
                ambience: window.currentAmbience,
                crowd: window.currentCrowd,
                location: 'Gachibowli' 
            };
            const recommendations = getRecommendations(state.user.tasteProfile, state.history, context);

            const listBtnClass = window.currentViewMode === 'list' ? 'btn-primary' : 'btn-secondary';
            const mapBtnClass = window.currentViewMode === 'map' ? 'btn-primary' : 'btn-secondary';

            const headerHTML = `
                <style>
                    .hover-bg:hover { background: rgba(42, 36, 78, 0.05) !important; }
                    #map { height: 100%; width: 100%; z-index: 1; border-radius: var(--radius-md); }
                    .context-bar { background: rgba(255,255,255,0.7); padding: 1rem; border-radius: var(--radius-md); display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; box-shadow: var(--shadow-glass); }
                    .scroll-sidebar::-webkit-scrollbar { width: 6px; }
                    .scroll-sidebar::-webkit-scrollbar-thumb { background: rgba(42,36,78,0.2); border-radius: 4px; }
                </style>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; margin-bottom: 1rem;">
                    <h2 style="margin: 0; display: flex; align-items: center; gap: 1rem;">
                        Top Picks for You 
                        <span style="font-size:0.85rem; color:var(--color-primary); background:rgba(139, 92, 246, 0.1); padding:0.25rem 0.75rem; border-radius:var(--radius-full); font-weight: 500;">✨ Based on your taste</span>
                    </h2>
                    <div style="display: flex; gap: 0.5rem; background: rgba(255,255,255,0.5); padding: 0.25rem; border-radius: var(--radius-full);">
                        <button class="btn ${listBtnClass}" style="padding: 0.5rem 1rem;" onclick="window.toggleViewMode('list')">List View</button>
                        <button class="btn ${mapBtnClass}" style="padding: 0.5rem 1rem;" onclick="window.toggleViewMode('map')">Map View</button>
                    </div>
                </div>

                <div class="context-bar" style="flex-wrap: wrap;">
                    <strong style="color: var(--color-primary);">Filters & Context:</strong>
                    
                    <select class="input-field" style="width: auto; padding: 0.5rem; background: white;" onchange="window.updateContext('mood', this.value)">
                        <option value="">Any Mood</option>
                        <option value="Chill" ${window.currentMood === 'Chill' ? 'selected' : ''}>Chill</option>
                        <option value="Party" ${window.currentMood === 'Party' ? 'selected' : ''}>Party</option>
                    </select>
                    
                    <select class="input-field" style="width: auto; padding: 0.5rem; background: white;" onchange="window.updateContext('time', this.value)">
                        <option value="">Any Time</option>
                        <option value="Short (< 1hr)" ${window.currentTimeAvail === 'Short (< 1hr)' ? 'selected' : ''}>Short (&lt; 1hr)</option>
                    </select>

                    <select class="input-field" style="width: auto; padding: 0.5rem; background: white;" onchange="window.updateContext('budget', this.value)">
                        <option value="Any">Any Budget</option>
                        <option value="$" ${window.currentBudget === '$' ? 'selected' : ''}>$ (Cheap)</option>
                        <option value="$$" ${window.currentBudget === '$$' ? 'selected' : ''}>$$ (Moderate)</option>
                        <option value="$$$" ${window.currentBudget === '$$$' ? 'selected' : ''}>$$$ (Premium)</option>
                    </select>

                    <select class="input-field" style="width: auto; padding: 0.5rem; background: white;" onchange="window.updateContext('distance', this.value)">
                        <option value="Any">Any Distance</option>
                        <option value="3" ${window.currentDistance === '3' ? 'selected' : ''}>Within 3 km</option>
                        <option value="5" ${window.currentDistance === '5' ? 'selected' : ''}>Within 5 km</option>
                        <option value="10" ${window.currentDistance === '10' ? 'selected' : ''}>Within 10 km</option>
                    </select>

                    <select class="input-field" style="width: auto; padding: 0.5rem; background: white;" onchange="window.updateContext('ambience', this.value)">
                        <option value="Any">Any Ambience</option>
                        <option value="Quiet" ${window.currentAmbience === 'Quiet' ? 'selected' : ''}>Quiet</option>
                        <option value="Aesthetic" ${window.currentAmbience === 'Aesthetic' ? 'selected' : ''}>Aesthetic</option>
                        <option value="Lively" ${window.currentAmbience === 'Lively' ? 'selected' : ''}>Lively</option>
                        <option value="Rooftop" ${window.currentAmbience === 'Rooftop' ? 'selected' : ''}>Rooftop</option>
                    </select>

                    <select class="input-field" style="width: auto; padding: 0.5rem; background: white;" onchange="window.updateContext('crowd', this.value)">
                        <option value="Any">Any Crowd</option>
                        <option value="Low" ${window.currentCrowd === 'Low' ? 'selected' : ''}>Low Crowd</option>
                        <option value="Medium" ${window.currentCrowd === 'Medium' ? 'selected' : ''}>Medium Crowd</option>
                        <option value="High" ${window.currentCrowd === 'High' ? 'selected' : ''}>High Crowd</option>
                    </select>
                </div>
            `;

            if (window.currentViewMode === 'list') {
                container.innerHTML = headerHTML + `
                    <div style="display: grid; grid-template-columns: 1fr 300px; gap: 2rem; margin-top: 2rem;">
                        <!-- Main Content: Recommendations -->
                        <div>
                            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                                ${recommendations.map(place => generateMockPlaceCard(place)).join('')}
                            </div>
                        </div>

                        <!-- Sidebar: Groups & Chat -->
                        <div class="glass-card" style="align-self: start;">
                            <h3 style="margin-bottom: 1.5rem;">Your Hangout Groups</h3>
                            <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
                                <div style="padding: 1rem; background: rgba(42, 36, 78, 0.03); border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s;" class="hover-bg" onclick="window.navigate('groupChat', {groupId: 'g1'})">
                                    <strong>Weekend Squad</strong> <br/>
                                    <span style="font-size: 0.85rem; color: var(--color-text-secondary);">3 members • Deciding...</span>
                                </div>
                                <div style="padding: 1rem; background: rgba(42, 36, 78, 0.03); border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s;" class="hover-bg" onclick="window.navigate('groupChat', {groupId: 'g2'})">
                                    <strong>Work Colleagues</strong> <br/>
                                    <span style="font-size: 0.85rem; color: var(--color-text-secondary);">5 members • Finalized</span>
                                </div>
                            </div>
                            <button class="btn btn-primary" style="width: 100%;">+ Create Group</button>
                        </div>
                    </div>
                `;
            } else {
                container.innerHTML = headerHTML + `
                    <div style="display: grid; grid-template-columns: 1fr 350px; gap: 1rem; margin-top: 1rem; height: 75vh; position: relative;">
                        <!-- Map View -->
                        <div style="border: 4px solid white; border-radius: var(--radius-md); box-shadow: var(--shadow-glass); position: relative;">
                            <div id="map"></div>
                        </div>

                        <!-- Scrollable Places Sidebar -->
                        <div class="glass-card scroll-sidebar" style="padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem;">
                            <h3 style="margin-top: 0; margin-bottom: 1rem;">${recommendations.length} Places</h3>
                            ${recommendations.map(place => generateMiniMapCard(place)).join('')}
                        </div>
                    </div>
                `;

                setTimeout(() => {
                    initMap(recommendations);
                }, 100);
            }
        };

        window.toggleViewMode = (mode) => {
            window.currentViewMode = mode;
            renderContent();
        };

        window.updateContext = (type, value) => {
            if (type === 'mood') window.currentMood = value;
            if (type === 'time') window.currentTimeAvail = value;
            if (type === 'budget') window.currentBudget = value;
            if (type === 'distance') window.currentDistance = value;
            if (type === 'ambience') window.currentAmbience = value;
            if (type === 'crowd') window.currentCrowd = value;
            renderContent();
        };

        window.markVisited = (placeId) => {
            state.history = state.history || [];
            if (!state.history.find(h => h.placeId === placeId)) {
                state.history.push({ placeId, date: new Date().toISOString() });
                localStorage.setItem('smout_user_history', JSON.stringify(state.history));
                
                if (window.currentViewMode === 'list') {
                    // Show a quick non-intrusive alert so they know something happened
                    alert('✓ Place marked as visited! Switch to Map View to see your Territory progress.');
                }
            }
            renderContent(); 
        };

        window.startNavigation = (placeId) => {
            if (window.currentViewMode !== 'map') {
                window.toggleViewMode('map');
                setTimeout(() => runNavigationSimulation(placeId), 500); 
            } else {
                runNavigationSimulation(placeId);
            }
        };

        renderContent();
    }
};

function runNavigationSimulation(placeId) {
    const place = mockPlaces.find(p => p.id === placeId);
    if (!place || !window.currentMap) return;

    // Simulate requesting location
    alert("Requesting Location Access... (Simulated)");

    // User's mocked starting location (e.g. Gachibowli)
    const userLat = 17.4401;
    const userLng = 78.3489;

    // Destination location (using deterministic formula from initMap)
    const seed = place.name.length;
    const destLat = 17.4065 + (Math.sin(seed) * 0.03) * (place.distance * 0.5);
    const destLng = 78.4772 + (Math.cos(seed) * 0.03) * (place.distance * 0.5);

    // Transport Recommendation based on currentBudget
    const budget = window.currentBudget || 'Any';
    let transportMode = 'Auto (₹120) - 25 mins';
    let transportEmoji = '🛺';
    if (budget === '$') { transportMode = 'City Bus (₹25) - 45 mins'; transportEmoji = '🚌'; }
    if (budget === '$$$') { transportMode = 'Premium Uber (₹350) - 20 mins'; transportEmoji = '🚕'; }

    // Show Transport UI Overlay
    let navUI = document.getElementById('nav-ui-overlay');
    if (!navUI) {
        navUI = document.createElement('div');
        navUI.id = 'nav-ui-overlay';
        navUI.style = 'position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(255,255,255,0.95); padding: 1rem 2rem; border-radius: var(--radius-full); box-shadow: var(--shadow-glass); z-index: 1000; display: flex; align-items: center; gap: 1rem; border: 2px solid var(--color-primary); min-width: 350px;';
        document.getElementById('map').parentElement.appendChild(navUI);
    }
    navUI.innerHTML = `
        <span style="font-size: 2rem;">${transportEmoji}</span>
        <div style="flex-grow: 1;">
            <strong style="color: var(--color-primary); display: block; margin-bottom: 0.2rem;">Route to ${place.name}</strong>
            <span style="font-size: 0.85rem; color: var(--color-text-muted); font-weight: 500;">Recommended: ${transportMode}</span>
        </div>
        <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="document.getElementById('nav-ui-overlay').remove(); clearInterval(window.navInterval); window.currentMap.removeLayer(window.navMarker); window.currentMap.removeLayer(window.navRoute);">Cancel</button>
    `;

    // Clear previous routes/markers
    if (window.navRoute) window.currentMap.removeLayer(window.navRoute);
    if (window.navMarker) window.currentMap.removeLayer(window.navMarker);

    // Draw dashed Route
    window.navRoute = L.polyline([[userLat, userLng], [destLat, destLng]], {
        color: '#8b5cf6', weight: 5, dashArray: '10, 10'
    }).addTo(window.currentMap);

    window.currentMap.fitBounds(window.navRoute.getBounds(), { padding: [50, 50] });

    // Live moving marker
    const userIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="font-size: 1.5rem; filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.3));">🚶‍♂️</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    window.navMarker = L.marker([userLat, userLng], { icon: userIcon }).addTo(window.currentMap);

    // Animation loop simulating live movement
    let progress = 0;
    if (window.navInterval) clearInterval(window.navInterval);
    
    window.navInterval = setInterval(() => {
        progress += 0.005; // 0.5% per tick for smooth animation
        if (progress >= 1) {
            clearInterval(window.navInterval);
            navUI.innerHTML = `<span style="font-size: 2rem;">✅</span><strong style="color: var(--color-primary);">Arrived at ${place.name}!</strong>`;
            setTimeout(() => navUI.remove(), 3000);
            return;
        }

        const currentLat = userLat + (destLat - userLat) * progress;
        const currentLng = userLng + (destLng - userLng) * progress;
        window.navMarker.setLatLng([currentLat, currentLng]);

    }, 50);
}

function initMap(recommendations) {
    if (window.currentMap) window.currentMap.remove();
    const map = L.map('map').setView([17.4065, 78.4772], 12);
    window.currentMap = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors & CartoDB'
    }).addTo(map);

    // Territory Logic (Phase 6)
    const visitedIds = (window.state.history || []).map(h => h.placeId);
    
    const territories = [
        { name: "Hyderabad Central", lat: 17.4065, lng: 78.4772, radius: 5000 },
        { name: "Cyberabad / IT Corridor", lat: 17.4400, lng: 78.3800, radius: 5000 },
        { name: "Secunderabad", lat: 17.4400, lng: 78.5000, radius: 5000 }
    ];

    territories.forEach(territory => {
        let visitsInTerritory = 0;
        visitedIds.forEach(id => {
            const place = mockPlaces.find(p => p.id === id);
            if (place) {
                const seed = place.name.length;
                const pLat = 17.4065 + (Math.sin(seed) * 0.03) * (place.distance * 0.5);
                const pLng = 78.4772 + (Math.cos(seed) * 0.03) * (place.distance * 0.5);
                const distMeters = Math.sqrt(Math.pow(pLat - territory.lat, 2) + Math.pow(pLng - territory.lng, 2)) * 111000;
                if (distMeters <= territory.radius) {
                    visitsInTerritory++;
                }
            }
        });

        const isExplored = visitsInTerritory >= 3;
        const color = isExplored ? '#10b981' : '#6b7280'; 
        const fillOpacity = isExplored ? 0.3 : 0.1;
        const statusText = isExplored ? `Explored Territory (Level ${visitsInTerritory})` : `Unexplored (${visitsInTerritory}/3 visits to unlock)`;

        L.circle([territory.lat, territory.lng], {
            color: color,
            fillColor: color,
            fillOpacity: fillOpacity,
            weight: 2,
            radius: territory.radius,
            dashArray: isExplored ? '' : '5, 5'
        }).addTo(map).bindPopup(`<strong>${territory.name}</strong><br/>${statusText}`);
    });

    recommendations.forEach((place, i) => {
        const seed = place.name.length;
        const offsetLat = (Math.sin(seed) * 0.03) * (place.distance * 0.5);
        const offsetLng = (Math.cos(seed) * 0.03) * (place.distance * 0.5);
        const lat = 17.4065 + offsetLat;
        const lng = 78.4772 + offsetLng;

        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(`
            <div style="text-align: center; font-family: var(--font-family); min-width: 150px;">
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${place.imageIcon}</div>
                <strong style="font-size: 1.1rem; color: var(--color-primary); display: block;">${place.name}</strong>
                <span style="font-size: 0.8rem; color: var(--color-text-muted);">${place.distance} km • ${place.tags[0] || place.category}</span><br>
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-top: 0.5rem; background: rgba(0,0,0,0.05); padding: 0.5rem; border-radius: 4px;">
                    <span>👥 ${place.baseCrowdLevel}</span>
                    <span>⏳ ${place.waitingTime}</span>
                </div>
                <div style="margin-top: 0.5rem;">
                    <span style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 0.2rem 0.5rem; border-radius: 10px; font-size: 0.75rem; font-weight: bold;">${place.matchPercentage}% Match</span>
                </div>
                <button class="btn btn-primary" style="padding: 0.2rem 0.5rem; font-size: 0.7rem; margin-top: 0.5rem; width: 100%;" onclick="window.navigate('place', {id: '${place.id}'})">🔍 Know More</button>
            </div>
        `);

        if(i === 0) marker.openPopup();
    });
}

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

function generateMockPlaceCard(place) {
    return `
        <div class="glass-card" style="display: flex; gap: 1.5rem; padding: 1.5rem;">
            <div style="width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: var(--radius-md); flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 4rem;">${place.imageIcon}</span>
            </div>
            <div style="flex-grow: 1;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <h3 style="margin-bottom: 0.5rem; font-size: 1.5rem;">${place.name}</h3>
                    <span style="background: rgba(16, 185, 129, 0.2); color: var(--color-accent); padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600;">${place.matchPercentage}% Match</span>
                </div>
                <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">${place.tags.join(' • ')} • ${place.priceLevel} • ${place.distance} km</p>
                
                <div style="display: flex; gap: 1rem; margin-bottom: 1rem; font-size: 0.85rem;">
                    <span style="background: rgba(42,36,78,0.05); padding: 0.2rem 0.5rem; border-radius: 4px;">⭐ ${place.qualityScore}/5 Quality</span>
                    <span style="background: rgba(42,36,78,0.05); padding: 0.2rem 0.5rem; border-radius: 4px;">👥 ${place.baseCrowdLevel} Crowd</span>
                    <span style="background: rgba(42,36,78,0.05); padding: 0.2rem 0.5rem; border-radius: 4px;">⏳ ${place.waitingTime} Wait</span>
                </div>

                <div style="background: rgba(139, 92, 246, 0.1); border-left: 3px solid var(--color-primary); padding: 0.75rem 1rem; border-radius: 0 var(--radius-md) var(--radius-md) 0; margin-bottom: 1rem;">
                    <p style="margin: 0; font-size: 0.9rem; color: var(--color-text-secondary);">✨ <strong>Why we recommend this:</strong> ${place.reason}</p>
                </div>
                
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="window.navigate('place', {id: '${place.id}'})">
                        🔍 Know More
                    </button>
                    <button class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="window.startNavigation('${place.id}')">
                        📍 Get Directions
                    </button>
                    <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; margin-left: auto;" onclick="window.markVisited('${place.id}')">
                        ✓
                    </button>
                </div>
            </div>
        </div>
    `;
}
