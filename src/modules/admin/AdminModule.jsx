import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function AdminModule({
  users = [],
  projects = [],
  applications = [],
  auditLogs = [],
  onUpdateProjectStatus,
  onToggleFeatureProject,
  onDeleteProject,
  onUpdateUserStatus,
  onUpdateUserRole,
  onDeleteUser,
  onOpenCreateUser,
  onClearAuditLogs,
  onNavigateMarketplace
}) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('projects');
  const [moderationFilter, setModerationFilter] = useState('all');

  // Route Guard check
  if (!currentUser || currentUser.role !== 'Admin') {
    return (
      <div className="module-view active" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{
          maxWidth: '500px',
          margin: '0 auto',
          background: 'var(--bg-surface-elevated)',
          padding: '40px',
          borderRadius: '16px',
          border: '1px solid var(--accent-rose)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
          <h2 style={{ fontSize: '22px', color: 'var(--accent-rose)', fontWeight: 700 }}>
            Restricted Access: Administrator Privileges Required
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '14px' }}>
            You must be authenticated with an <strong>Admin</strong> account to access the Control Center.
          </p>
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={onNavigateMarketplace}>
              Return to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate KPIs
  const totalUsers = users.length;
  const totalProjects = projects.length;
  const pendingApprovals = projects.filter(p => p.status === 'pending').length;
  const escrowVolume = applications
    .filter(a => a.status === 'accepted')
    .reduce((sum, a) => sum + (Number(a.bid) || 0), 0);

  // Filter projects for moderation tab
  const filteredProjects = useMemo(() => {
    if (moderationFilter === 'all') return projects;
    return projects.filter(p => p.status === moderationFilter);
  }, [projects, moderationFilter]);

  return (
    <div id="adminModuleView" className="module-view active">
      {/* Banner */}
      <div className="module-banner" style={{ background: 'linear-gradient(180deg, rgba(244, 63, 94, 0.08) 0%, transparent 100%)' }}>
        <div className="module-banner-inner">
          <div className="module-title-group">
            <h1>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Administrator Control Center
            </h1>
            <p>
              Platform governance, project moderation, role-based user management (RBAC), and platform escrow oversight.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="status-pill status-role-admin">
              🛡️ Super Admin Mode: {currentUser.name}
            </span>
            <button className="btn btn-outline btn-sm" onClick={onNavigateMarketplace}>
              ← Public Marketplace
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => showToast('Platform data refreshed from LocalStorage.', 'info')}>
              ↻ Refresh Data
            </button>
          </div>
        </div>
      </div>

      <div className="module-container">
        {/* KPI Dashboard Summary */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-info">
              <span className="kpi-label">Registered Users</span>
              <h2 className="kpi-value">{totalUsers}</h2>
            </div>
            <div className="kpi-icon-wrap kpi-icon-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-info">
              <span className="kpi-label">Total Projects</span>
              <h2 className="kpi-value">{totalProjects}</h2>
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
              <span className="kpi-label">Pending Moderation</span>
              <h2 className="kpi-value" style={{ color: 'var(--accent-amber)' }}>{pendingApprovals}</h2>
            </div>
            <div className="kpi-icon-wrap kpi-icon-amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 14 14"></polyline>
              </svg>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-info">
              <span className="kpi-label">Escrow Volume</span>
              <h2 className="kpi-value" style={{ color: 'var(--accent-emerald)' }}>₹{escrowVolume.toLocaleString()}</h2>
            </div>
            <div className="kpi-icon-wrap kpi-icon-emerald">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
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
            ⚖️ Project Moderation <span className="tab-badge">{projects.length}</span>
          </button>
          <button
            className={`module-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 User Directory & RBAC <span className="tab-badge">{users.length}</span>
          </button>
          <button
            className={`module-tab ${activeTab === 'proposals' ? 'active' : ''}`}
            onClick={() => setActiveTab('proposals')}
          >
            📑 Proposals & Escrow Oversight <span className="tab-badge">{applications.length}</span>
          </button>
          <button
            className={`module-tab ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            📜 System Audit Logs <span className="tab-badge">{auditLogs.length}</span>
          </button>
        </div>

        {/* TAB 1: PROJECT MODERATION */}
        {activeTab === 'projects' && (
          <div className="admin-tab-pane">
            <div className="data-card">
              <div className="data-card-header">
                <div>
                  <h3>Project Approval & Governance</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Approve or reject newly submitted client projects before or after they appear on the public marketplace.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    className="filter-select"
                    value={moderationFilter}
                    onChange={(e) => setModerationFilter(e.target.value)}
                  >
                    <option value="all">All Moderation States</option>
                    <option value="pending">Pending Approval</option>
                    <option value="approved">Approved / Live</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Project Title</th>
                      <th>Client / Employer</th>
                      <th>Category</th>
                      <th>Budget</th>
                      <th>Status</th>
                      <th>Governance Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                          No projects found for the selected moderation state.
                        </td>
                      </tr>
                    ) : (
                      filteredProjects.map(proj => (
                        <tr key={proj.id}>
                          <td>
                            <strong style={{ color: 'var(--text-primary)' }}>{proj.title}</strong>
                            {proj.isFeatured && (
                              <span style={{
                                marginLeft: '8px',
                                fontSize: '11px',
                                background: 'rgba(245, 158, 11, 0.2)',
                                color: 'var(--accent-amber)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 700
                              }}>
                                ★ Featured
                              </span>
                            )}
                          </td>
                          <td>{proj.client?.name || 'Verified Client'}</td>
                          <td>{proj.category}</td>
                          <td style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                            ₹{proj.budget.toLocaleString()}
                          </td>
                          <td>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 700,
                              background: proj.status === 'approved'
                                ? 'rgba(16, 185, 129, 0.15)'
                                : (proj.status === 'rejected' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)'),
                              color: proj.status === 'approved'
                                ? 'var(--accent-emerald)'
                                : (proj.status === 'rejected' ? 'var(--accent-rose)' : 'var(--accent-amber)')
                            }}>
                              {proj.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {proj.status !== 'approved' && (
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => onUpdateProjectStatus(proj.id, 'approved')}
                                  style={{ padding: '4px 8px', fontSize: '12px' }}
                                >
                                  Approve
                                </button>
                              )}
                              {proj.status !== 'rejected' && (
                                <button
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => onUpdateProjectStatus(proj.id, 'rejected')}
                                  style={{ padding: '4px 8px', fontSize: '12px' }}
                                >
                                  Reject
                                </button>
                              )}
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => onToggleFeatureProject(proj.id)}
                                style={{ padding: '4px 8px', fontSize: '12px' }}
                              >
                                {proj.isFeatured ? 'Unfeature' : 'Feature'}
                              </button>
                              <button
                                className="btn btn-sm"
                                onClick={() => onDeleteProject(proj.id)}
                                style={{ padding: '4px 8px', fontSize: '12px', background: 'rgba(244, 63, 94, 0.2)', color: 'var(--accent-rose)', border: 'none' }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER DIRECTORY & ACCESS CONTROL (RBAC) */}
        {activeTab === 'users' && (
          <div className="admin-tab-pane">
            <div className="data-card">
              <div className="data-card-header">
                <div>
                  <h3>User Management & Role-Based Access Control (RBAC)</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Manage registered accounts stored in LocalStorage, toggle account suspension, and reassign roles.
                  </p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={onOpenCreateUser}>
                  + Add New User
                </button>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Assigned Role</th>
                      <th>Account Status</th>
                      <th>Joined Date</th>
                      <th>Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => {
                      const isSuspended = u.status === 'Suspended';
                      const isSuperAdmin = u.username === 'prudhvi';

                      return (
                        <tr key={u.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img
                                src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'}
                                alt={u.name}
                                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                              />
                              <div>
                                <strong style={{ color: 'var(--text-primary)' }}>{u.name}</strong>
                                {u.username && (
                                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>@{u.username}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td>
                            <select
                              value={u.role}
                              onChange={(e) => onUpdateUserRole(u.id, e.target.value)}
                              disabled={isSuperAdmin}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--text-primary)',
                                fontSize: '12px'
                              }}
                            >
                              <option value="Freelancer">Freelancer</option>
                              <option value="Client">Client</option>
                              <option value="Admin">Admin</option>
                            </select>
                          </td>
                          <td>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 700,
                              background: isSuspended ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              color: isSuspended ? 'var(--accent-rose)' : 'var(--accent-emerald)'
                            }}>
                              {u.status || 'Active'}
                            </span>
                          </td>
                          <td>{u.joinedDate || '2026-02-01'}</td>
                          <td>
                            {!isSuperAdmin ? (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  className={`btn btn-sm ${isSuspended ? 'btn-primary' : 'btn-secondary'}`}
                                  onClick={() => onUpdateUserStatus(u.id, isSuspended ? 'Active' : 'Suspended')}
                                  style={{ padding: '4px 8px', fontSize: '12px' }}
                                >
                                  {isSuspended ? 'Reactivate' : 'Suspend'}
                                </button>
                                <button
                                  className="btn btn-sm"
                                  onClick={() => onDeleteUser(u.id)}
                                  style={{ padding: '4px 8px', fontSize: '12px', background: 'rgba(244, 63, 94, 0.2)', color: 'var(--accent-rose)', border: 'none' }}
                                >
                                  Delete
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '12px', color: 'var(--accent-rose)', fontWeight: 600 }}>
                                🛡️ Primary Administrator
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROPOSALS & ESCROW OVERSIGHT */}
        {activeTab === 'proposals' && (
          <div className="admin-tab-pane">
            <div className="data-card">
              <div className="data-card-header">
                <div>
                  <h3>Platform Proposals & Escrow Oversight</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Monitor all bids submitted across projects, verified milestone escrows, and platform financial volume.
                  </p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Freelancer Applicant</th>
                      <th>Bid Amount</th>
                      <th>Timeline</th>
                      <th>Proposal Status</th>
                      <th>Escrow State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => {
                      const isAccepted = app.status === 'accepted';
                      return (
                        <tr key={app.id}>
                          <td>
                            <strong style={{ color: 'var(--text-primary)' }}>{app.projectTitle}</strong>
                          </td>
                          <td>
                            <div>{app.freelancerName}</div>
                            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{app.freelancerEmail}</div>
                          </td>
                          <td style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
                            ₹{app.bid.toLocaleString()}
                          </td>
                          <td>{app.timeline}</td>
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
                              {app.escrowState}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="admin-tab-pane">
            <div className="data-card">
              <div className="data-card-header">
                <div>
                  <h3>Real-Time System Audit Log</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Chronological audit trail of user sessions, project creation, moderation events, and escrow states.
                  </p>
                </div>
                <button className="btn btn-outline btn-sm" onClick={onClearAuditLogs}>
                  Clear Log History
                </button>
              </div>

              <div className="audit-list">
                {auditLogs.map(log => (
                  <div key={log.id} className="audit-item" style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--primary-light)',
                      fontFamily: 'monospace',
                      whiteSpace: 'nowrap',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(99, 102, 241, 0.1)'
                    }}>
                      {log.time}
                    </span>
                    <span style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>
                      {log.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

