import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function LoginPage({ onLoginSuccess, onNavigate }) {
  const { login, signup, demoLogin } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'

  // Sign In State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Client'); // 'Client' | 'Freelancer'
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your email address or username.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = login(identifier, password);
      showToast(`Welcome back, ${user.name}! (${user.role})`, 'success');
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (err) {
      setErrorMsg(err.message);
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    if (!signupPassword || signupPassword.length < 5) {
      setErrorMsg('Password must be at least 5 characters.');
      return;
    }
    if (!agreedTerms) {
      setErrorMsg('Please accept the Terms of Service to create an account.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = signup({
        name: fullName,
        email: signupEmail,
        password: signupPassword,
        role: selectedRole
      });
      showToast(`Account successfully created! Welcome, ${user.name}!`, 'success');
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (err) {
      setErrorMsg(err.message);
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = (roleKey) => {
    setErrorMsg('');
    try {
      const user = demoLogin(roleKey);
      if (user) {
        showToast(`Signed in as Demo ${user.role}: ${user.name}`, 'success');
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      }
    } catch (err) {
      setErrorMsg(err.message);
      showToast(err.message, 'error');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    showToast('Demo Environment: Use quick demo logins below or passwords "client123" / "user123".', 'info');
  };

  return (
    <div className="login-page-container">
      {/* Top Navigation & Back Link */}
      <div className="login-top-bar">
        <button
          className="login-back-btn"
          onClick={() => onNavigate ? onNavigate('landing') : null}
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Home</span>
        </button>

        <div className="login-brand-pill" onClick={() => onNavigate && onNavigate('landing')}>
          <img src="/assets/logo.webp" alt="FreelanceHub" className="login-logo-img" />
          <span className="login-brand-title">Freelance<span>Hub</span></span>
        </div>

        <button
          className="login-back-btn"
          onClick={() => onNavigate ? onNavigate('marketplace') : null}
        >
          <span>Explore Marketplace</span>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="login-card-wrapper">
        {/* LEFT COLUMN: Platform Info, Highlights & Demo Logins */}
        <div className="login-info-column">
          <div className="login-info-badge">
            <span className="info-badge-dot"></span>
            <span>SECURE ECOSYSTEM v2.0</span>
          </div>

          <h2 className="login-info-heading">
            Your Gateway to World-Class Freelance Talent.
          </h2>

          <p className="login-info-subhead">
            Whether you are scaling high-velocity engineering teams or bidding on enterprise contracts, FreelanceHub provides guaranteed escrow security and dispute protection.
          </p>

          {/* Value Highlights */}
          <div className="login-perks-list">
            <div className="login-perk-item">
              <div className="perk-icon-wrap emerald">
                <i className="fa-solid fa-shield-check"></i>
              </div>
              <div className="perk-text-wrap">
                <h4>100% Escrow Milestone Guarantee</h4>
                <p>Funds are locked safely before work starts and disbursed on milestone approval.</p>
              </div>
            </div>

            <div className="login-perk-item">
              <div className="perk-icon-wrap blue">
                <i className="fa-solid fa-user-shield"></i>
              </div>
              <div className="perk-text-wrap">
                <h4>Pre-Vetted Specialist Network</h4>
                <p>Curated developer, AI, and design portfolios audited for real-world delivery standards.</p>
              </div>
            </div>

            <div className="login-perk-item">
              <div className="perk-icon-wrap amber">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <div className="perk-text-wrap">
                <h4>Impartial Platform Arbitration</h4>
                <p>Transparent dispute mediation ensuring fairness and complete audit trails.</p>
              </div>
            </div>
          </div>

          {/* Quick 1-Click Demo Accounts */}
          <div className="quick-demo-section">
            <div className="demo-section-title">
              <i className="fa-solid fa-bolt"></i>
              <span>Instant 1-Click Demo Sign In</span>
            </div>
            <p className="demo-section-subtitle">
              Test any role immediately without manual typing:
            </p>

            <div className="demo-buttons-grid">
              <button
                type="button"
                className="demo-role-btn client"
                onClick={() => handleQuickDemo('client')}
              >
                <div className="demo-btn-left">
                  <div className="demo-role-icon"><i className="fa-solid fa-building"></i></div>
                  <div>
                    <div className="demo-role-name">Client Account</div>
                    <div className="demo-role-sub">MetricFlow (Post & Hire)</div>
                  </div>
                </div>
                <i className="fa-solid fa-arrow-right"></i>
              </button>

              <button
                type="button"
                className="demo-role-btn freelancer"
                onClick={() => handleQuickDemo('freelancer')}
              >
                <div className="demo-btn-left">
                  <div className="demo-role-icon"><i className="fa-solid fa-code"></i></div>
                  <div>
                    <div className="demo-role-name">Freelancer Account</div>
                    <div className="demo-role-sub">Rahul Kumar (Full Stack)</div>
                  </div>
                </div>
                <i className="fa-solid fa-arrow-right"></i>
              </button>

              <button
                type="button"
                className="demo-role-btn admin"
                onClick={() => handleQuickDemo('admin')}
              >
                <div className="demo-btn-left">
                  <div className="demo-role-icon"><i className="fa-solid fa-shield-halved"></i></div>
                  <div>
                    <div className="demo-role-name">Admin Control Center</div>
                    <div className="demo-role-sub">Prudhvi (Platform Security)</div>
                  </div>
                </div>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Form */}
        <div className="login-form-column">
          {/* Form Tabs: Sign In / Create Account */}
          <div className="auth-tab-switcher">
            <button
              type="button"
              className={`auth-tab-btn ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => { setMode('signin'); setErrorMsg(''); }}
            >
              <i className="fa-solid fa-right-to-bracket"></i>
              <span>Sign In</span>
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); setErrorMsg(''); }}
            >
              <i className="fa-solid fa-user-plus"></i>
              <span>Create Account</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="auth-error-banner">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN FORM */}
          {mode === 'signin' ? (
            <form className="auth-active-form" onSubmit={handleSignIn}>
              <div className="form-group">
                <label className="form-label" htmlFor="loginIdentifier">
                  Email Address or Username
                </label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-envelope input-leading-icon"></i>
                  <input
                    id="loginIdentifier"
                    type="text"
                    className="form-input"
                    placeholder="e.g. client@freelancehub.com or rahul"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-with-hint">
                  <label className="form-label" htmlFor="loginPassword">
                    Password
                  </label>
                  <a href="#forgot" className="forgot-link" onClick={handleForgotPassword}>
                    Forgot Password?
                  </a>
                </div>
                <div className="input-with-icon">
                  <i className="fa-solid fa-lock input-leading-icon"></i>
                  <input
                    id="loginPassword"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="form-checkbox-row">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkbox-checkmark"></span>
                  <span className="checkbox-text">Keep me signed in on this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-auth-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to FreelanceHub</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </>
                )}
              </button>

              {/* Switch to Sign Up */}
              <div className="auth-footer-prompt">
                <span>Don't have an account yet?</span>
                <button
                  type="button"
                  className="switch-mode-btn"
                  onClick={() => { setMode('signup'); setErrorMsg(''); }}
                >
                  Create Free Account
                </button>
              </div>
            </form>
          ) : (
            /* TAB 2: SIGN UP / REGISTRATION FORM */
            <form className="auth-active-form" onSubmit={handleSignUp}>
              <div className="form-group">
                <label className="form-label">Select Your Role</label>
                <div className="role-selection-grid">
                  <div
                    className={`role-select-card ${selectedRole === 'Client' ? 'selected' : ''}`}
                    onClick={() => setSelectedRole('Client')}
                  >
                    <div className="role-card-icon"><i className="fa-solid fa-briefcase"></i></div>
                    <div className="role-card-title">I Want to Hire (Client)</div>
                    <div className="role-card-desc">Post projects, review bids, fund escrow milestones</div>
                  </div>

                  <div
                    className={`role-select-card ${selectedRole === 'Freelancer' ? 'selected' : ''}`}
                    onClick={() => setSelectedRole('Freelancer')}
                  >
                    <div className="role-card-icon"><i className="fa-solid fa-code"></i></div>
                    <div className="role-card-title">I Want to Work (Freelancer)</div>
                    <div className="role-card-desc">Pitch proposals, execute deliverables, earn payouts</div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="registerName">
                  Full Name
                </label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-user input-leading-icon"></i>
                  <input
                    id="registerName"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ananya Roy"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="registerEmail">
                  Work Email Address
                </label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-envelope input-leading-icon"></i>
                  <input
                    id="registerEmail"
                    type="email"
                    className="form-input"
                    placeholder="name@company.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="registerPassword">
                  Create Password (min. 5 chars)
                </label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-lock input-leading-icon"></i>
                  <input
                    id="registerPassword"
                    type={showSignupPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter a secure password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    aria-label="Toggle password visibility"
                  >
                    <i className={showSignupPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="form-checkbox-row">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                  />
                  <span className="checkbox-checkmark"></span>
                  <span className="checkbox-text">
                    I agree to the FreelanceHub Terms of Service and Privacy Policy
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-auth-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <span>Create {selectedRole} Account</span>
                    <i className="fa-solid fa-user-check"></i>
                  </>
                )}
              </button>

              {/* Switch to Sign In */}
              <div className="auth-footer-prompt">
                <span>Already have an account?</span>
                <button
                  type="button"
                  className="switch-mode-btn"
                  onClick={() => { setMode('signin'); setErrorMsg(''); }}
                >
                  Sign In Instead
                </button>
              </div>
            </form>
          )}

          {/* Security Proof Footer */}
          <div className="auth-security-badges">
            <div className="sec-badge">
              <i className="fa-solid fa-lock"></i>
              <span>256-Bit SSL</span>
            </div>
            <div className="sec-badge">
              <i className="fa-solid fa-shield-halved"></i>
              <span>Escrow Safe</span>
            </div>
            <div className="sec-badge">
              <i className="fa-solid fa-user-check"></i>
              <span>Vetted Community</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
