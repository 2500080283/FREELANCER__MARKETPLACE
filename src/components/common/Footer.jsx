import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export function Footer({ onNavigateMarketplace }) {
  const { showToast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast('Thank you for subscribing to FreelanceHub updates!', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="logo" style={{ marginBottom: '14px' }}>
            <div className="logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            Freelance<span>Hub</span>
          </div>
          <p>
            The trusted global platform for hiring high-caliber freelance engineers, designers, and creative professionals. Built with React and Vite.
          </p>
        </div>

        <div className="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><a href="#projects" onClick={onNavigateMarketplace}>Web Development</a></li>
            <li><a href="#projects" onClick={onNavigateMarketplace}>UI/UX & Design</a></li>
            <li><a href="#projects" onClick={onNavigateMarketplace}>Mobile Applications</a></li>
            <li><a href="#projects" onClick={onNavigateMarketplace}>AI & Machine Learning</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><a href="#home" onClick={onNavigateMarketplace}>About Us</a></li>
            <li><a href="#how-it-works" onClick={onNavigateMarketplace}>How It Works</a></li>
            <li><a href="#freelancers" onClick={onNavigateMarketplace}>Top Freelancers</a></li>
            <li><a href="#post-project" onClick={onNavigateMarketplace}>Post a Job</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Stay Updated</h4>
          <p style={{ fontSize: '13.5px' }}>Subscribe to our newsletter for curated job alerts and tech trends.</p>
          <form className="newsletter-box" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary btn-sm">Join</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 FreelanceHub. All rights reserved. React + Vite Edition.</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#home">Privacy Policy</a>
          <a href="#home">Terms of Service</a>
          <a href="#home">Security</a>
        </div>
      </div>
    </footer>
  );
}

