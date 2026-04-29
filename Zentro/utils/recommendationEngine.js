import { mockPlaces } from '../data/mockPlaces.js';

export function getRecommendations(userProfile, history = [], context = null) {
    // userProfile format: { vibes: ['Quiet', 'Aesthetic'], foods: ['Cafes', 'Fine Dining'] }
    // context format: { mood, timeAvailability, budget, distance, ambience }
    
    let filteredPlaces = mockPlaces;

    if (context) {
        if (context.budget && context.budget !== 'Any') {
            filteredPlaces = filteredPlaces.filter(p => p.priceLevel === context.budget);
        }
        if (context.distance && context.distance !== 'Any') {
            const maxDist = parseFloat(context.distance);
            filteredPlaces = filteredPlaces.filter(p => p.distance <= maxDist);
        }
        if (context.ambience && context.ambience !== 'Any') {
            filteredPlaces = filteredPlaces.filter(p => p.tags.includes(context.ambience));
        }
        if (context.crowd && context.crowd !== 'Any') {
            filteredPlaces = filteredPlaces.filter(p => p.baseCrowdLevel === context.crowd);
        }
    }
    
    // Basic AI Learning: Calculate favorite categories from history
    const categoryCounts = {};
    history.forEach(visit => {
        const visitedPlace = mockPlaces.find(p => p.id === visit.placeId);
        if (visitedPlace) {
            categoryCounts[visitedPlace.category] = (categoryCounts[visitedPlace.category] || 0) + 1;
        }
    });
    const sortedCategories = Object.entries(categoryCounts).sort((a,b) => b[1] - a[1]);
    const topHistoryCategory = sortedCategories.length > 0 ? sortedCategories[0][0] : null;

    const scoredPlaces = filteredPlaces.map(place => {
        let score = 50; // base score
        let reasons = [];

        // 1. Match Vibes (with mapping for Loud/Party)
        const vibeMapping = {
            'Chill': ['Chill', 'Quiet'],
            'Aesthetic': ['Aesthetic'],
            'Loud / Party': ['Party', 'Lively'],
            'Rooftop': ['Rooftop']
        };
        
        let matchedVibes = [];
        if (userProfile.vibes) {
            userProfile.vibes.forEach(vibePref => {
                const mappedTags = vibeMapping[vibePref] || [vibePref];
                if (place.tags.some(t => mappedTags.includes(t))) {
                    matchedVibes.push(vibePref);
                }
            });
            if (matchedVibes.length > 0) {
                score += matchedVibes.length * 10;
                reasons.push(`Matches your vibe`);
            }
        }

        // 2. Match Foods/Category
        if (userProfile.foods) {
            if (userProfile.foods.includes(place.category) || place.tags.some(t => userProfile.foods.includes(t))) {
                score += 15;
                reasons.push(`Great ${place.category} option`);
            }
        }

        // 3. Base quality
        score += (place.qualityScore - 3) * 5; 

        // Match Budget from Onboarding Profile
        if (userProfile.budgets && userProfile.budgets.length > 0) {
            const budgetMapping = { 'Low': '$', 'Medium': '$$', 'High': '$$$' };
            const mappedBudgets = userProfile.budgets.map(b => budgetMapping[b]);
            if (mappedBudgets.includes(place.priceLevel)) {
                score += 15;
                reasons.push(`Fits your budget`);
            }
        }

        // Match Distance from Onboarding Profile
        if (userProfile.distances && userProfile.distances.length > 0) {
            const distanceMapping = { 'Nearby': 3, 'Moderate': 6, 'Far': 100 };
            const maxAllowedDist = Math.max(...userProfile.distances.map(d => distanceMapping[d] || 100));
            if (place.distance <= maxAllowedDist) {
                score += 10;
                reasons.push(`Preferred distance`);
            }
        }

        // 4. Non-repetition logic & AI Learning
        const pastVisits = history.filter(h => h.placeId === place.id).length;
        if (pastVisits > 0) {
            score -= (pastVisits * 15); // penalize recently visited
            reasons.push(`You've visited this ${pastVisits} time(s) before`);
        } else {
            // 5. AI Learning Boost (Phase 7)
            if (topHistoryCategory && place.category === topHistoryCategory) {
                score += 25;
                reasons.push(`Recommended based on your activity (${topHistoryCategory})`);
            } else if (score > 60) {
                reasons.push(`New discovery for you`);
            }
        }

        // 5. Context - Mood
        if (context && context.mood) {
            if (context.mood === 'Chill' && (place.tags.includes('Quiet') || place.tags.includes('Aesthetic'))) {
                score += 15;
                reasons.push(`Perfect for a Chill mood`);
            }
            if (context.mood === 'Party' && (place.tags.includes('Lively') || place.tags.includes('Rooftop'))) {
                score += 15;
                reasons.push(`Great for Partying`);
            }
        }

        // 6. Context - Time Availability
        if (context && context.timeAvailability === 'Short (< 1hr)') {
            if (place.waitingTime.includes('30') || place.waitingTime.includes('45') || place.baseCrowdLevel === 'High') {
                score -= 20; // Penalize places with long wait times
            } else {
                score += 10;
                reasons.push(`Quick seating available`);
            }
        }

        // Normalize match percentage
        const matchPercentage = Math.min(Math.max(Math.round(score), 40), 99);
        
        // Remove duplicates and format
        let uniqueReasons = [...new Set(reasons)];
        let finalReason = uniqueReasons.length > 0 ? uniqueReasons.join(' • ') : 'Highly rated in your area.';

        return {
            ...place,
            matchPercentage,
            reason: finalReason
        };
    });

    // Sort by descending score
    scoredPlaces.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return scoredPlaces;
}
