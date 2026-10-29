import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function UserModule({
  projects = [],
  applications = [],
  bookmarks = [],
  onOpenClientProposals,
  onOpenApply,
  onToggleBookmark,
  onNavigateMarketplace
}) {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState(
    currentUser?.role === 'Client' ? 'projects' : 'proposals'
  );

  // Profile edit state
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileTitle, setProfileTitle] = useState(currentUser?.title || '');
  const [profileHourly, setProfileHourly] = useState(currentUser?.hourlyRate || '');
  const [profileSkills, setProfileSkills] = useState(
    currentUser?.skills ? currentUser.skills.join(', ') : ''
  );
  const [profileBio, setProfileBio] = useState(currentUser?.bio || '');

  if (!currentUser) return null;

  // Filter projects owned by this client
  const myProjects = projects.filter(
    p => p.client?.email === currentUser.email || p.client?.name === currentUser.name
  );

  // Proposals received across all client's projects
  const proposalsReceivedCount = applications.filter(app =>
    myProjects.some(mp => mp.id === app.projectId)
  ).length;

  // Freelancer bids submitted by this user
  const myBids = applications.filter(
    app => app.freelancerEmail === currentUser.email || app.freelancerName === currentUser.name
  );

  // Saved bookmarked projects
  const savedProjectsList = projects.filter(p => bookmarks.includes(p.id));

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const skillsArray = profileSkills.split(',').map(s => s.trim()).filter(Boolean);

    updateProfile({
      name: profileName.trim(),
      title: profileTitle.trim(),
      hourlyRate: profileHourly.trim(),
      skills: skillsArray,
      bio: profileBio.trim()
    });

    showToast('Profile settings saved successfully to LocalStorage!', 'success');
  };

  return (
    <div id="userModuleView" className="module-view active">
      {/* Module Banner */}
      <div className="module-banner">
        <div className="module-banner-inner">
          <div className="module-title-group">
            <h1>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              User Workspace & Dashboard
            </h1>
            <p>
              Welcome back, <strong>{currentUser.name}</strong>! Manage your projects, review applicant proposals, and track your active bids.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className={`status-pill ${currentUser.role === 'Client' ? 'status-active' : 'status-role-admin'}`} style={{
              background: currentUser.role === 'Client' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: currentUser.role === 'Client' ? 'var(--primary-light)' : 'var(--accent-emerald)',
              fontWeight: 700
            }}>
              {currentUser.role === 'Client' ? '🏢 Client Mode' : (currentUser.role === 'Admin' ? '🛡️ Admin Account' : '💻 Freelancer Mode')}
            </span>
            <button className="btn btn-outline btn-sm" onClick={onNavigateMarketplace}>
              ← Explore Marketplace
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => {
              onNavigateMarketplace();
              setTimeout(() => {
                const el = document.getElementById('post-project');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 200);
            }}>
              + Post New Project
            </button>
          </div>
        </div>
      </div>

      <div className="module-container">
        {/* KPI Dashboard Summary */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-info">
              <span className="kpi-label">My Posted Projects</span>
              <h2 className="kpi-value">{myProjects.length}</h2>
            </div>
            <div className="kpi-icon-wrap kpi-icon-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-info">
              <span className="kpi-label">Proposals Received</span>
              <h2 className="kpi-value">{proposalsReceivedCount}</h2>
            </div>
            <div className="kpi-icon-wrap kpi-icon-cyan">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-info">
              <span className="kpi-label">My Submitted Bids</span>
              <h2 className="kpi-value">{myBids.length}</h2>
            </div>
            <div className="kpi-icon-wrap kpi-icon-emerald">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-info">
              <span className="kpi-label">Saved Bookmarks</span>
              <h2 className="kpi-value">{savedProjectsList.length}</h2>
            </div>
            <div className="kpi-icon-wrap kpi-icon-amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="module-tabs">
          <button
            className={`module-tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            📋 My Projects <span className="tab-badge">{myProjects.length}</span>
          </button>
          <button
            className={`module-tab ${activeTab === 'proposals' ? 'active' : ''}`}
            onClick={() => setActiveTab('proposals')}
          >
            💼 My Submitted Bids <span className="tab-badge">{myBids.length}</span>
          </button>
          <button
            className={`module-tab ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            🔖 Saved Projects <span className="tab-badge">{savedProjectsList.length}</span>
          </button>
          <button
            className={`module-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            ⚙️ Profile Settings
          </button>
        </div>

        {/* TAB 1: MY POSTED PROJECTS (Client View) */}
        {activeTab === 'projects' && (
          <div className="user-tab-pane">
            <div className="data-card">
              <div className="data-card-header">
                <div>
                  <h3>Client Project Management</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Review your posted job listings, inspect incoming proposals, and award contracts with Escrow.
                  </p>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    onNavigateMarketplace();
                    setTimeout(() => {
                      const el = document.getElementById('post-project');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 200);
                  }}
                >
                  + Post New Job
                </button>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Project Title</th>
                      <th>Category</th>
                      <th>Budget (₹)</th>
                      <th>Moderation Status</th>
                      <th>Proposals</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myProjects.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                          You haven't posted any projects yet. Click "+ Post New Job" to hire world-class talent!
                        </td>
                      </tr>
                    ) : (
                      myProjects.map(proj => {
                        const count = applications.filter(a => a.projectId === proj.id).length;
                        return (
                          <tr key={proj.id}>
                            <td>
                              <strong style={{ color: 'var(--text-primary)' }}>{proj.title}</strong>
                            </td>
                            <td>{proj.category}</td>
                            <td>₹{proj.budget.toLocaleString()}</td>
                            <td>
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 700,
                                background: proj.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                color: proj.status === 'approved' ? 'var(--accent-emerald)' : 'var(--accent-amber)'
                              }}>
                                {proj.status === 'approved' ? 'Approved & Live' : proj.status}
                              </span>
                            </td>
                            <td>
                              <strong>{count}</strong> proposal(s)
                            </td>
                            <td>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => onOpenClientProposals(proj)}
                              >
                                View Proposals ({count})
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY SUBMITTED BIDS (Freelancer View) */}
        {activeTab === 'proposals' && (
          <div className="user-tab-pane">
            <div className="data-card">
              <div className="data-card-header">
                <div>
                  <h3>Freelancer Proposal Tracker</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Track all project bids you have submitted, along with delivery timelines and client decisions.
                  </p>
                </div>
                <button className="btn btn-outline btn-sm" onClick={onNavigateMarketplace}>
                  Browse More Jobs
                </button>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Project Title</th>
                      <th>Bid Amount</th>
                      <th>Timeline</th>
                      <th>Submission Date</th>
                      <th>Proposal Status</th>
                      <th>Escrow State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myBids.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                          You have not submitted any bids yet. Head over to the Marketplace and apply for open projects!
                        </td>
                      </tr>
                    ) : (
                      myBids.map(bid => {
                        const isAccepted = bid.status === 'accepted';
                        return (
                          <tr key={bid.id}>
                            <td>
                              <strong style={{ color: 'var(--text-primary)' }}>{bid.projectTitle}</strong>
                            </td>
                            <td style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
                              ₹{bid.bid.toLocaleString()}
                            </td>
                            <td>{bid.timeline}</td>
                            <td>{bid.date?.substring(0, 10)}</td>
                            <td>
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 700,
                                background: isAccepted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                color: isAccepted ? 'var(--accent-emerald)' : 'var(--accent-amber)'
                              }}>
                                {isAccepted ? 'Accepted / Hired' : 'Pending Review'}
                              </span>
                            </td>
                            <td>
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 600,
                                background: isAccepted ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                color: isAccepted ? 'var(--secondary)' : 'var(--text-muted)'
                              }}>
                                {bid.escrowState}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SAVED PROJECTS */}
        {activeTab === 'saved' && (
          <div className="user-tab-pane">
            <div className="data-card">
              <div className="data-card-header">
                <div>
                  <h3>Bookmarked Opportunities</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Quickly access projects you have bookmarked for later application.
                  </p>
                </div>
              </div>

              {savedProjectsList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '15px' }}>You haven't bookmarked any projects yet.</p>
                  <p style={{ fontSize: '13px', marginTop: '6px' }}>Click the star icon on any project card in the marketplace to save it here.</p>
                </div>
              ) : (
                <div className="project-grid" style={{ marginTop: '16px' }}>
                  {savedProjectsList.map(project => (
                    <div key={project.id} className="project-card">
                      <div className="card-top">
                        <span className="card-category-badge">{project.category}</span>
                        <button
                          className="bookmark-btn"
                          onClick={() => onToggleBookmark(project.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--accent-amber)',
                            fontSize: '18px'
                          }}
                          title="Remove Bookmark"
                        >
                          ★
                        </button>
                      </div>

                      <h3>{project.title}</h3>
                      <p className="project-desc">{project.description}</p>

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
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="user-tab-pane">
            <div className="data-card">
              <div className="profile-edit-grid">
                <div className="profile-card-static">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'}
                    alt={currentUser.name}
                    className="profile-avatar-lg"
                  />
                  <h3>{currentUser.name}</h3>
                  <p style={{ color: 'var(--primary-light)', fontWeight: 600, fontSize: '14px', marginTop: '4px' }}>
                    {currentUser.role}
                  </p>
                  <div style={{ marginTop: '14px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {currentUser.email}
                  </div>
                  <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    Member since: {currentUser.joinedDate}
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="userProfileName">Full Name</label>
                      <input
                        type="text"
                        id="userProfileName"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="userProfileTitle">Professional Title / Company</label>
                      <input
                        type="text"
                        id="userProfileTitle"
                        value={profileTitle}
                        onChange={(e) => setProfileTitle(e.target.value)}
                        placeholder="e.g. Senior Full Stack Engineer"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="userProfileHourly">Hourly Rate (or Budget Preference)</label>
                      <input
                        type="text"
                        id="userProfileHourly"
                        value={profileHourly}
                        onChange={(e) => setProfileHourly(e.target.value)}
                        placeholder="e.g. ₹2,500/hr"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="userProfileSkills">Skills / Tech Stack (Comma separated)</label>
                      <input
                        type="text"
                        id="userProfileSkills"
                        value={profileSkills}
                        onChange={(e) => setProfileSkills(e.target.value)}
                        placeholder="React, Node.js, Python, UI/UX"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '12px' }}>
                    <label htmlFor="userProfileBio">Bio / Professional Summary</label>
                    <textarea
                      id="userProfileBio"
                      rows={4}
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      placeholder="Share your experience, services, and qualifications..."
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: '18px' }}>
                    Save Profile Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
