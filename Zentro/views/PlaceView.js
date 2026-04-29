import { mockPlaces } from '../data/mockPlaces.js';
import { getRecommendations } from '../utils/recommendationEngine.js';

export const PlaceView = {
    render: (container, state, data) => {
        if (!state.user) {
            window.navigate('onboarding');
            return;
        }

        const placeId = data?.id;
        const place = mockPlaces.find(p => p.id === placeId);

        if (!place) {
            container.innerHTML = `<div style="text-align: center; padding: 4rem;"><h2>Place not found</h2><button class="btn btn-primary" onclick="window.navigate('dashboard')">Back to Dashboard</button></div>`;
            return;
        }

        // Run Recommendation Engine just for this place to get the "reason" and match score
        // Passing null context to bypass hard filters so we always get a score
        const recommendations = getRecommendations(state.user.tasteProfile, state.history, null); 
        const scoredPlace = recommendations.find(p => p.id === place.id) || { matchPercentage: 50, reason: "A popular spot in the city." };

        // Generate rich mock data if missing
        const history = place.history || `Established as a staple in the local community, ${place.name} has quickly become a go-to destination for anyone looking for the best ${place.category.toLowerCase()} experience in the area. Known for its distinct vibe and quality, it attracts people from all over the city.`;
        const foodHighlights = place.foodHighlights || [
            "Signature Dish - A perfectly crafted local favorite that everyone talks about.",
            "Chef's Special - Unique flavors you won't find anywhere else.",
            "Bestselling Beverage - The perfect pairing for your meal."
        ];
        const images = place.images || [
            `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80`,
            `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80`,
            `https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80`
        ];

        window.scrollTo(0, 0);

        container.innerHTML = `
            <style>
                .hero-banner {
                    width: 100%;
                    height: 400px;
                    border-radius: var(--radius-md);
                    background-image: url('${images[0]}');
                    background-size: cover;
                    background-position: center;
                    position: relative;
                    margin-bottom: 2rem;
                    box-shadow: var(--shadow-glass);
                }
                .hero-overlay {
                    position: absolute;
                    bottom: 0; left: 0; right: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
                    padding: 2rem;
                    border-radius: 0 0 var(--radius-md) var(--radius-md);
                    color: white;
                }
                .tag-pill {
                    background: rgba(255,255,255,0.2);
                    backdrop-filter: blur(5px);
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    display: inline-block;
                    margin-right: 0.5rem;
                    margin-bottom: 0.5rem;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .gallery-img {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    border-radius: var(--radius-md);
                    transition: transform 0.3s;
                }
                .gallery-img:hover {
                    transform: scale(1.02);
                }
            </style>

            <div class="animate-fade-in" style="max-width: 1000px; margin: 0 auto 4rem;">
                <!-- Navigation -->
                <button class="btn btn-secondary" style="margin-bottom: 1rem;" onclick="window.navigate('dashboard')">← Back to Dashboard</button>

                <!-- Header / Hero Section -->
                <div class="hero-banner">
                    <div class="hero-overlay">
                        <div style="font-size: 3rem; margin-bottom: 0.5rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">${place.imageIcon}</div>
                        <h1 style="margin: 0 0 0.5rem; font-size: 2.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${place.name}</h1>
                        <div style="margin-bottom: 0;">
                            <span class="tag-pill">${place.category}</span>
                            ${place.tags.map(tag => `<span class="tag-pill">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2.5rem;">
                    <!-- Main Content Left -->
                    <div>
                        <!-- Why You'll Like This -->
                        <div style="background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981; padding: 1.5rem; border-radius: 0 var(--radius-md) var(--radius-md) 0; margin-bottom: 2.5rem;">
                            <h3 style="color: #10b981; margin-top: 0; display: flex; align-items: center; gap: 0.5rem; font-size: 1.2rem;">
                                ✨ Why You'll Like This <span style="background: #10b981; color: white; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.85rem;">${scoredPlace.matchPercentage}% Match</span>
                            </h3>
                            <p style="margin: 0; color: var(--color-text-primary); line-height: 1.5; font-weight: 500;">${scoredPlace.reason}</p>
                        </div>

                        <!-- About Section -->
                        <h2 style="color: var(--color-primary); margin-bottom: 1rem; border-bottom: 2px solid rgba(42,36,78,0.1); padding-bottom: 0.5rem;">About</h2>
                        <p style="line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 2.5rem; font-size: 1.05rem;">${place.description}</p>

                        <!-- History Section -->
                        <h2 style="color: var(--color-primary); margin-bottom: 1rem; border-bottom: 2px solid rgba(42,36,78,0.1); padding-bottom: 0.5rem;">Background & History</h2>
                        <p style="line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 2.5rem; font-size: 1.05rem;">${history}</p>

                        <!-- Food Highlights -->
                        <h2 style="color: var(--color-primary); margin-bottom: 1rem; border-bottom: 2px solid rgba(42,36,78,0.1); padding-bottom: 0.5rem;">Must-Try Highlights</h2>
                        <ul style="line-height: 1.8; color: var(--color-text-secondary); margin-bottom: 2.5rem; padding-left: 1.2rem; font-size: 1.05rem;">
                            ${foodHighlights.map(item => `<li style="margin-bottom: 0.5rem;">${item}</li>`).join('')}
                        </ul>

                        <!-- Real-World Images -->
                        <h2 style="color: var(--color-primary); margin-bottom: 1rem; border-bottom: 2px solid rgba(42,36,78,0.1); padding-bottom: 0.5rem;">Gallery</h2>
                        <div class="gallery-grid">
                            ${images.map(img => `<img src="${img}" class="gallery-img" alt="Gallery image of ${place.name}">`).join('')}
                        </div>
                    </div>

                    <!-- Sidebar Right (Key Info) -->
                    <div>
                        <div class="glass-card" style="position: sticky; top: 20px;">
                            <h3 style="margin-top: 0; border-bottom: 1px solid rgba(42,36,78,0.1); padding-bottom: 1rem; margin-bottom: 1rem;">Key Info</h3>
                            
                            <div class="info-grid" style="grid-template-columns: 1fr; gap: 0.5rem;">
                                <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px dashed rgba(42,36,78,0.1);">
                                    <span style="color: var(--color-text-muted);">💰 Price</span>
                                    <strong style="color: var(--color-text-primary); font-size: 1.1rem;">${place.priceLevel}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px dashed rgba(42,36,78,0.1);">
                                    <span style="color: var(--color-text-muted);">⭐ Rating</span>
                                    <strong style="color: var(--color-text-primary); font-size: 1.1rem;">${place.qualityScore}/5.0</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px dashed rgba(42,36,78,0.1);">
                                    <span style="color: var(--color-text-muted);">⏳ Wait Time</span>
                                    <strong style="color: var(--color-text-primary); font-size: 1.1rem;">${place.waitingTime}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px dashed rgba(42,36,78,0.1);">
                                    <span style="color: var(--color-text-muted);">👥 Crowd</span>
                                    <strong style="color: var(--color-text-primary); font-size: 1.1rem;">${place.baseCrowdLevel}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: 0.75rem 0;">
                                    <span style="color: var(--color-text-muted);">📍 Distance</span>
                                    <strong style="color: var(--color-text-primary); font-size: 1.1rem;">${place.distance} km</strong>
                                </div>
                            </div>

                            <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem;">
                                <button class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1rem;" onclick="window.navigate('dashboard'); setTimeout(() => window.startNavigation('${place.id}'), 100);">📍 Get Directions</button>
                                <button class="btn btn-secondary" style="width: 100%; padding: 1rem; font-size: 1rem;" onclick="window.markVisited('${place.id}'); alert('Marked as visited!');">✓ Mark as Visited</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};
