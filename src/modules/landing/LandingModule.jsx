import React, { useEffect, useState } from 'react';

export function LandingModule({ onGetStarted }) {
  const [counts, setCounts] = useState({
    latency: 0,
    uptime: 0,
    runtime: 0,
    windows: 0
  });

  useEffect(() => {
    let startTime = null;
    const duration = 2000;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setCounts({
        latency: Math.floor(120 * ease),
        uptime: (99.99 * ease).toFixed(2),
        runtime: Math.floor(24 * ease),
        windows: (2.4 * ease).toFixed(1)
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <div id="landingView" className="module-view active">
      {/* Background Video */}
      <div className="bg">
        <video className="bg-video" autoPlay muted loop playsInline>
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      <div className="page">
        {/* Hero Center */}
        <main className="hero">
          {/* Trust Row */}
          <div className="trust-row anim" style={{ '--d': '0.05s' }}>
            <div className="trust-avatars">
              <div className="trust-avatar" title="Microsoft">
                <div className="trust-avatar-inner">
                  <i className="fa-brands fa-microsoft" aria-hidden="true"></i>
                </div>
              </div>
              <div className="trust-avatar" title="Amazon">
                <div className="trust-avatar-inner">
                  <i className="fa-brands fa-amazon" aria-hidden="true"></i>
                </div>
              </div>
              <div className="trust-avatar" title="Google">
                <div className="trust-avatar-inner">
                  <i className="fa-brands fa-google" aria-hidden="true"></i>
                </div>
              </div>
            </div>
            <div className="trust-pill">Trusted by 2000+ Enterprises</div>
          </div>

          {/* Headline */}
          <h1 className="headline anim">
            <span className="headline-line">Intelligence</span>
            <span className="headline-line">Designed To Evolve</span>
          </h1>

          {/* Subhead */}
          <p className="subhead anim" style={{ '--d': '0.28s' }}>
            Build applications that reason, adapt and collaborate using a modular
            AI platform designed for production.
          </p>

          {/* CTA */}
          <div className="cta-wrapper anim" style={{ '--d': '0.4s' }}>
            <button className="btn-cta" onClick={onGetStarted}>
              Get Started
            </button>
          </div>
        </main>

        {/* Stats Footer */}
        <footer className="stats" id="statsFooter">
          <div className="stat-item anim" style={{ '--d': '0.5s' }}>
            <div className="stat-top">
              <span className="stat-icon">&lt;</span>
              <span className="stat-value">
                <span className="stat-val-num">{counts.latency}</span>
                <span className="stat-suffix">ms</span>
              </span>
            </div>
            <span className="stat-label">Inference Time</span>
          </div>

          <div className="stat-item anim" style={{ '--d': '0.58s' }}>
            <div className="stat-top">
              <span className="stat-icon">%</span>
              <span className="stat-value">
                <span className="stat-val-num">{counts.uptime}</span>
                <span className="stat-suffix">%</span>
              </span>
            </div>
            <span className="stat-label">Platform Uptime</span>
          </div>

          <div className="stat-item anim" style={{ '--d': '0.66s' }}>
            <div className="stat-top">
              <span className="stat-icon">*</span>
              <span className="stat-value">
                <span className="stat-val-num">{counts.runtime}</span>
                <span className="stat-suffix">/7</span>
              </span>
            </div>
            <span className="stat-label">Autonomous Runtime</span>
          </div>

          <div className="stat-item anim" style={{ '--d': '0.74s' }}>
            <div className="stat-top">
              <span className="stat-icon">#</span>
              <span className="stat-value">
                <span className="stat-val-num">{counts.windows}</span>
                <span className="stat-suffix">M</span>
              </span>
            </div>
            <span className="stat-label">Context Windows</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
