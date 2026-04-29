export const HomeView = {
    render: (container, state) => {
        container.innerHTML = `
            <div class="glass-card text-center" style="margin-top: 4rem; text-align: center; padding: 4rem 2rem;">
                <h1 style="font-size: 4rem; margin-bottom: 1rem;">Discover Your City. <br/><span style="color: var(--color-primary);">Together.</span></h1>
                <p style="font-size: 1.25rem; max-width: 600px; margin: 0 auto 2rem; color: var(--color-text-secondary);">
                    Stop arguing about where to go. SmOut learns your tastes, avoids repetition, and helps your group decide on the perfect spot in seconds.
                </p>
                <button class="btn btn-primary" style="font-size: 1.25rem; padding: 1rem 2.5rem;" onclick="window.navigate('onboarding')">Start Exploring as Guest</button>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 4rem;">
                <div class="glass-card">
                    <h3 style="margin-bottom: 1rem;">🎯 Personalized Discovery</h3>
                    <p style="margin: 0;">We build a custom taste profile to recommend places you'll actually love.</p>
                </div>
                <div class="glass-card">
                    <h3 style="margin-bottom: 1rem;">👥 Group Decisions</h3>
                    <p style="margin: 0;">Invite friends to a hangout group. Our AI resolves conflicts and finds the top 3 spots for everyone.</p>
                </div>
                <div class="glass-card">
                    <h3 style="margin-bottom: 1rem;">🗺️ Smart Planning</h3>
                    <p style="margin: 0;">Real-time maps, travel times, and crowd predictions to plan your entire outing seamlessly.</p>
                </div>
            </div>
        `;
    }
};
