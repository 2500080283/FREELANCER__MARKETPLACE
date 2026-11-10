import React, { useState, useEffect } from 'react';

export function LandingModule({
  onGetStarted,
  onPostProject,
  onCategorySelect,
  projects = [],
  onNavigateLogin,
  onOpenApply
}) {
  const [activeTab, setActiveTab] = useState('clients'); // 'clients' | 'freelancers'
  const [searchTerm, setSearchTerm] = useState('');

  // Animated platform counters
  const [counts, setCounts] = useState({
    escrow: 0,
    projectsCount: 0,
    freelancersCount: 0,
    satisfaction: 0
  });

  useEffect(() => {
    let startTime = null;
    const duration = 1800;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      setCounts({
        escrow: (4.8 * ease).toFixed(1),
        projectsCount: Math.floor(15000 * ease),
        freelancersCount: Math.floor(8200 * ease),
        satisfaction: (98.7 * ease).toFixed(1)
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onCategorySelect) {
      onCategorySelect(searchTerm.trim() || 'All');
    } else if (onGetStarted) {
      onGetStarted();
    }
  };

  const handleSkillTagClick = (skill) => {
    if (onCategorySelect) {
      onCategorySelect(skill);
    } else if (onGetStarted) {
      onGetStarted();
    }
  };

  // Top categories data
  const popularCategories = [
    {
      id: 'web',
      name: 'Web & Full Stack',
      query: 'Web Development',
      icon: 'fa-solid fa-code',
      count: '380+ Open Gigs',
      rate: 'From ₹1,800/hr',
      description: 'React, Next.js, Vue, Node.js, Python, PostgreSQL, and scalable REST/GraphQL APIs.'
    },
    {
      id: 'mobile',
      name: 'Mobile Applications',
      query: 'Mobile Apps',
      icon: 'fa-solid fa-mobile-screen-button',
      count: '190+ Open Gigs',
      rate: 'From ₹2,200/hr',
      description: 'Cross-platform Flutter, React Native, Swift iOS, Kotlin Android apps with native smoothness.'
    },
    {
      id: 'ai',
      name: 'AI, ML & Data Science',
      query: 'AI & Data Science',
      icon: 'fa-solid fa-brain',
      count: '220+ Open Gigs',
      rate: 'From ₹2,800/hr',
      description: 'LLM fine-tuning, RAG pipelines, PyTorch models, LangChain workflows, and data pipelines.'
    },
    {
      id: 'design',
      name: 'UI/UX & Product Design',
      query: 'UI/UX Design',
      icon: 'fa-solid fa-pen-ruler',
      count: '160+ Open Gigs',
      rate: 'From ₹1,500/hr',
      description: 'Modern Figma design systems, wireframing, high-fidelity prototypes, and design audits.'
    },
    {
      id: 'devops',
      name: 'Cloud, DevOps & Infra',
      query: 'DevOps & Cloud',
      icon: 'fa-solid fa-cloud-arrow-up',
      count: '110+ Open Gigs',
      rate: 'From ₹2,500/hr',
      description: 'AWS, GCP, Docker containerization, Kubernetes clusters, CI/CD pipelines, and microservices.'
    },
    {
      id: 'security',
      name: 'Security & Smart Contracts',
      query: 'Blockchain & Security',
      icon: 'fa-solid fa-shield-halved',
      count: '85+ Open Gigs',
      rate: 'From ₹3,200/hr',
      description: 'Smart contract development, code auditing, vulnerability assessments, and penetration testing.'
    }
  ];

  // Top featured projects
  const featuredProjects = projects.slice(0, 3);

  return (
    <div id="landingView" className="module-view active landing-page-wrapper">
      {/* 1. HERO SECTION */}
      <section className="home-hero-section">
        <div className="home-hero-inner">
          {/* Eyebrow Trust Badge */}
          <div className="home-eyebrow-pill anim" style={{ '--d': '0.05s' }}>
            <span className="eyebrow-dot"></span>
            <span className="eyebrow-text">Premier Freelance Tech & Design Marketplace</span>
            <span className="eyebrow-tag">v2.0 Verified</span>
          </div>

          {/* Main Headline */}
          <h1 className="home-main-headline anim" style={{ '--d': '0.15s' }}>
            Hire World-Class Talent.
            <span className="home-headline-gradient"> Deliver Ambitious Projects.</span>
          </h1>

          {/* Subheading */}
          <p className="home-subhead anim" style={{ '--d': '0.25s' }}>
            Connect with pre-vetted engineers, UI/UX designers, AI researchers, and mobile specialists.
            Work with total peace of mind backed by automated milestone escrow protection.
          </p>

          {/* Interactive Search Bar */}
          <div className="home-search-container anim" style={{ '--d': '0.35s' }}>
            <form className="home-search-form" onSubmit={handleSearchSubmit}>
              <div className="home-search-icon">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <input
                type="text"
                className="home-search-input"
                placeholder="Search skills (e.g. React, Next.js, Python, UI/UX, Flutter)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="home-search-btn">
                <span>Find Talent</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </form>

            {/* Popular Quick Filter Tags */}
            <div className="home-quick-tags">
              <span className="quick-tags-label">Popular Searches:</span>
              {['React', 'Next.js', 'Python', 'UI/UX Design', 'AI / ML', 'Flutter', 'DevOps'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="quick-tag-pill"
                  onClick={() => handleSkillTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Dual Action CTA Buttons */}
          <div className="home-hero-actions anim" style={{ '--d': '0.45s' }}>
            <button className="btn-home-primary" onClick={onGetStarted}>
              <i className="fa-solid fa-briefcase"></i>
              <span>Explore Marketplace</span>
            </button>
            <button className="btn-home-secondary" onClick={onPostProject || onGetStarted}>
              <i className="fa-solid fa-circle-plus"></i>
              <span>Post a Project (Hire)</span>
            </button>
          </div>

          {/* Live Trust Badges Bar */}
          <div className="home-trust-badges anim" style={{ '--d': '0.55s' }}>
            <div className="trust-badge-item">
              <i className="fa-solid fa-shield-check" style={{ color: 'var(--accent-emerald)' }}></i>
              <span>100% Escrow Protected</span>
            </div>
            <div className="trust-badge-separator">•</div>
            <div className="trust-badge-item">
              <i className="fa-solid fa-star" style={{ color: 'var(--accent-amber)' }}></i>
              <span>4.9 / 5 Rating (15K+ Reviews)</span>
            </div>
            <div className="trust-badge-separator">•</div>
            <div className="trust-badge-item">
              <i className="fa-solid fa-bolt" style={{ color: 'var(--primary-light)' }}></i>
              <span>Average Match &lt; 24h</span>
            </div>
            <div className="trust-badge-separator">•</div>
            <div className="trust-badge-item">
              <i className="fa-solid fa-badge-percent" style={{ color: '#c084fc' }}></i>
              <span>Zero Upfront Hidden Fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PLATFORM METRICS COUNTER BAR */}
      <section className="home-stats-strip">
        <div className="stats-strip-container">
          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-symbol">₹</span>
              <span className="stat-number">{counts.escrow}</span>
              <span className="stat-unit">Cr+</span>
            </div>
            <div className="stat-card-label">Protected Escrow Volume</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-symbol">✓</span>
              <span className="stat-number">{counts.projectsCount.toLocaleString()}</span>
              <span className="stat-unit">+</span>
            </div>
            <div className="stat-card-label">Delivered Projects</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-symbol">★</span>
              <span className="stat-number">{counts.freelancersCount.toLocaleString()}</span>
              <span className="stat-unit">+</span>
            </div>
            <div className="stat-card-label">Verified Specialists</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-symbol">%</span>
              <span className="stat-number">{counts.satisfaction}</span>
              <span className="stat-unit">%</span>
            </div>
            <div className="stat-card-label">Client Satisfaction Rate</div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR SERVICE CATEGORIES */}
      <section className="home-categories-section">
        <div className="section-header-center">
          <span className="section-eyebrow">HIGH-DEMAND DOMAINS</span>
          <h2 className="section-title">Explore Specialized Categories</h2>
          <p className="section-subtitle">
            Find certified engineers, designers, and domain specialists ready to accelerate your product roadmap.
          </p>
        </div>

        <div className="categories-grid-container">
          {popularCategories.map((cat) => (
            <div
              key={cat.id}
              className="category-showcase-card"
              onClick={() => onCategorySelect ? onCategorySelect(cat.query) : onGetStarted()}
            >
              <div className="category-card-top">
                <div className="category-icon-box">
                  <i className={cat.icon}></i>
                </div>
                <span className="category-count-pill">{cat.count}</span>
              </div>
              <h3 className="category-card-title">{cat.name}</h3>
              <p className="category-card-desc">{cat.description}</p>
              <div className="category-card-footer">
                <span className="category-rate-hint">{cat.rate}</span>
                <span className="category-card-arrow">
                  <span>Explore</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS (INTERACTIVE DUAL TAB) */}
      <section className="home-how-section">
        <div className="section-header-center">
          <span className="section-eyebrow">SIMPLE & TRANSPARENT</span>
          <h2 className="section-title">How FreelanceHub Works</h2>
          <p className="section-subtitle">
            A frictionless, milestone-driven workflow designed for maximum confidence and velocity.
          </p>

          {/* Interactive Role Switcher */}
          <div className="how-role-toggle">
            <button
              className={`role-toggle-btn ${activeTab === 'clients' ? 'active' : ''}`}
              onClick={() => setActiveTab('clients')}
            >
              <i className="fa-solid fa-building-columns"></i>
              <span>For Clients (Hire Talent)</span>
            </button>
            <button
              className={`role-toggle-btn ${activeTab === 'freelancers' ? 'active' : ''}`}
              onClick={() => setActiveTab('freelancers')}
            >
              <i className="fa-solid fa-laptop-code"></i>
              <span>For Freelancers (Work & Earn)</span>
            </button>
          </div>
        </div>

        {activeTab === 'clients' ? (
          <div className="how-steps-grid">
            <div className="how-step-card">
              <div className="how-step-number">01</div>
              <div className="how-step-icon">
                <i className="fa-solid fa-file-circle-plus"></i>
              </div>
              <h4>Post Your Project Scope</h4>
              <p>
                Define your deliverables, required tech stack, and budget. Receive tailored proposals from verified specialists within hours.
              </p>
            </div>

            <div className="how-step-card">
              <div className="how-step-number">02</div>
              <div className="how-step-icon">
                <i className="fa-solid fa-user-check"></i>
              </div>
              <h4>Review Proposals & Portfolios</h4>
              <p>
                Evaluate client reviews, technical case studies, and bid prices. Chat in real-time to align on expectations.
              </p>
            </div>

            <div className="how-step-card">
              <div className="how-step-number">03</div>
              <div className="how-step-icon">
                <i className="fa-solid fa-vault"></i>
              </div>
              <h4>Deposit Milestone to Escrow</h4>
              <p>
                Lock project funds securely into our automated escrow. Funds remain 100% protected and are only released when you are satisfied.
              </p>
            </div>

            <div className="how-step-card">
              <div className="how-step-number">04</div>
              <div className="how-step-icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <h4>Approve & Release Payment</h4>
              <p>
                Review completed code or design assets. Release milestone funds with 1 click and exchange mutual 5-star ratings.
              </p>
            </div>
          </div>
        ) : (
          <div className="how-steps-grid">
            <div className="how-step-card">
              <div className="how-step-number">01</div>
              <div className="how-step-icon">
                <i className="fa-solid fa-id-card-clip"></i>
              </div>
              <h4>Create Your Pro Profile</h4>
              <p>
                Highlight your verified tech stack, portfolio repositories, past client testimonials, and preferred hourly or fixed rates.
              </p>
            </div>

            <div className="how-step-card">
              <div className="how-step-number">02</div>
              <div className="how-step-icon">
                <i className="fa-solid fa-magnifying-glass-chart"></i>
              </div>
              <h4>Bid on Verified Projects</h4>
              <p>
                Explore hundreds of high-paying client contracts filtered by your expertise. Pitch clear milestones and delivery timelines.
              </p>
            </div>

            <div className="how-step-card">
              <div className="how-step-number">03</div>
              <div className="how-step-icon">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h4>Work with Escrow Guarantee</h4>
              <p>
                Begin coding or designing with full security knowing client funds are already pre-funded in escrow before you write a single line.
              </p>
            </div>

            <div className="how-step-card">
              <div className="how-step-number">04</div>
              <div className="how-step-icon">
                <i className="fa-solid fa-money-bill-transfer"></i>
              </div>
              <h4>Receive Direct Payouts</h4>
              <p>
                Receive instant earnings upon milestone approval directly to your linked bank account with low, transparent 10% platform fees.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 5. WHY FREELANCEHUB ADVANTAGES */}
      <section className="home-features-section">
        <div className="section-header-center">
          <span className="section-eyebrow">BUILT FOR TRUST</span>
          <h2 className="section-title">Why Elite Teams Choose FreelanceHub</h2>
          <p className="section-subtitle">
            Enterprise-grade safety, dispute mitigation, and transparent economics engineered into every project.
          </p>
        </div>

        <div className="features-columns-grid">
          <div className="feature-benefit-card">
            <div className="feature-benefit-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
              <i className="fa-solid fa-lock"></i>
            </div>
            <h3>Milestone-Locked Escrow</h3>
            <p>
              Clients never pay for incomplete work, and freelancers are guaranteed payout for approved deliverables. Zero payment anxiety.
            </p>
          </div>

          <div className="feature-benefit-card">
            <div className="feature-benefit-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-light)' }}>
              <i className="fa-solid fa-award"></i>
            </div>
            <h3>Pre-Vetted Developer Standards</h3>
            <p>
              Talent profiles are reviewed for verified code samples, domain expertise, and client delivery track records.
            </p>
          </div>

          <div className="feature-benefit-card">
            <div className="feature-benefit-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
              <i className="fa-solid fa-scale-balanced"></i>
            </div>
            <h3>Fair Admin Dispute Arbitration</h3>
            <p>
              Dedicated platform moderators step in within 24 hours to objectively resolve escrow disputes and enforce contractual terms.
            </p>
          </div>

          <div className="feature-benefit-card">
            <div className="feature-benefit-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--secondary)' }}>
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <h3>Transparent 10% Platform Fee</h3>
            <p>
              No hidden currency conversion cuts, withdrawal fees, or surprise monthly subscriptions. What you see is what you get.
            </p>
          </div>

          <div className="feature-benefit-card">
            <div className="feature-benefit-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)' }}>
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            <h3>Full Audit Trail & Logs</h3>
            <p>
              Every bid, status transition, escrow fund allocation, and milestone release is timestamped in an immutable system audit log.
            </p>
          </div>

          <div className="feature-benefit-card">
            <div className="feature-benefit-icon" style={{ background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc' }}>
              <i className="fa-solid fa-comments"></i>
            </div>
            <h3>Direct Client-Specialist Comms</h3>
            <p>
              Communicate specs directly, submit iterative review drafts, request revisions, and finalize handovers in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* 6. LIVE FEATURED PROJECTS SHOWCASE */}
      {featuredProjects.length > 0 && (
        <section className="home-featured-projects-section">
          <div className="section-header-split">
            <div>
              <span className="section-eyebrow">HOT OPPORTUNITIES</span>
              <h2 className="section-title">Trending Open Contracts</h2>
              <p className="section-subtitle">
                High-priority projects currently open for proposals from qualified specialists.
              </p>
            </div>
            <button className="btn-view-all-projects" onClick={onGetStarted}>
              <span>View All {projects.length} Gigs</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <div className="featured-projects-grid">
            {featuredProjects.map((proj) => (
              <div key={proj.id} className="featured-project-card">
                <div className="featured-project-header">
                  <span className="featured-category-badge">{proj.category}</span>
                  <span className="featured-budget-tag">
                    ₹{Number(proj.budget).toLocaleString()}
                  </span>
                </div>

                <h3 className="featured-project-title">{proj.title}</h3>
                <p className="featured-project-desc">
                  {proj.description.length > 120
                    ? proj.description.substring(0, 120) + '...'
                    : proj.description}
                </p>

                <div className="featured-skills-row">
                  {proj.skills && proj.skills.slice(0, 3).map((sk, idx) => (
                    <span key={idx} className="featured-skill-pill">
                      {sk}
                    </span>
                  ))}
                </div>

                <div className="featured-project-footer">
                  <div className="featured-client-info">
                    <span className="client-avatar-mini">
                      {proj.client?.name ? proj.client.name.charAt(0) : 'C'}
                    </span>
                    <span className="client-name-mini">{proj.client?.name || 'Verified Client'}</span>
                  </div>
                  <button
                    className="btn-featured-apply"
                    onClick={() => onOpenApply ? onOpenApply(proj) : onGetStarted()}
                  >
                    <span>Submit Pitch</span>
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. CLIENT & SPECIALIST REVIEWS */}
      <section className="home-testimonials-section">
        <div className="section-header-center">
          <span className="section-eyebrow">TESTIMONIALS</span>
          <h2 className="section-title">Loved by High-Growth Teams & Freelancers</h2>
          <p className="section-subtitle">
            See how founders, product leaders, and independent contractors deliver together.
          </p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-quote-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              "FreelanceHub cut our hiring cycle from 3 weeks to less than 48 hours. We found an incredible Next.js architect who revamped our whole dashboard. The escrow milestone system gave our finance team total reassurance."
            </p>
            <div className="testimonial-author">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Meera Sen"
                className="testimonial-avatar"
              />
              <div>
                <h4 className="author-name">Meera Sen</h4>
                <span className="author-role">VP of Product, FinScale India</span>
              </div>
            </div>
          </div>

          <div className="testimonial-quote-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              "As a senior mobile developer, I've used multiple freelance platforms. FreelanceHub has by far the fairest fee structure and the milestone payments are always deposited on time. 10/10 recommend to any serious engineer."
            </p>
            <div className="testimonial-author">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Arjun Nambiar"
                className="testimonial-avatar"
              />
              <div>
                <h4 className="author-name">Arjun Nambiar</h4>
                <span className="author-role">Flutter & iOS Specialist</span>
              </div>
            </div>
          </div>

          <div className="testimonial-quote-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              "The dispute resolution and verified profile system gives us confidence to contract high-budget technical projects with remote experts without worrying about delivery quality."
            </p>
            <div className="testimonial-author">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                alt="Siddharth Rao"
                className="testimonial-avatar"
              />
              <div>
                <h4 className="author-name">Siddharth Rao</h4>
                <span className="author-role">Founder, Nexus Cloud Labs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. HIGH-CONVERSION BOTTOM CTA BANNER */}
      <section className="home-cta-banner-section">
        <div className="cta-banner-card">
          <div className="cta-banner-content">
            <span className="cta-badge">GET STARTED IN MINUTES</span>
            <h2 className="cta-banner-title">
              Ready to Accelerate Your Project or Start Earning Today?
            </h2>
            <p className="cta-banner-desc">
              Join over 15,000 businesses and pre-vetted specialists building the future of software, design, and AI.
            </p>
            <div className="cta-banner-buttons">
              <button className="btn-banner-primary" onClick={onNavigateLogin || onGetStarted}>
                <i className="fa-solid fa-rocket"></i>
                <span>Sign In / Create Account</span>
              </button>
              <button className="btn-banner-secondary" onClick={onGetStarted}>
                <i className="fa-solid fa-list-check"></i>
                <span>Browse All Projects</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
