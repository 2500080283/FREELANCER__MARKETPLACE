import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function Navbar({ activeModule, setActiveModule, theme, toggleTheme }) {
  const { currentUser, logout, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (moduleName) => {
    setMobileMenuOpen(false);

    if (moduleName === 'user') {
      if (!currentUser) {
        showToast('Please sign in to access your User Workspace.', 'info');
        openAuthModal('signin');
        return;
      }
    }

    if (moduleName === 'admin') {
      if (!currentUser || currentUser.role !== 'Admin') {
        showToast('🛡️ Access restricted: Administrator credentials required.', 'warning');
        openAuthModal('signin');
        return;
      }
    }

    setActiveModule(moduleName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    showToast('You have been successfully logged out.', 'info');
    setActiveModule('marketplace');
  };

  return (
    <>
      <header className="header">
        {/* Circular Logo Brand */}
        <button
          className="brand-logo"
          onClick={() => handleNavClick('landing')}
          aria-label="FreelanceHub Home"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <img src="/assets/logo.webp" alt="FreelanceHub Logo" width="52" height="52" />
        </button>

        {/* Desktop Nav Pill */}
        <nav className="desktop-nav nav-pill" aria-label="Main Navigation">
          <button
            className={`nav-link ${activeModule === 'landing' ? 'active' : ''}`}
            onClick={() => handleNavClick('landing')}
          >
            Home
          </button>
          <button
            className={`nav-link ${activeModule === 'marketplace' ? 'active' : ''}`}
            onClick={() => handleNavClick('marketplace')}
          >
            Marketplace
          </button>
          <button
            className={`nav-link ${activeModule === 'user' ? 'active' : ''}`}
            onClick={() => handleNavClick('user')}
          >
            User Portal
            {currentUser && (
              <span style={{
                fontSize: '10px',
                background: 'var(--primary)',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: '10px',
                marginLeft: '5px'
              }}>
                {currentUser.role}
              </span>
            )}
          </button>
          <button
            className={`nav-link ${activeModule === 'admin' ? 'active' : ''}`}
            onClick={() => handleNavClick('admin')}
            style={currentUser?.role === 'Admin' ? { borderColor: 'rgba(244, 63, 94, 0.4)' } : {}}
          >
            🛡️ Admin Panel
          </button>
        </nav>

        {/* Actions Group: Theme Switcher & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Dark/Light Mode"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              fontSize: '16px'
            }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* User Session or Sign In */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="user-nav-profile-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '30px',
                  padding: '4px 12px 4px 6px',
                  cursor: 'pointer',
                  color: 'var(--text-primary)'
                }}
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'}
                  alt={currentUser.name}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '13.5px', fontWeight: 600, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>▼</span>
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '46px',
                    right: 0,
                    width: '210px',
                    background: 'var(--bg-card-hover)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid var(--border-highlight)',
                    borderRadius: '12px',
                    padding: '8px',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
                    zIndex: 1000
                  }}
                >
                  <div style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Signed in as</div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--primary-light)', marginTop: '2px' }}>Role: {currentUser.role}</div>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavClick('user');
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    👤 Workspace Dashboard
                  </button>

                  {currentUser.role === 'Admin' && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleNavClick('admin');
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 10px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-rose)',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      🛡️ Admin Control Panel
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      background: 'none',
                      border: 'none',
                      color: '#f87171',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderTop: '1px solid var(--border-subtle)',
                      marginTop: '6px'
                    }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="desktop-signin btn-signin"
              onClick={() => openAuthModal('signin')}
            >
              Sign in
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            className="burger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="burger-bar"></span>
            <span className="burger-bar"></span>
            <span className="burger-bar"></span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Sheet */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}></div>
          <nav className="mobile-sheet" aria-label="Mobile Navigation">
            <button
              className={`mobile-nav-link ${activeModule === 'landing' ? 'active' : ''}`}
              onClick={() => handleNavClick('landing')}
            >
              Home
            </button>
            <button
              className={`mobile-nav-link ${activeModule === 'marketplace' ? 'active' : ''}`}
              onClick={() => handleNavClick('marketplace')}
            >
              Marketplace
            </button>
            <button
              className={`mobile-nav-link ${activeModule === 'user' ? 'active' : ''}`}
              onClick={() => handleNavClick('user')}
            >
              User Portal {currentUser ? `(${currentUser.role})` : ''}
            </button>
            <button
              className={`mobile-nav-link ${activeModule === 'admin' ? 'active' : ''}`}
              onClick={() => handleNavClick('admin')}
            >
              🛡️ Admin Panel
            </button>

            {currentUser ? (
              <button
                className="btn-signin"
                style={{ background: '#dc2626', color: '#fff', marginTop: '12px' }}
                onClick={handleLogout}
              >
                Sign Out ({currentUser.name})
              </button>
            ) : (
              <button
                className="btn-signin"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('signin');
                }}
              >
                Sign in
              </button>
            )}
          </nav>
        </>
      )}
    </>
  );
}
