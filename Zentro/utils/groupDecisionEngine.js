import { mockPlaces } from '../data/mockPlaces.js';

export function resolveGroupConflict(memberProfiles) {
    // memberProfiles: array of { name, tasteProfile: { vibes: [], foods: [] } }
    
    const vibeCounts = {};
    const foodCounts = {};

    memberProfiles.forEach(member => {
        if(member.tasteProfile?.vibes) {
            member.tasteProfile.vibes.forEach(v => { vibeCounts[v] = (vibeCounts[v] || 0) + 1; });
        }
        if(member.tasteProfile?.foods) {
            member.tasteProfile.foods.forEach(f => { foodCounts[f] = (foodCounts[f] || 0) + 1; });
        }
    });

    const totalMembers = memberProfiles.length;

    const scoredPlaces = mockPlaces.map(place => {
        let score = 50; 
        let reasons = [];

        let vibeMatch = 0;
        place.tags.forEach(tag => {
            if (vibeCounts[tag]) {
                vibeMatch += vibeCounts[tag];
                if (vibeCounts[tag] === totalMembers) {
                    reasons.push(`Everyone loves ${tag}`);
                }
            }
        });
        score += vibeMatch * 12;

        let foodMatch = 0;
        if (foodCounts[place.category]) {
            foodMatch += foodCounts[place.category];
            if (foodCounts[place.category] === totalMembers) {
                reasons.push(`Perfect for the group's food choice`);
            }
        }
        place.tags.forEach(t => {
            if (foodCounts[t]) {
                foodMatch += foodCounts[t];
            }
        });
        score += foodMatch * 15;

        score += place.qualityScore * 3;

        const matchPercentage = Math.min(Math.max(Math.round(score), 40), 99);
        
        let uniqueReasons = [...new Set(reasons)];
        return {
            ...place,
            matchPercentage,
            reason: uniqueReasons.length > 0 ? uniqueReasons.join(' and ') : 'Good compromise for the group.'
        };
    });

    scoredPlaces.sort((a, b) => b.matchPercentage - a.matchPercentage);
    return scoredPlaces.slice(0, 3); // Return Top 3 Picks
}
