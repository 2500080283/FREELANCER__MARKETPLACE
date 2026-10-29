import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function AuthModal({ onLoginSuccess }) {
  const { authModalOpen, authModalTab, closeAuthModal, openAuthModal, login, signup, demoLogin } = useAuth();
  const { showToast } = useToast();

  // Form states
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('Client');
  const [errorMsg, setErrorMsg] = useState('');

  if (!authModalOpen) return null;

  const handleSignIn = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailOrUsername.trim() || !password) {
      setErrorMsg('Please enter both username/email and password.');
      return;
    }

    try {
      const user = login(emailOrUsername, password);
      showToast(`Welcome back, ${user.name}! (${user.role})`, 'success');
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (err) {
      setErrorMsg(err.message);
      showToast(err.message, 'error');
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
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!signupPassword || signupPassword.length < 5) {
      setErrorMsg('Password must be at least 5 characters long.');
      return;
    }

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
    }
  };

  const handleDemo = (roleKey) => {
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
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeAuthModal} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '16px'
    }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-highlight)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
          padding: '24px'
        }}
      >
        {/* Header */}
        <div className="modal-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {authModalTab === 'signin' ? 'Welcome to FreelanceHub' : 'Create Your Account'}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {authModalTab === 'signin'
                ? 'Sign in to access your projects, bids, or admin panel'
                : 'Join our vetted network of clients and specialist freelancers'}
            </p>
          </div>
          <button
            className="modal-close-btn"
            onClick={closeAuthModal}
            aria-label="Close dialog"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <button
            type="button"
            className={`auth-tab ${authModalTab === 'signin' ? 'active' : ''}`}
            onClick={() => { setErrorMsg(''); openAuthModal('signin'); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: authModalTab === 'signin' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
              background: authModalTab === 'signin' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
              color: authModalTab === 'signin' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${authModalTab === 'register' ? 'active' : ''}`}
            onClick={() => { setErrorMsg(''); openAuthModal('register'); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: authModalTab === 'register' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
              background: authModalTab === 'register' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
              color: authModalTab === 'register' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid var(--accent-rose)',
            color: '#fca5a5',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* SIGN IN FORM */}
        {authModalTab === 'signin' ? (
          <form onSubmit={handleSignIn}>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label htmlFor="modalAuthEmail" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Username or Email Address
              </label>
              <input
                type="text"
                id="modalAuthEmail"
                placeholder="e.g. prudhvi or client@freelancehub.com"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '14px'
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="modalAuthPassword" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Password
              </label>
              <input
                type="password"
                id="modalAuthPassword"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '14px'
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Sign In to FreelanceHub
            </button>
          </form>
        ) : (
          /* SIGN UP FORM */
          <form onSubmit={handleSignUp}>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label htmlFor="modalSignupName" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Full Name
              </label>
              <input
                type="text"
                id="modalSignupName"
                placeholder="e.g. Maya Lin"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '14px'
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label htmlFor="modalSignupEmail" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <input
                type="email"
                id="modalSignupEmail"
                placeholder="e.g. maya@example.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '14px'
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label htmlFor="modalSignupRole" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Account Type / Module Role
              </label>
              <select
                id="modalSignupRole"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '14px'
                }}
              >
                <option value="Client">🏢 Client / Employer (Post jobs & hire talent)</option>
                <option value="Freelancer">💻 Freelancer (Browse jobs & submit bids)</option>
                <option value="Admin">🛡️ Administrator (Govern platform & moderation)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="modalSignupPassword" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Password (min 5 chars)
              </label>
              <input
                type="password"
                id="modalSignupPassword"
                placeholder="••••••••"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '14px'
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Create Account in LocalStorage
            </button>
          </form>
        )}

        {/* One-Click Quick Demo Sign-In for Reviewers / Evaluators */}
        <div className="demo-login-box" style={{
          marginTop: '24px',
          paddingTop: '18px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <span className="demo-login-label" style={{
            display: 'block',
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginBottom: '10px',
            fontWeight: 600
          }}>
            ⚡ Quick Demo Access (1-Click Test Sign-In):
          </span>
          <div className="demo-btns" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleDemo('admin')}
              title="Sign in as Admin: prudhvi / prudhvi@2408"
              style={{
                padding: '8px 6px',
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: '8px',
                color: 'var(--accent-rose)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🛡️ Demo Admin
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleDemo('client')}
              title="Sign in as Client: client@freelancehub.com / client123"
              style={{
                padding: '8px 6px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '8px',
                color: 'var(--primary-light)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🏢 Demo Client
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleDemo('freelancer')}
              title="Sign in as Freelancer: rahul@freelancehub.com / user123"
              style={{
                padding: '8px 6px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                color: 'var(--accent-emerald)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              💻 Demo Freelancer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
