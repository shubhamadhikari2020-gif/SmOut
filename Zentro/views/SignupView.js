export const SignupView = {
    render: (container, state) => {
        container.innerHTML = `
            <div style="display: flex; min-height: 80vh; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 4rem;">
                
                <!-- Left Side: Branding & Aesthetics (Like the Image) -->
                <div style="flex: 1; min-width: 300px; padding: 2rem;">
                    <h1 style="font-size: 5rem; color: var(--color-primary); margin-bottom: 0.5rem; line-height: 1;">SmOut</h1>
                    
                    <div style="background: rgba(255,255,255,0.85); display: inline-block; padding: 0.5rem 2rem; margin-bottom: 3rem; transform: skewX(-10deg);">
                        <p style="font-family: var(--font-script); font-size: 2.5rem; color: var(--color-text-primary); margin: 0; transform: skewX(10deg);">
                            Discover Better. Plan Smarter.
                        </p>
                    </div>

                    <div style="max-width: 450px;">
                        <p style="font-size: 1.2rem; color: var(--color-text-secondary); line-height: 1.6;">
                            Join thousands of explorers uncovering the best spots in the city. 
                            Let our AI curate your perfect outing and make group decisions a breeze.
                        </p>
                    </div>
                </div>

                <!-- Right Side: Sign Up Form -->
                <div style="flex: 1; min-width: 350px; max-width: 500px;">
                    <div class="glass-card" style="padding: 3rem 2.5rem;">
                        <h2 style="margin-bottom: 0.5rem; color: var(--color-primary);">Create your account</h2>
                        <p style="margin-bottom: 2rem; color: var(--color-text-muted);">Start your exploration journey today.</p>

                        <div class="input-group">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem;">Full Name</label>
                            <input type="text" class="input-field" placeholder="e.g. Alex Explorer" id="signup-name">
                        </div>

                        <div class="input-group">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem;">Email Address</label>
                            <input type="email" class="input-field" placeholder="alex@example.com">
                        </div>

                        <div class="input-group" style="margin-bottom: 2rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem;">Password</label>
                            <input type="password" class="input-field" placeholder="Create a strong password">
                        </div>

                        <button class="btn btn-primary" style="width: 100%; font-size: 1.1rem; padding: 1rem;" onclick="window.handleSignup()">Join the City</button>
                        
                        <p style="text-align: center; margin-top: 1.5rem; font-size: 0.9rem;">
                            Already have an account? <a href="#" style="color: var(--color-secondary); text-decoration: none; font-weight: 600;">Log in</a>
                        </p>
                    </div>
                </div>
            </div>
        `;

        window.handleSignup = () => {
            const nameInput = document.getElementById('signup-name').value || 'Explorer';
            window.state.user = { name: nameInput, tasteProfile: null };
            window.navigate('onboarding'); // Go to taste profiling
        };
    }
};
