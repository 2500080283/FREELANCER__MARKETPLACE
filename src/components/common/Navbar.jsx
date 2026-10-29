import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function Navbar({ activeModule, setActiveModule, theme, toggleTheme }) {
  const { currentUser, logout, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close user dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    if (userDropdownOpen || mobileMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userDropdownOpen, mobileMenuOpen]);

  const handleNavClick = (moduleName) => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);

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
    setMobileMenuOpen(false);
    showToast('You have been successfully logged out.', 'info');
    setActiveModule('marketplace');
  };

  return (
    <>
      <header className="header">
        {/* 1. Circular Brand Logo */}
        <button
          className="brand-logo"
          onClick={() => handleNavClick('landing')}
          aria-label="FreelanceHub Home"
          title="FreelanceHub Home"
        >
          <img src="/assets/logo.webp" alt="FreelanceHub Logo" width="52" height="52" />
        </button>

        {/* 2. Desktop Nav Pill (White) */}
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
          </button>
          <button
            className={`nav-link ${activeModule === 'admin' ? 'active' : ''}`}
            onClick={() => handleNavClick('admin')}
          >
            Admin Panel
          </button>
        </nav>

        {/* 3. Desktop Actions: Theme Switcher & Auth */}
        <div className="desktop-actions">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* User Session or Sign In */}
          {currentUser ? (
            <div className="user-dropdown-container" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="user-profile-pill"
                aria-expanded={userDropdownOpen}
                aria-label="User Account Menu"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'}
                  alt={currentUser.name}
                />
                <span className="user-name">{currentUser.name}</span>
                <span style={{ fontSize: '10px', opacity: 0.7 }}>▼</span>
              </button>

              {userDropdownOpen && (
                <div className="user-nav-dropdown">
                  <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Signed in as
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', marginTop: '2px' }}>
                      {currentUser.name}
                    </div>
                    <div style={{
                      display: 'inline-block',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: currentUser.role === 'Admin' ? 'var(--accent-rose)' : 'var(--primary-light)',
                      background: currentUser.role === 'Admin' ? 'rgba(244, 63, 94, 0.12)' : 'var(--badge-bg)',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      marginTop: '6px'
                    }}>
                      {currentUser.role} Account
                    </div>
                  </div>

                  <button
                    onClick={() => handleNavClick('user')}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '9px 12px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    👤 Workspace Dashboard
                  </button>

                  {currentUser.role === 'Admin' && (
                    <button
                      onClick={() => handleNavClick('admin')}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '9px 12px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-rose)',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      🛡️ Admin Control Center
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '9px 12px',
                      background: 'none',
                      border: 'none',
                      color: '#f87171',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderTop: '1px solid var(--border-subtle)',
                      marginTop: '4px',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
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
        </div>

        {/* 4. Mobile Hamburger Button */}
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

            {/* Mobile Theme Toggle */}
            <button
              className="mobile-nav-link"
              onClick={toggleTheme}
              style={{ justifyContent: 'center', gap: '8px', borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: '4px' }}
            >
              {theme === 'dark' ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
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
export default Navbar;
