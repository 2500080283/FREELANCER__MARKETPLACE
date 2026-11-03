import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DEFAULT_CATEGORIES } from '../../data/storage';

export function ClientModule({
  projects = [],
  applications = [],
  categories = [],
  settings = {},
  onOpenClientProposals,
  onAcceptProposal,
  onEscrowAction,
  onProjectCreated,
  onNavigateMarketplace
}) {
  const { currentUser, openAuthModal, demoLogin, updateProfile } = useAuth();
  const { showToast } = useToast();

  const availableCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  // Tabs: 'projects' | 'contracts' | 'post' | 'profile'
  const [activeTab, setActiveTab] = useState('projects');
  const [projectStatusFilter, setProjectStatusFilter] = useState('all');

  // Inline Post Project State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(availableCategories[0] || 'Web Development');
  const [newBudget, setNewBudget] = useState('');
  const [newSkills, setNewSkills] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Company profile edit state
  const [companyName, setCompanyName] = useState(currentUser?.name || '');
  const [companyTitle, setCompanyTitle] = useState(currentUser?.title || '');
  const [companyBio, setCompanyBio] = useState(currentUser?.bio || '');

  // Route Guard check: if not signed in or not a client
  if (!currentUser) {
    return (
      <div className="module-view active" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{
          maxWidth: '540px',
          margin: '0 auto',
          background: 'var(--bg-surface-elevated)',
          padding: '40px',
          borderRadius: '16px',
          border: '1px solid var(--border-highlight)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏢</div>
          <h2 style={{ fontSize: '22px', color: 'var(--text-primary)', fontWeight: 700 }}>
            Client Management Workspace
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '14px', lineHeight: 1.6 }}>
            Sign in as an employer or enterprise client to manage your job listings, review applicant proposals, fund escrow milestones, and collaborate with top freelancers.
          </p>

          <div style={{ marginTop: '24px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => demoLogin('client')}
            >
              🏢 1-Click Demo Client (MetricFlow)
            </button>
            <button className="btn btn-secondary" onClick={() => openAuthModal('signin')}>
              Sign In / Register
            </button>
            <button className="btn btn-outline" onClick={onNavigateMarketplace}>
              Return to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter projects posted by this client
  const myProjects = projects.filter(
    p => p.client?.email === currentUser.email || p.client?.name === currentUser.name
  );

  // Total proposals received on client's jobs
  const myJobIds = new Set(myProjects.map(p => p.id));
  const myReceivedProposals = applications.filter(app => myJobIds.has(app.projectId));

  // Active contracts where proposal was accepted
  const activeContracts = applications.filter(
    app => myJobIds.has(app.projectId) && (app.status === 'accepted' || app.escrowState === 'Held in Escrow' || app.escrowState === 'Released to Freelancer')
  );

  // Financial stats
  const totalEscrowHeld = activeContracts
    .filter(a => a.escrowState === 'Held in Escrow')
    .reduce((sum, a) => sum + (Number(a.bid) || 0), 0);

  const totalDisbursed = activeContracts
    .filter(a => a.escrowState === 'Released to Freelancer')
    .reduce((sum, a) => sum + (Number(a.bid) || 0), 0);

  // Filtered projects
  const filteredProjects = myProjects.filter(p => {
    if (projectStatusFilter === 'all') return true;
    return (p.status || 'approved') === projectStatusFilter;
  });

  // Handle new project submission
  const handleCreateProject = (e) => {
    e.preventDefault();

    if (!newTitle.trim() || !newBudget || !newDescription.trim()) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    const skillsArray = newSkills.trim()
      ? newSkills.split(',').map(s => s.trim()).filter(Boolean)
      : ['Web Development'];

    const isAutoApprove = settings?.autoApproveProjects !== false;

    const newProject = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      budget: Number(newBudget),
      description: newDescription.trim(),
      skills: skillsArray,
      postedTime: 'Just now',
      client: {
        name: currentUser.name,
        email: currentUser.email,
        verified: true,
        rating: 5.0,
        country: 'India'
      },
      status: isAutoApprove ? 'approved' : 'pending',
      proposalsCount: 0,
      isFeatured: false
    };

    onProjectCreated(newProject);
    showToast(`Project "${newProject.title}" published!`, 'success');

    // Reset form
    setNewTitle('');
    setNewBudget('');
    setNewSkills('');
    setNewDescription('');
    setActiveTab('projects');
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({
      name: companyName.trim(),
      title: companyTitle.trim(),
      bio: companyBio.trim()
    });
    showToast('Company details updated successfully!', 'success');
  };

  return (
    <div id="clientModuleView" className="module-view active">
      {/* Banner */}
      <div className="module-banner" style={{ background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.08) 0%, transparent 100%)' }}>
        <div className="module-banner-inner">
          <div className="module-title-group">
            <h1>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              Client Management Center
            </h1>
            <p>
              Welcome back, <strong>{currentUser.name}</strong>. Manage your job requisitions, review freelancer proposals, fund escrow milestones, and authorize payments.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="status-pill status-active" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--secondary)' }}>
              🏢 Employer Mode: {currentUser.name}
            </span>
            <button className="btn btn-outline btn-sm" onClick={onNavigateMarketplace}>
              ← Explore Marketplace
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('post')}>
              + Post New Job
            </button>
          </div>
        </div>
      </div>

      <div className="module-container">
        {/* KPI Summary Grid */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-info">
              <span className="kpi-label">Jobs Posted</span>
              <h2 className="kpi-value">{myProjects.length}</h2>
            </div>
            <div className="kpi-icon-wrap kpi-icon-cyan">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-info">
              <span className="kpi-label">Proposals Received</span>
              <h2 className="kpi-value" style={{ color: 'var(--primary-light)' }}>{myReceivedProposals.length}</h2>
            </div>
            <div className="kpi-icon-wrap kpi-icon-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-info">
              <span className="kpi-label">Funds in Escrow</span>
              <h2 className="kpi-value" style={{ color: 'var(--accent-emerald)' }}>₹{totalEscrowHeld.toLocaleString()}</h2>
            </div>
            <div className="kpi-icon-wrap kpi-icon-emerald">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-info">
              <span className="kpi-label">Completed Payouts</span>
              <h2 className="kpi-value" style={{ color: '#c084fc' }}>₹{totalDisbursed.toLocaleString()}</h2>
            </div>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
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
            📋 Posted Projects <span className="tab-badge">{myProjects.length}</span>
          </button>
          <button
            className={`module-tab ${activeTab === 'contracts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contracts')}
          >
            💼 Active Contracts & Escrow <span className="tab-badge">{activeContracts.length}</span>
          </button>
          <button
            className={`module-tab ${activeTab === 'post' ? 'active' : ''}`}
            onClick={() => setActiveTab('post')}
          >
            ➕ Post a New Project
          </button>
          <button
            className={`module-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            🏢 Company & Billing Profile
          </button>
        </div>

        {/* TAB 1: MY POSTED PROJECTS */}
        {activeTab === 'projects' && (
          <div className="admin-tab-pane">
            <div className="data-card">
              <div className="data-card-header">
                <div>
                  <h3>Job Listings & Candidate Review</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    View all job postings created by your account. Click "Review Proposals" to examine freelancer bids and award contracts into escrow.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    className="filter-select"
                    value={projectStatusFilter}
                    onChange={(e) => setProjectStatusFilter(e.target.value)}
                  >
                    <option value="all">All States</option>
                    <option value="approved">Open / Live</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending Moderation</option>
                  </select>
                </div>
              </div>

              {filteredProjects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📂</div>
                  <h4>No jobs posted yet</h4>
                  <p style={{ fontSize: '14px', marginTop: '6px' }}>Click "Post a New Project" to publish your first requirement.</p>
                  <button className="btn btn-primary btn-sm" style={{ marginTop: '16px' }} onClick={() => setActiveTab('post')}>
                    + Post First Job
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {filteredProjects.map(proj => {
                    const projectProposals = applications.filter(a => a.projectId === proj.id);
                    const isCompleted = proj.status === 'completed';
                    const isInProgress = proj.status === 'in_progress';

                    return (
                      <div key={proj.id} style={{
                        padding: '20px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px'
                      }}>
                        <div style={{ flex: '1', minWidth: '260px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: 'rgba(99, 102, 241, 0.15)',
                              color: 'var(--badge-text)'
                            }}>
                              {proj.category}
                            </span>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: isCompleted ? 'rgba(192, 132, 252, 0.15)' : (isInProgress ? 'rgba(6, 182, 212, 0.15)' : 'rgba(16, 185, 129, 0.15)'),
                              color: isCompleted ? '#c084fc' : (isInProgress ? 'var(--secondary)' : 'var(--accent-emerald)')
                            }}>
                              {(proj.status || 'approved').toUpperCase()}
                            </span>
                          </div>

                          <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                            {proj.title}
                          </h3>

                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <span>Budget: <strong style={{ color: 'var(--accent-emerald)' }}>₹{proj.budget?.toLocaleString()}</strong></span>
                            <span>Proposals: <strong style={{ color: 'var(--primary-light)' }}>{projectProposals.length}</strong></span>
                            <span>Posted: {proj.postedTime || 'Recently'}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => onOpenClientProposals(proj)}
                          >
                            📑 Review Proposals ({projectProposals.length})
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE CONTRACTS & ESCROW */}
        {activeTab === 'contracts' && (
          <div className="admin-tab-pane">
            <div className="data-card">
              <div className="data-card-header">
                <div>
                  <h3>Active Milestone Contracts & Escrow Releases</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Inspect awarded freelancer contracts. Funds remain protected in escrow until you approve final deliverables.
                  </p>
                </div>
              </div>

              {activeContracts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
                  <h4>No active escrow contracts yet</h4>
                  <p style={{ fontSize: '14px', marginTop: '6px' }}>When you accept a freelancer proposal, funds will be placed here in escrow.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Hired Specialist</th>
                        <th>Agreed Bid</th>
                        <th>Timeline</th>
                        <th>Escrow Status</th>
                        <th>Milestone Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeContracts.map(contract => {
                        const isHeld = contract.escrowState === 'Held in Escrow';
                        const isReleased = contract.escrowState === 'Released to Freelancer';

                        return (
                          <tr key={contract.id}>
                            <td>
                              <strong style={{ color: 'var(--text-primary)' }}>{contract.projectTitle}</strong>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{contract.freelancerName}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{contract.freelancerEmail}</div>
                            </td>
                            <td style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
                              ₹{contract.bid?.toLocaleString()}
                            </td>
                            <td>{contract.timeline}</td>
                            <td>
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 600,
                                background: isHeld ? 'rgba(6, 182, 212, 0.15)' : (isReleased ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)'),
                                color: isHeld ? 'var(--secondary)' : (isReleased ? 'var(--accent-emerald)' : 'var(--text-muted)')
                              }}>
                                {contract.escrowState || 'Held in Escrow'}
                              </span>
                            </td>
                            <td>
                              {isHeld ? (
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => {
                                    if (window.confirm(`Release ₹${contract.bid?.toLocaleString()} from Escrow to ${contract.freelancerName}?`)) {
                                      onEscrowAction(contract.id, 'Released to Freelancer', 'completed');
                                    }
                                  }}
                                  style={{ padding: '4px 10px', fontSize: '12px', background: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)' }}
                                >
                                  💰 Approve & Release Payout
                                </button>
                              ) : (
                                <span style={{ fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                                  ✓ Payout Released
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: POST PROJECT */}
        {activeTab === 'post' && (
          <div className="admin-tab-pane">
            <div className="data-card" style={{ maxWidth: '780px', margin: '0 auto' }}>
              <div className="data-card-header">
                <div>
                  <h3>Publish New Project Requirement</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Post directly to the freelance talent pool and start receiving bids within hours.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Full-Stack SaaS Web App with Next.js & Stripe"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        fontSize: '14px'
                      }}
                    >
                      {availableCategories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Fixed Budget (INR ₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 35000"
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      required
                      min="1000"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. React, TypeScript, Node.js, PostgreSQL"
                    value={newSkills}
                    onChange={(e) => setNewSkills(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Description & Scope</label>
                  <textarea
                    rows="4"
                    placeholder="Describe the deliverables, timeline expectations, and technical stack requirements..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '14px' }}>
                  🚀 Publish Job Listing
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: COMPANY PROFILE */}
        {activeTab === 'profile' && (
          <div className="admin-tab-pane">
            <div className="data-card" style={{ maxWidth: '640px', margin: '0 auto' }}>
              <div className="data-card-header">
                <div>
                  <h3>Company & Hiring Organization Profile</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Information shown on your job postings to build trust with top candidates.
                  </p>
                </div>
              </div>

              <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Company / Organization Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Hiring Representative Title</label>
                  <input
                    type="text"
                    placeholder="e.g. VP of Engineering / Talent Acquisition Lead"
                    value={companyTitle}
                    onChange={(e) => setCompanyTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>About the Company</label>
                  <textarea
                    rows="3"
                    placeholder="Brief description of your products, engineering culture, and mission..."
                    value={companyBio}
                    onChange={(e) => setCompanyBio(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '10px', fontSize: '14px' }}>
                  Save Company Profile
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ClientModule;
