export const OnboardingView = {
    render: (container, state) => {
        window.selectedVibes = [];
        window.selectedFoods = [];
        window.selectedBudget = [];
        window.selectedDistance = [];

        window.toggleSelection = (item, array, btn) => {
            btn.classList.toggle('btn-primary');
            btn.classList.toggle('btn-secondary');
            const index = array.indexOf(item);
            if (index > -1) {
                array.splice(index, 1);
            } else {
                array.push(item);
            }
        };

        container.innerHTML = `
            <div class="glass-card animate-fade-in" style="max-width: 600px; margin: 2rem auto; padding: 3rem;">
                <h2 style="text-align: center; margin-bottom: 2rem; font-size: 2rem;">Tell us what you love</h2>
                <p style="text-align: center; color: var(--color-text-secondary); margin-bottom: 3rem;">We'll craft a custom local experience just for you.</p>

                <h3 style="margin-bottom: 1rem;">Food Preferences</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 2.5rem;">
                    ${['Street Food', 'Cafes', 'Fine Dining', 'Local Cuisine'].map(food => 
                        `<button class="btn btn-secondary food-btn" onclick="window.toggleSelection('${food}', window.selectedFoods, this)">${food}</button>`
                    ).join('')}
                </div>

                <h3 style="margin-bottom: 1rem;">Ambience</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 2.5rem;">
                    ${['Chill', 'Aesthetic', 'Loud / Party', 'Rooftop'].map(vibe => 
                        `<button class="btn btn-secondary vibe-btn" onclick="window.toggleSelection('${vibe}', window.selectedVibes, this)">${vibe}</button>`
                    ).join('')}
                </div>
                
                <h3 style="margin-bottom: 1rem;">Budget</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 2.5rem;">
                    ${['Low', 'Medium', 'High'].map(budget => 
                        `<button class="btn btn-secondary budget-btn" onclick="window.toggleSelection('${budget}', window.selectedBudget, this)">${budget}</button>`
                    ).join('')}
                </div>

                <h3 style="margin-bottom: 1rem;">Travel Distance</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 3rem;">
                    ${['Nearby', 'Moderate', 'Far'].map(dist => 
                        `<button class="btn btn-secondary dist-btn" onclick="window.toggleSelection('${dist}', window.selectedDistance, this)">${dist}</button>`
                    ).join('')}
                </div>

                <div style="text-align: center;">
                    <button class="btn btn-primary" style="width: 100%; padding: 1.2rem; font-size: 1.1rem;" onclick="window.finishOnboarding()">Save & Discover</button>
                </div>
            </div>
        `;

        window.finishOnboarding = () => {
            const profile = {
                vibes: window.selectedVibes,
                foods: window.selectedFoods,
                budgets: window.selectedBudget,
                distances: window.selectedDistance
            };
            
            // Persistent Storage
            localStorage.setItem('smout_user_profile', JSON.stringify(profile));
            
            window.state.user = { 
                name: "Guest Explorer", 
                tasteProfile: profile
            };
            window.navigate('dashboard');
        };
    }
};
