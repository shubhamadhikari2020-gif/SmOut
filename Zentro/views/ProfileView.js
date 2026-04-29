export const ProfileView = {
    render: (container, state, data) => {
        if (!state.user) {
            window.navigate('onboarding');
            return;
        }

        const taste = state.user.tasteProfile || {};
        const history = state.history || [];
        const name = state.user.name || "Guest User";

        let territoryProgress = Math.min(Math.floor(history.length / 3), 5); // Just a mock metric
        let totalExplored = history.length;

        container.innerHTML = `
            <div class="animate-fade-in" style="max-width: 600px; margin: 2rem auto; padding: 2rem;">
                <div class="glass-card" style="text-align: center; padding: 3rem 2rem;">
                    <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #8b5cf6, #ec4899); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 3rem; margin: 0 auto 1.5rem; box-shadow: var(--shadow-glass);">
                        ${name.charAt(0).toUpperCase()}
                    </div>
                    <h1 style="margin: 0 0 0.5rem;">${name}</h1>
                    <p style="color: var(--color-text-muted); margin-bottom: 2rem;">SmOut Explorer</p>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
                        <div style="background: rgba(42,36,78,0.05); padding: 1rem; border-radius: var(--radius-md);">
                            <div style="font-size: 2rem; color: var(--color-primary); margin-bottom: 0.5rem;">${totalExplored}</div>
                            <div style="font-size: 0.85rem; font-weight: bold; color: var(--color-text-secondary);">PLACES VISITED</div>
                        </div>
                        <div style="background: rgba(42,36,78,0.05); padding: 1rem; border-radius: var(--radius-md);">
                            <div style="font-size: 2rem; color: #10b981; margin-bottom: 0.5rem;">Level ${territoryProgress}</div>
                            <div style="font-size: 0.85rem; font-weight: bold; color: var(--color-text-secondary);">TERRITORY EXPLORER</div>
                        </div>
                    </div>

                    <div style="text-align: left; background: rgba(255,255,255,0.4); padding: 1.5rem; border-radius: var(--radius-md);">
                        <h3 style="border-bottom: 1px solid rgba(42,36,78,0.1); padding-bottom: 0.5rem; margin-bottom: 1rem;">Taste Profile</h3>
                        <div style="margin-bottom: 1rem;">
                            <strong>Preferred Vibes:</strong>
                            <div style="margin-top: 0.5rem;">
                                ${(taste.vibes || []).map(v => `<span style="background: rgba(255,255,255,0.8); padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.85rem; display: inline-block; margin: 0 0.2rem 0.2rem 0;">${v}</span>`).join('') || 'None'}
                            </div>
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <strong>Preferred Food:</strong>
                            <div style="margin-top: 0.5rem;">
                                ${(taste.foods || []).map(v => `<span style="background: rgba(255,255,255,0.8); padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.85rem; display: inline-block; margin: 0 0.2rem 0.2rem 0;">${v}</span>`).join('') || 'None'}
                            </div>
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <strong>Budgets:</strong> ${(taste.budgets || []).join(', ') || 'Any'}
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <strong>Distance:</strong> ${(taste.distances || []).join(', ') || 'Any'}
                        </div>
                    </div>

                    <button class="btn btn-secondary" style="width: 100%; margin-top: 2rem;" onclick="window.navigate('onboarding')">✏️ Edit Preferences</button>
                </div>
            </div>
        `;
    }
};
