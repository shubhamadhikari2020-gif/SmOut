import { mockPlaces } from '../data/mockPlaces.js';

export const PlannerView = {
    render: (container, state) => {
        if (!state.user) {
            window.navigate('onboarding');
            return;
        }

        window.plannerState = window.plannerState || { step: 'form', plan: [] };

        const renderForm = () => {
            container.innerHTML = `
                <div style="max-width: 600px; margin: 2rem auto;" class="animate-fade-in">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                        <h2>Design Your Outing</h2>
                        <button class="btn btn-secondary" onclick="window.navigate('dashboard')">Back</button>
                    </div>
                    
                    <div class="glass-card" style="padding: 2.5rem;">
                        <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">Tell us what you're looking for, and our AI will stitch together the perfect itinerary and route.</p>
                        
                        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                            <div>
                                <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Group Type / Vibe</label>
                                <select id="plan-group" class="input-field" style="background: white;">
                                    <option value="Casual">Casual Hangout</option>
                                    <option value="Chill">Chill & Relaxed</option>
                                    <option value="Party">Party / High Energy</option>
                                    <option value="Professional">Professional / Work</option>
                                </select>
                            </div>

                            <div>
                                <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Budget</label>
                                <select id="plan-budget" class="input-field" style="background: white;">
                                    <option value="Any">Any Budget</option>
                                    <option value="$">$ (Budget Friendly)</option>
                                    <option value="$$">$$ (Moderate)</option>
                                    <option value="$$$">$$$ (Premium)</option>
                                </select>
                            </div>

                            <div>
                                <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Max Distance</label>
                                <select id="plan-distance" class="input-field" style="background: white;">
                                    <option value="100">Any Distance</option>
                                    <option value="3">Within 3 km</option>
                                    <option value="5">Within 5 km</option>
                                    <option value="10">Within 10 km</option>
                                </select>
                            </div>

                            <div>
                                <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Time Available</label>
                                <select id="plan-time" class="input-field" style="background: white;">
                                    <option value="1">Short (&lt; 2 hours) - 1 Stop</option>
                                    <option value="2">Medium (2-4 hours) - 2 Stops</option>
                                    <option value="3" selected>Long (4+ hours) - 3 Stops</option>
                                </select>
                            </div>

                            <button class="btn btn-primary" style="width: 100%; margin-top: 1rem; padding: 1rem;" onclick="window.generatePlan()">Generate Smart Plan</button>
                        </div>
                    </div>
                </div>
            `;
        };

        const renderPlan = () => {
            const plan = window.plannerState.plan;
            container.innerHTML = `
                <style>
                    #planner-map { height: 100%; border-radius: var(--radius-md); width: 100%; min-height: 400px; }
                </style>
                <div style="max-width: 1000px; margin: 2rem auto;" class="animate-fade-in">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                        <h2>Your Smart Outing Plan</h2>
                        <button class="btn btn-secondary" onclick="window.resetPlanner()">Start Over</button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                        
                        <!-- Timeline -->
                        <div class="glass-card" style="padding: 2rem;">
                            <h3 style="margin-bottom: 2rem; color: var(--color-primary);">Itinerary</h3>
                            <div style="position: relative; padding-left: 2rem; border-left: 2px dashed var(--color-primary);">
                                ${plan.map((place, index) => `
                                    <div style="position: relative; margin-bottom: ${index === plan.length - 1 ? '0' : '2.5rem'};">
                                        <div style="position: absolute; left: -2.65rem; top: 0; background: var(--color-primary); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">${index + 1}</div>
                                        <h3 style="margin-bottom: 0.5rem; color: var(--color-primary);">${place.name}</h3>
                                        <div style="background: rgba(255,255,255,0.5); padding: 1rem; border-radius: var(--radius-md);">
                                            <p style="margin: 0; font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>Activity:</strong> ${place.category}</p>
                                            <p style="margin: 0; font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>Expected Wait:</strong> ⏳ ${place.waitingTime}</p>
                                            <p style="margin: 0; font-size: 0.9rem;"><strong>Budget:</strong> ${place.priceLevel} • <strong>Distance:</strong> ${place.distance}km</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Map View -->
                        <div class="glass-card" style="padding: 0; border: 4px solid white;">
                            <div id="planner-map"></div>
                        </div>

                    </div>
                </div>
            `;

            setTimeout(() => {
                initPlannerMap(plan);
            }, 50);
        };

        window.generatePlan = () => {
            const groupType = document.getElementById('plan-group').value;
            const budget = document.getElementById('plan-budget').value;
            const maxDistance = parseFloat(document.getElementById('plan-distance').value);
            const numStops = parseInt(document.getElementById('plan-time').value);

            // Filter places
            let candidates = mockPlaces.filter(place => {
                if (budget !== 'Any' && place.priceLevel !== budget) return false;
                if (place.distance > maxDistance) return false;
                return true;
            });

            // Score them based on Group Type
            candidates = candidates.map(place => {
                let score = 50;
                if (groupType === 'Party' && place.tags.includes('Lively')) score += 20;
                if (groupType === 'Chill' && place.tags.includes('Quiet')) score += 20;
                if (groupType === 'Professional' && place.tags.includes('Premium')) score += 20;
                if (groupType === 'Casual' && place.category === 'Hangout') score += 20;
                return { ...place, score };
            });

            // Sort and pick top N
            candidates.sort((a, b) => b.score - a.score);
            let finalPlan = candidates.slice(0, numStops);

            // Fallback if not enough places match the strict criteria
            if (finalPlan.length < numStops) {
                const existingIds = finalPlan.map(p => p.id);
                const extras = mockPlaces.filter(p => !existingIds.includes(p.id)).slice(0, numStops - finalPlan.length);
                finalPlan = [...finalPlan, ...extras];
            }

            window.plannerState = { step: 'result', plan: finalPlan };
            renderPlan();
        };

        window.resetPlanner = () => {
            window.plannerState = { step: 'form', plan: [] };
            renderForm();
        };

        if (window.plannerState.step === 'form') {
            renderForm();
        } else {
            renderPlan();
        }
    }
};

function initPlannerMap(plan) {
    if (!plan || plan.length === 0) return;

    // Approximate center based on first stop, or default Hyderabad
    const centerLat = 17.4065;
    const centerLng = 78.4772;
    const map = L.map('planner-map').setView([centerLat, centerLng], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap & CartoDB'
    }).addTo(map);

    let coordinates = [];

    plan.forEach((place, index) => {
        // Generate pseudo-coordinates based on ID so they are somewhat consistent
        const seed = place.name.length + index;
        const offsetLat = (Math.sin(seed) * 0.03) * (place.distance * 0.5);
        const offsetLng = (Math.cos(seed) * 0.03) * (place.distance * 0.5);
        const lat = centerLat + offsetLat;
        const lng = centerLng + offsetLng;
        
        coordinates.push([lat, lng]);

        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(`<strong>Stop ${index + 1}: ${place.name}</strong>`);
        if (index === 0) marker.openPopup();
    });

    // Draw routing line between stops if more than 1
    if (coordinates.length > 1) {
        const routeLine = L.polyline(coordinates, {
            color: '#2A244E', // Primary color
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10' // dashed line for route
        }).addTo(map);

        // Adjust map to fit the route bounds
        map.fitBounds(routeLine.getBounds(), { padding: [30, 30] });
    } else if (coordinates.length === 1) {
        map.setView(coordinates[0], 14);
    }
}
