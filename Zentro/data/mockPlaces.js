export const mockPlaces = [
    // STREET FOOD
    { id: 'p1', name: 'DLF Street Food', category: 'Street Food', tags: ['Lively', 'Street Food'], priceLevel: '$', distance: 1.5, qualityScore: 4.5, ambienceScore: 3.0, baseCrowdLevel: 'High', waitingTime: '20 mins', imageIcon: '🌯', description: 'Chaotic, late-night hotspot. Best budget night food cluster.' },
    { id: 'p2', name: 'Sindhi Colony Street Food', category: 'Street Food', tags: ['Lively', 'Street Food'], priceLevel: '$', distance: 4.2, qualityScore: 4.4, ambienceScore: 3.5, baseCrowdLevel: 'Medium', waitingTime: '15 mins', imageIcon: '🥪', description: 'Cleaner street food lane. Underrated compared to DLF.' },
    { id: 'p3', name: 'Charminar Food Street', category: 'Street Food', tags: ['Lively', 'Street Food'], priceLevel: '$', distance: 8.5, qualityScore: 4.8, ambienceScore: 4.0, baseCrowdLevel: 'High', waitingTime: '30 mins', imageIcon: '🍢', description: 'Real Hyderabad food experience. Authentic and crowded.' },
    { id: 'p4', name: 'Necklace Road Eat Street', category: 'Street Food', tags: ['Chill', 'Aesthetic', 'Street Food'], priceLevel: '$$', distance: 5.0, qualityScore: 4.2, ambienceScore: 4.5, baseCrowdLevel: 'Medium', waitingTime: '10 mins', imageIcon: '🌅', description: 'Budget hangout with a lake view. Chill and scenic.' },
    
    // CAFES
    { id: 'p5', name: 'Lamakaan', category: 'Cafes', tags: ['Aesthetic', 'Chill'], priceLevel: '$', distance: 3.8, qualityScore: 4.3, ambienceScore: 4.6, baseCrowdLevel: 'Medium', waitingTime: '10 mins', imageIcon: '🎭', description: 'Peaceful and creative open-air space.' },
    { id: 'p6', name: 'Cafe Niloufer', category: 'Cafes', tags: ['Lively'], priceLevel: '$', distance: 6.0, qualityScore: 4.7, ambienceScore: 3.8, baseCrowdLevel: 'High', waitingTime: '20 mins', imageIcon: '☕', description: 'Iconic but crowded classic chai café.' },
    { id: 'p7', name: 'True Black Coffee', category: 'Cafes', tags: ['Premium', 'Aesthetic', 'Quiet'], priceLevel: '$$', distance: 2.1, qualityScore: 4.8, ambienceScore: 4.7, baseCrowdLevel: 'Low', waitingTime: '5 mins', imageIcon: '☕', description: 'Actual quality coffee. Modern spot for young professionals.' },
    { id: 'p8', name: 'The Gallery Cafe', category: 'Cafes', tags: ['Aesthetic', 'Quiet'], priceLevel: '$$', distance: 4.5, qualityScore: 4.6, ambienceScore: 4.9, baseCrowdLevel: 'Low', waitingTime: '5 mins', imageIcon: '🎨', description: 'Aesthetic but underrated. Artsy and quiet.' },

    // BIRYANI + LOCAL
    { id: 'p9', name: 'Bawarchi', category: 'Local Cuisine', tags: ['Lively'], priceLevel: '$$', distance: 7.2, qualityScore: 4.8, ambienceScore: 3.0, baseCrowdLevel: 'High', waitingTime: '40 mins', imageIcon: '🍛', description: 'OG biryani. Busy, no-frills.' },
    { id: 'p10', name: 'Hotel Shadab', category: 'Local Cuisine', tags: ['Lively'], priceLevel: '$$', distance: 8.8, qualityScore: 4.7, ambienceScore: 3.5, baseCrowdLevel: 'High', waitingTime: '30 mins', imageIcon: '🍗', description: 'Old city authentic. Traditional taste.' },
    { id: 'p11', name: 'Cafe Bahar', category: 'Local Cuisine', tags: ['Lively'], priceLevel: '$$', distance: 6.5, qualityScore: 4.8, ambienceScore: 3.2, baseCrowdLevel: 'Medium', waitingTime: '20 mins', imageIcon: '🍚', description: 'Less hype, better taste. Local favorite.' },
    { id: 'p12', name: 'Mehfil', category: 'Local Cuisine', tags: ['Lively'], priceLevel: '$', distance: 5.5, qualityScore: 4.5, ambienceScore: 3.0, baseCrowdLevel: 'High', waitingTime: '25 mins', imageIcon: '🥘', description: 'Budget biryani option. Casual dining.' },
    { id: 'p13', name: 'Shah Ghouse', category: 'Local Cuisine', tags: ['Lively'], priceLevel: '$$', distance: 3.0, qualityScore: 4.6, ambienceScore: 3.0, baseCrowdLevel: 'High', waitingTime: '20 mins', imageIcon: '🥩', description: 'Best for night cravings. Late-night non-veg spot.' },

    // FUN / HANGOUT
    { id: 'p14', name: 'Tank Bund', category: 'Hangout', tags: ['Chill'], priceLevel: '$', distance: 6.0, qualityScore: 4.0, ambienceScore: 4.5, baseCrowdLevel: 'Medium', waitingTime: '0 mins', imageIcon: '🚶', description: 'Simple chill spot. Walking with a lake view.' },
    { id: 'p15', name: 'KBR National Park', category: 'Hangout', tags: ['Quiet', 'Chill'], priceLevel: '$', distance: 2.5, qualityScore: 4.5, ambienceScore: 4.8, baseCrowdLevel: 'Low', waitingTime: '0 mins', imageIcon: '🌳', description: 'Peaceful escape in the city. Nature and jogging.' },
    { id: 'p16', name: 'Durgam Cheruvu', category: 'Hangout', tags: ['Chill', 'Aesthetic'], priceLevel: '$', distance: 1.8, qualityScore: 4.4, ambienceScore: 4.9, baseCrowdLevel: 'Medium', waitingTime: '0 mins', imageIcon: '🌉', description: 'Best sunset spot. Lake and bridge view.' },
    { id: 'p17', name: 'Shilparamam', category: 'Hangout', tags: ['Aesthetic', 'Chill'], priceLevel: '$', distance: 2.0, qualityScore: 4.3, ambienceScore: 4.5, baseCrowdLevel: 'Medium', waitingTime: '5 mins', imageIcon: '🏺', description: 'Underrated hangout. Cultural village.' },

    // PARTY / NIGHT
    { id: 'p18', name: '10 Downing Street', category: 'Nightlife', tags: ['Party', 'Lively'], priceLevel: '$$$', distance: 5.8, qualityScore: 4.5, ambienceScore: 4.7, baseCrowdLevel: 'High', waitingTime: '15 mins', imageIcon: '🕺', description: 'Classic party spot. Pub and dance.' },
    { id: 'p19', name: 'Over The Moon', category: 'Nightlife', tags: ['Party', 'Rooftop', 'Premium'], priceLevel: '$$$', distance: 2.2, qualityScore: 4.6, ambienceScore: 4.9, baseCrowdLevel: 'High', waitingTime: '20 mins', imageIcon: '🌙', description: 'Premium nightlife. Rooftop party vibe.' },
    { id: 'p20', name: 'Heart Cup Coffee', category: 'Nightlife', tags: ['Party', 'Lively'], priceLevel: '$$', distance: 3.5, qualityScore: 4.4, ambienceScore: 4.5, baseCrowdLevel: 'High', waitingTime: '15 mins', imageIcon: '🎸', description: 'Affordable party vibe. Café with live music.' },

    // HIDDEN GEMS
    { id: 'p21', name: 'The Glass Onion', category: 'Hidden Gem', tags: ['Quiet', 'Aesthetic', 'Premium'], priceLevel: '$$$', distance: 4.8, qualityScore: 4.7, ambienceScore: 5.0, baseCrowdLevel: 'Low', waitingTime: '5 mins', imageIcon: '🧅', description: 'Hidden escape café. Nature + premium vibe.' },
    { id: 'p22', name: 'Via Milano', category: 'Hidden Gem', tags: ['Quiet', 'Premium'], priceLevel: '$$$', distance: 3.2, qualityScore: 4.8, ambienceScore: 4.8, baseCrowdLevel: 'Low', waitingTime: '10 mins', imageIcon: '🍝', description: 'Quiet and classy Italian dining.' },
    { id: 'p23', name: 'Autumn Leaf Cafe', category: 'Hidden Gem', tags: ['Aesthetic', 'Quiet'], priceLevel: '$$', distance: 2.6, qualityScore: 4.6, ambienceScore: 4.9, baseCrowdLevel: 'Low', waitingTime: '5 mins', imageIcon: '🍂', description: 'Very aesthetic but underrated. Treehouse style.' },
    { id: 'p24', name: 'Roast CCX', category: 'Hidden Gem', tags: ['Premium', 'Quiet'], priceLevel: '$$$', distance: 1.5, qualityScore: 4.9, ambienceScore: 4.7, baseCrowdLevel: 'Low', waitingTime: '5 mins', imageIcon: '☕', description: 'Hidden but high quality premium coffee.' }
];
