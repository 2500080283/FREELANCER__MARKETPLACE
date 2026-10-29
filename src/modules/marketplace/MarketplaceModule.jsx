import React, { useState, useMemo } from 'react';
import { PostProjectSection } from './PostProjectSection';
import { INITIAL_FREELANCERS } from '../../data/initialData';

export function MarketplaceModule({
  projects = [],
  bookmarks = [],
  onToggleBookmark,
  onOpenApply,
  onOpenProfile,
  onProjectCreated
}) {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [budgetTier, setBudgetTier] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Filter & Sort computation
  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => p.status === 'approved')
      .filter(p => {
        // Category filter
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }

        // Budget tier filter
        if (budgetTier === 'under-10k' && p.budget >= 10000) return false;
        if (budgetTier === '10k-25k' && (p.budget < 10000 || p.budget > 25000)) return false;
        if (budgetTier === 'above-25k' && p.budget <= 25000) return false;

        // Search filter (title, description, skills, category)
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchSkills = p.skills?.some(s => s.toLowerCase().includes(q));
          return matchTitle || matchDesc || matchCategory || matchSkills;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'budget-high') return b.budget - a.budget;
        if (sortBy === 'budget-low') return a.budget - b.budget;
        // Default newest
        return (b.id || '').localeCompare(a.id || '');
      });
  }, [projects, selectedCategory, budgetTier, sortBy, searchTerm]);

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPostProject = () => {
    const el = document.getElementById('post-project');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="marketplaceModuleView" className="module-view active">
      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-pill">
          <span className="pulse-dot"></span>
          Verified Talent & Escrow Protected Platform
        </div>

        <div className="hero-content">
          <h1>
            Find the <span className="gradient-text">Right Freelancer</span> for Your Next Project
          </h1>

          <p>
            Connect with world-class engineers, designers, and creative experts.
            Post projects seamlessly, collaborate securely, and achieve extraordinary results.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={scrollToProjects}>
              Explore Projects
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <button className="btn btn-secondary btn-lg" onClick={scrollToPostProject}>
              Post a Project
            </button>
          </div>

          {/* Hero Quick Search Box */}
          <div className="hero-search-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              id="heroSearchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role, skill, or project title (e.g. React, UI/UX, Flutter)..."
              aria-label="Search projects"
            />
            <button className="btn btn-primary btn-sm" onClick={scrollToProjects}>
              Search
            </button>
          </div>

          {/* Quick Category Tags */}
          <div className="hero-tags">
            <span>Popular:</span>
            {['React', 'UI/UX', 'Mobile', 'AI', 'Full Stack'].map(tag => (
              <button
                key={tag}
                className="hero-tag-btn"
                onClick={() => {
                  setSearchTerm(tag);
                  scrollToProjects();
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Metrics */}
      <div className="metrics-section">
        <div className="metrics-grid">
          <div className="metric-item">
            <span className="metric-number">15,000+</span>
            <span className="metric-label">Vetted Freelancers</span>
          </div>
          <div className="metric-item">
            <span className="metric-number">4,800+</span>
            <span className="metric-label">Completed Projects</span>
          </div>
          <div className="metric-item">
            <span className="metric-number">99.4%</span>
            <span className="metric-label">Client Satisfaction</span>
          </div>
          <div className="metric-item">
            <span className="metric-number">₹1.8 Cr+</span>
            <span className="metric-label">Paid to Freelancers</span>
          </div>
        </div>
      </div>

      {/* Why Choose FreelanceHub */}
      <section className="section">
        <div className="section-header">
          <span className="section-badge">Platform Advantages</span>
          <h2>Why Choose FreelanceHub?</h2>
          <p>We combine verified professional talent, transparent pricing, and bank-grade escrow protection.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            </div>
            <h3>Vetted & Verified Talent</h3>
            <p>Top 2% developers, designers, and consultants rigorously evaluated for technical ability, communication, and reliability.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3>Secure Escrow Payments</h3>
            <p>Funds are held safely in escrow and only released when you inspect and approve milestones, guaranteeing zero risk.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <h3>Fast Turnaround & Matching</h3>
            <p>Receive tailored proposals within hours from freelancers equipped with the exact technology stack you require.</p>
          </div>
        </div>
      </section>

      {/* Available Projects Section */}
      <section id="projects" className="section">
        <div className="section-header">
          <span className="section-badge">Open Opportunities</span>
          <h2>Available Projects ({filteredProjects.length})</h2>
          <p>Browse high-paying jobs from verified clients and submit your proposal in one click.</p>
        </div>

        {/* Filter & Search Bar */}
        <div className="filter-bar">
          <div className="filter-categories" id="categoryFilters">
            {['All', 'Web Development', 'UI/UX & Design', 'Mobile Apps', 'AI & Data'].map(cat => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'All' ? 'All Projects' : (cat === 'Web Development' ? 'Web Dev' : cat)}
              </button>
            ))}
          </div>

          <div className="filter-controls-right">
            <select
              id="budgetFilter"
              className="filter-select"
              value={budgetTier}
              onChange={(e) => setBudgetTier(e.target.value)}
              aria-label="Filter by budget"
            >
              <option value="all">All Budgets</option>
              <option value="under-10k">Under ₹10,000</option>
              <option value="10k-25k">₹10,000 – ₹25,000</option>
              <option value="above-25k">₹25,000+</option>
            </select>

            <select
              id="sortFilter"
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort projects"
            >
              <option value="newest">Newest First</option>
              <option value="budget-high">Budget: High to Low</option>
              <option value="budget-low">Budget: Low to High</option>
            </select>
          </div>
        </div>

        {/* Project Grid */}
        <div id="project-list" className="project-grid">
          {filteredProjects.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <h3>No projects match your filter criteria.</h3>
              <p style={{ marginTop: '8px' }}>Try selecting "All Projects" or clearing the search query.</p>
            </div>
          ) : (
            filteredProjects.map(project => {
              const isBookmarked = bookmarks.includes(project.id);

              return (
                <div key={project.id} className="project-card">
                  <div className="card-top">
                    <span className="card-category-badge">{project.category}</span>
                    <button
                      className="bookmark-btn"
                      onClick={() => onToggleBookmark(project.id)}
                      title={isBookmarked ? 'Remove Bookmark' : 'Save Project'}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: isBookmarked ? 'var(--accent-amber)' : 'var(--text-muted)',
                        fontSize: '18px'
                      }}
                    >
                      {isBookmarked ? '★' : '☆'}
                    </button>
                  </div>

                  <h3>{project.title}</h3>
                  <p className="project-desc">{project.description}</p>

                  <div className="skills-wrapper">
                    {project.skills?.map((skill, sIdx) => (
                      <span key={sIdx} className="skill-tag">{skill}</span>
                    ))}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    margin: '12px 0 6px 0'
                  }}>
                    <span>🏢 {project.client?.name || 'Verified Client'}</span>
                    <span>💬 {project.proposalsCount || 0} proposals</span>
                  </div>

                  <div className="card-footer">
                    <div className="budget-info">
                      <span className="budget-label">Fixed Budget</span>
                      <span className="budget-val">₹{project.budget.toLocaleString()}</span>
                    </div>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onOpenApply(project)}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Top Freelancers Section */}
      <section id="freelancers" className="section" style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
        <div className="section-header">
          <span className="section-badge">World-Class Talent</span>
          <h2>Top-Rated Freelancers</h2>
          <p>Explore profiles of verified experts with proven track records and 5-star ratings.</p>
        </div>

        <div id="freelancer-list" className="freelancer-grid">
          {INITIAL_FREELANCERS.map(free => (
            <div key={free.id} className="freelancer-card">
              <div className="freelancer-header">
                <img src={free.avatar} alt={free.name} className="freelancer-avatar" />
                <div className="freelancer-info">
                  <h3>{free.name}</h3>
                  <span className="freelancer-title">{free.title}</span>
                  <div className="freelancer-rating">
                    <span>⭐ {free.rating}</span>
                    <span style={{ color: 'var(--text-muted)' }}>({free.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="skills-wrapper" style={{ margin: '14px 0' }}>
                {free.skills.slice(0, 4).map((sk, idx) => (
                  <span key={idx} className="skill-tag">{sk}</span>
                ))}
              </div>

              <div className="freelancer-footer">
                <span className="freelancer-rate">{free.hourlyRate}</span>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => onOpenProfile(free)}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section">
        <div className="section-header">
          <span className="section-badge">Simple Workflow</span>
          <h2>How FreelanceHub Works</h2>
          <p>A streamlined four-step workflow built to get your project moving in hours.</p>
        </div>

        <div className="how-it-works-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3>Post Your Project</h3>
            <p>Provide project specifications, timeline, required skill set, and budget to get instant visibility.</p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <h3>Review Proposals</h3>
            <p>Compare proposals, examine verified freelancer portfolios, and conduct direct interviews.</p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <h3>Collaborate in Escrow</h3>
            <p>Fund milestones safely. Funds stay protected until milestones are completed and verified by you.</p>
          </div>

          <div className="step-card">
            <div className="step-number">04</div>
            <h3>Approve & Complete</h3>
            <p>Review final deliverables, release funds securely, and leave a verified review.</p>
          </div>
        </div>
      </section>

      {/* Post Project Section with Real-Time Live Card Preview */}
      <PostProjectSection onProjectCreated={onProjectCreated} />
    </div>
  );
}

