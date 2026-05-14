export const SignupView = {
    render: (container, state) => {
        container.innerHTML = `
            <style>
                .auth-container {
                    display: flex;
                    min-height: 80vh;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }
                .auth-card {
                    width: 100%;
                    max-width: 480px;
                    padding: 3rem;
                    position: relative;
                    overflow: hidden;
                }
                .auth-tabs {
                    display: flex;
                    margin-bottom: 2rem;
                    border-bottom: 2px solid rgba(42, 36, 78, 0.1);
                }
                .auth-tab {
                    flex: 1;
                    text-align: center;
                    padding: 1rem;
                    font-weight: 600;
                    color: var(--color-text-muted);
                    cursor: pointer;
                    transition: var(--transition-smooth);
                    position: relative;
                }
                .auth-tab.active {
                    color: var(--color-primary);
                }
                .auth-tab.active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: var(--color-primary);
                    border-radius: 2px 2px 0 0;
                }
                .social-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid rgba(42, 36, 78, 0.1);
                    border-radius: var(--radius-md);
                    background: white;
                    color: var(--color-text-primary);
                    font-weight: 500;
                    cursor: pointer;
                    transition: var(--transition-smooth);
                    margin-bottom: 1.5rem;
                }
                .social-btn:hover {
                    background: rgba(42, 36, 78, 0.02);
                    border-color: rgba(42, 36, 78, 0.2);
                    transform: translateY(-2px);
                }
                .divider {
                    display: flex;
                    align-items: center;
                    text-align: center;
                    margin: 1.5rem 0;
                    color: var(--color-text-muted);
                    font-size: 0.9rem;
                }
                .divider::before, .divider::after {
                    content: '';
                    flex: 1;
                    border-bottom: 1px solid rgba(42, 36, 78, 0.1);
                }
                .divider::before { margin-right: .5em; }
                .divider::after { margin-left: .5em; }
                
                .form-view {
                    display: none;
                    animation: fadeIn 0.3s ease-out forwards;
                }
                .form-view.active {
                    display: block;
                }
                .error-msg {
                    color: #ef4444;
                    font-size: 0.85rem;
                    margin-top: 0.25rem;
                    display: none;
                }
            </style>

            <div class="auth-container">
                <div class="glass-card auth-card">
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <h1 style="font-size: 3rem; color: var(--color-primary); margin-bottom: 0.5rem; line-height: 1;">SmOut</h1>
                        <p style="color: var(--color-text-muted);">Discover Better. Plan Smarter.</p>
                    </div>

                    <div class="auth-tabs">
                        <div class="auth-tab" onclick="window.switchAuthTab('login')">Login</div>
                        <div class="auth-tab active" onclick="window.switchAuthTab('signup')">Sign Up</div>
                    </div>

                    <button class="social-btn" onclick="window.handleGoogleAuth()">
                        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                    </button>

                    <div class="divider">or continue with email</div>

                    <!-- Login Form -->
                    <div id="view-login" class="form-view">
                        <div class="input-group">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem;">Email Address</label>
                            <input type="email" class="input-field" placeholder="alex@example.com" id="login-email">
                            <div class="error-msg" id="login-email-error">Please enter a valid email</div>
                        </div>

                        <div class="input-group" style="margin-bottom: 2rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <label style="font-weight: 500; font-size: 0.9rem;">Password</label>
                                <a href="#" style="font-size: 0.85rem; color: var(--color-secondary); text-decoration: none;">Forgot password?</a>
                            </div>
                            <input type="password" class="input-field" placeholder="Enter your password" id="login-password">
                            <div class="error-msg" id="login-password-error">Password is required</div>
                        </div>

                        <button class="btn btn-primary" style="width: 100%; font-size: 1.1rem; padding: 1rem;" id="btn-login" onclick="window.handleAuth('login')">Log In</button>
                    </div>

                    <!-- Signup Form -->
                    <div id="view-signup" class="form-view active">
                        <div class="input-group">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem;">Full Name</label>
                            <input type="text" class="input-field" placeholder="e.g. Alex Explorer" id="signup-name">
                            <div class="error-msg" id="signup-name-error">Name is required</div>
                        </div>

                        <div class="input-group">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem;">Email Address</label>
                            <input type="email" class="input-field" placeholder="alex@example.com" id="signup-email">
                            <div class="error-msg" id="signup-email-error">Please enter a valid email</div>
                        </div>

                        <div class="input-group" style="margin-bottom: 2rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem;">Password</label>
                            <input type="password" class="input-field" placeholder="Create a strong password (min 6 chars)" id="signup-password">
                            <div class="error-msg" id="signup-password-error">Password must be at least 6 characters</div>
                        </div>

                        <button class="btn btn-primary" style="width: 100%; font-size: 1.1rem; padding: 1rem;" id="btn-signup" onclick="window.handleAuth('signup')">Create Account</button>
                    </div>
                </div>
            </div>
        `;

        window.switchAuthTab = (tab) => {
            const tabs = document.querySelectorAll('.auth-tab');
            const views = document.querySelectorAll('.form-view');
            
            tabs.forEach(t => t.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));

            if (tab === 'login') {
                tabs[0].classList.add('active');
                document.getElementById('view-login').classList.add('active');
            } else {
                tabs[1].classList.add('active');
                document.getElementById('view-signup').classList.add('active');
            }
            
            // Clear errors
            document.querySelectorAll('.error-msg').forEach(e => e.style.display = 'none');
            document.querySelectorAll('.input-field').forEach(i => i.style.borderColor = 'rgba(42, 36, 78, 0.1)');
        };

        const validateEmail = (email) => {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        };

        window.handleAuth = (type) => {
            let isValid = true;
            document.querySelectorAll('.error-msg').forEach(e => e.style.display = 'none');
            document.querySelectorAll('.input-field').forEach(i => i.style.borderColor = 'rgba(42, 36, 78, 0.1)');

            const email = document.getElementById(`${type}-email`).value;
            const password = document.getElementById(`${type}-password`).value;
            let name = 'Explorer';

            if (type === 'signup') {
                name = document.getElementById('signup-name').value;
                if (!name.trim()) {
                    document.getElementById('signup-name-error').style.display = 'block';
                    document.getElementById('signup-name').style.borderColor = '#ef4444';
                    isValid = false;
                }
            }

            if (!validateEmail(email)) {
                document.getElementById(`${type}-email-error`).style.display = 'block';
                document.getElementById(`${type}-email`).style.borderColor = '#ef4444';
                isValid = false;
            }

            if (password.length < 6) {
                document.getElementById(`${type}-password-error`).style.display = 'block';
                document.getElementById(`${type}-password`).style.borderColor = '#ef4444';
                isValid = false;
            }

            if (!isValid) return;

            const btn = document.getElementById(`btn-${type}`);
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span style="display:inline-block; animation: spin 1s linear infinite;">⏳</span> Processing...';
            btn.disabled = true;

            setTimeout(() => {
                window.state.user = { name: type === 'signup' ? name : (email.split('@')[0] || 'User'), tasteProfile: null };
                
                // If they have a taste profile in localStorage, we should load it (simulating login)
                const savedProfile = localStorage.getItem('smout_user_profile');
                if (type === 'login' && savedProfile) {
                    window.state.user.tasteProfile = JSON.parse(savedProfile);
                }
                
                const pendingJoin = localStorage.getItem('smout_pending_join');
                if (pendingJoin) {
                    localStorage.removeItem('smout_pending_join');
                    if (window.joinGroup) {
                        window.joinGroup(pendingJoin);
                        return;
                    }
                }

                if (window.state.user.tasteProfile) {
                    window.navigate('dashboard');
                } else {
                    window.navigate('onboarding'); // Go to taste profiling for new user or user without profile
                }
            }, 800);
        };

        window.handleGoogleAuth = () => {
            const btn = document.querySelector('.social-btn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span style="display:inline-block; animation: spin 1s linear infinite;">⏳</span> Connecting...';
            btn.style.pointerEvents = 'none';

            setTimeout(() => {
                window.state.user = { name: 'Google User', tasteProfile: null };
                const savedProfile = localStorage.getItem('smout_user_profile');
                if (savedProfile) {
                    window.state.user.tasteProfile = JSON.parse(savedProfile);
                }

                const pendingJoin = localStorage.getItem('smout_pending_join');
                if (pendingJoin) {
                    localStorage.removeItem('smout_pending_join');
                    if (window.joinGroup) {
                        window.joinGroup(pendingJoin);
                        return;
                    }
                }

                if (window.state.user.tasteProfile) {
                    window.navigate('dashboard');
                } else {
                    window.navigate('onboarding');
                }
            }, 1000);
        };
        
        // Add spinner keyframes if not exists
        if (!document.getElementById('spinner-style')) {
            const style = document.createElement('style');
            style.id = 'spinner-style';
            style.innerHTML = '@keyframes spin { 100% { transform: rotate(360deg); } }';
            document.head.appendChild(style);
        }
    }
};
