import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AdminInspectUserModal } from '../../components/modals/AdminInspectUserModal';
import { AdminInspectProjectModal } from '../../components/modals/AdminInspectProjectModal';

export function AdminModule({
  users = [],
  projects = [],
  applications = [],
  auditLogs = [],
  settings = {},
  categories = [],
  onUpdateProjectStatus,
  onToggleFeatureProject,
  onDeleteProject,
  onUpdateUserStatus,
  onUpdateUserRole,
  onDeleteUser,
  onResetUserPassword,
  onOpenCreateUser,
  onClearAuditLogs,
  onUpdateSettings,
  onUpdateCategories,
  onEscrowAction,
  onResetFactoryData,
  onNavigateMarketplace
}) {
  const { currentUser, openAuthModal, demoLogin } = useAuth();
  const { showToast } = useToast();

  // Active Tab state: 'analytics' | 'projects' | 'users' | 'proposals' | 'categories' | 'settings' | 'logs'
  const [activeTab, setActiveTab] = useState('analytics');

  // Filter & Search states
  const [projectSearch, setProjectSearch] = useState('');
  const [moderationFilter, setModerationFilter] = useState('all');

  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');

  const [escrowFilter, setEscrowFilter] = useState('all');

  const [logSearch, setLogSearch] = useState('');
  const [logCategoryFilter, setLogCategoryFilter] = useState('all');

  // Category management state
  const [newCategoryName, setNewCategoryName] = useState('');

  // Simulator state in Analytics
  const [simVolume, setSimVolume] = useState(500000);

  // Inspector modal states
  const [inspectingUser, setInspectingUser] = useState(null);
  const [inspectingProject, setInspectingProject] = useState(null);

  // Route Guard check
  if (!currentUser || currentUser.role !== 'Admin') {
    return (
      <div className="module-view active" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{
          maxWidth: '540px',
          margin: '0 auto',
          background: 'var(--bg-surface-elevated)',
          padding: '40px',
          borderRadius: '16px',
          border: '1px solid var(--accent-rose)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
          <h2 style={{ fontSize: '22px', color: 'var(--accent-rose)', fontWeight: 700 }}>
            Restricted Access: Administrator Privileges Required
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '14px', lineHeight: 1.6 }}>
            The Administrator Control Center is restricted to users with the <strong>Admin</strong> role.
            Sign in with an administrator account or use the 1-click demo access below.
          </p>

          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            fontSize: '13px',
            color: 'var(--text-muted)'
          }}>
            Default Admin Credentials: <code style={{ color: 'var(--accent-emerald)' }}>prudhvi</code> / <code style={{ color: 'var(--accent-emerald)' }}>prudhvi@2408</code>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => demoLogin('admin')}
              style={{ background: 'var(--accent-rose)', borderColor: 'var(--accent-rose)' }}
            >
              🛡️ 1-Click Demo Admin Access
            </button>
            <button className="btn btn-secondary" onClick={() => openAuthModal('signin')}>
              Sign In
            </button>
            <button className="btn btn-outline" onClick={onNavigateMarketplace}>
              Return to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Financial & Metric Computations ---
  const commissionRate = settings.platformFeePercent ?? 10;
  const grossMarketplaceValue = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
  const activeEscrowVolume = applications
    .filter(a => a.status === 'accepted' || a.escrowState === 'Held in Escrow')
    .reduce((sum, a) => sum + (Number(a.bid) || 0), 0);

  const releasedPayouts = applications
    .filter(a => a.escrowState === 'Released to Freelancer')
    .reduce((sum, a) => sum + (Number(a.bid) || 0), 0);

  const platformNetCommission = Math.round((activeEscrowVolume + releasedPayouts) * (commissionRate / 100));
  const avgProjectBudget = projects.length > 0 ? Math.round(grossMarketplaceValue / projects.length) : 0;
  const pendingApprovals = projects.filter(p => p.status === 'pending').length;

  // Demographics breakdown
  const freelancerCount = users.filter(u => u.role === 'Freelancer').length;
  const clientCount = users.filter(u => u.role === 'Client').length;
  const adminCount = users.filter(u => u.role === 'Admin').length;

  // Category breakdown
  const categoryStats = useMemo(() => {
    const map = {};
    categories.forEach(cat => {
      map[cat] = { count: 0, budget: 0 };
    });
    projects.forEach(p => {
      if (!map[p.category]) map[p.category] = { count: 0, budget: 0 };
      map[p.category].count += 1;
      map[p.category].budget += (Number(p.budget) || 0);
    });
    return Object.entries(map).map(([name, data]) => ({
      name,
      count: data.count,
      budget: data.budget,
      percent: projects.length > 0 ? Math.round((data.count / projects.length) * 100) : 0
    })).sort((a, b) => b.budget - a.budget);
  }, [categories, projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (moderationFilter !== 'all' && p.status !== moderationFilter) return false;
      if (projectSearch.trim()) {
        const q = projectSearch.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchClient = p.client?.name?.toLowerCase().includes(q);
        const matchCat = p.category?.toLowerCase().includes(q);
        if (!matchTitle && !matchClient && !matchCat) return false;
      }
      return true;
    });
  }, [projects, moderationFilter, projectSearch]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
      if (userStatusFilter !== 'all' && (u.status || 'Active') !== userStatusFilter) return false;
      if (userSearch.trim()) {
        const q = userSearch.toLowerCase();
        const matchName = u.name.toLowerCase().includes(q);
        const matchEmail = u.email.toLowerCase().includes(q);
        const matchUsername = u.username?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchUsername) return false;
      }
      return true;
    });
  }, [users, userRoleFilter, userStatusFilter, userSearch]);

  // Filtered proposals
  const filteredProposals = useMemo(() => {
    return applications.filter(app => {
      if (escrowFilter === 'all') return true;
      return app.escrowState === escrowFilter;
    });
  }, [applications, escrowFilter]);

  // Filtered audit logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      if (logCategoryFilter !== 'all') {
        const t = log.text.toLowerCase();
        if (logCategoryFilter === 'escrow' && !t.includes('escrow')) return false;
        if (logCategoryFilter === 'projects' && !t.includes('project')) return false;
        if (logCategoryFilter === 'users' && !t.includes('user') && !t.includes('account')) return false;
      }
      if (logSearch.trim()) {
        return log.text.toLowerCase().includes(logSearch.toLowerCase());
      }
      return true;
    });
  }, [auditLogs, logCategoryFilter, logSearch]);

  // Category management handlers
  const handleAddCategory = (e) => {
    e.preventDefault();
    const clean = newCategoryName.trim();
    if (!clean) return;
    if (categories.includes(clean)) {
      showToast('This category already exists.', 'warning');
      return;
    }
    const updated = [...categories, clean];
    onUpdateCategories(updated);
    setNewCategoryName('');
    showToast(`Category "${clean}" successfully added.`, 'success');
  };

  const handleDeleteCategory = (catName) => {
    const usageCount = projects.filter(p => p.category === catName).length;
    if (usageCount > 0) {
      if (!window.confirm(`Category "${catName}" is assigned to ${usageCount} project(s). Delete anyway?`)) {
        return;
      }
    }
    const updated = categories.filter(c => c !== catName);
    onUpdateCategories(updated);
    showToast(`Category "${catName}" removed.`, 'info');
  };

  // Data Export Handlers
  const handleExportJSON = () => {
    const backup = {
      exportTimestamp: new Date().toISOString(),
      platform: "FreelanceHub",
      users,
      projects,
      applications,
      auditLogs,
      settings,
      categories
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freelancehub-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Platform snapshot backup downloaded (JSON)!', 'success');
  };

  const handleExportProjectsCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'Budget', 'Client', 'Status', 'ProposalsCount', 'Featured'];
    const rows = projects.map(p => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.category,
      p.budget,
      `"${p.client?.name || 'Client'}"`,
      p.status || 'approved',
      p.proposalsCount || 0,
      p.isFeatured ? 'Yes' : 'No'
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freelancehub-projects-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Projects CSV exported!', 'success');
  };

  const handleExportUsersCSV = () => {
    const headers = ['ID', 'Name', 'Username', 'Email', 'Role', 'Status', 'JoinedDate'];
    const rows = users.map(u => [
      u.id,
      `"${u.name.replace(/"/g, '""')}"`,
      u.username || '',
      u.email,
      u.role,
      u.status || 'Active',
      u.joinedDate || ''
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freelancehub-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Users directory CSV exported!', 'success');
  };

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
              Platform governance, financial analytics, escrow dispute adjudication, RBAC access control, and platform settings.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="status-pill status-role-admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              🛡️ Super Admin: {currentUser.name}
            </span>
            <button className="btn btn-outline btn-sm" onClick={onNavigateMarketplace}>
              ← Public Marketplace
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleExportJSON} title="Download Complete JSON Backup">
              📥 Backup JSON
            </button>
          </div>
        </div>
      </div>

      <div className="module-container">
        {/* Top KPI Stat Grid */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-info">
              <span className="kpi-label">Marketplace Value</span>
              <h2 className="kpi-value" style={{ color: 'var(--primary-light)' }}>₹{grossMarketplaceValue.toLocaleString()}</h2>
            </div>
            <div className="kpi-icon-wrap kpi-icon-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-info">
              <span className="kpi-label">Active Escrow Volume</span>
              <h2 className="kpi-value" style={{ color: 'var(--accent-emerald)' }}>₹{activeEscrowVolume.toLocaleString()}</h2>
            </div>
            <div className="kpi-icon-wrap kpi-icon-emerald">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-info">
              <span className="kpi-label">Net Commission ({commissionRate}%)</span>
              <h2 className="kpi-value" style={{ color: '#c084fc' }}>₹{platformNetCommission.toLocaleString()}</h2>
            </div>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
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
        </div>

        {/* Navigation Tabs (7 Comprehensive Features) */}
        <div className="module-tabs" style={{ flexWrap: 'wrap', gap: '8px' }}>
          <button
            className={`module-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Financials & Analytics
          </button>
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
            📑 Escrow & Proposals <span className="tab-badge">{applications.length}</span>
          </button>
          <button
            className={`module-tab ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            🏷️ Categories & Taxonomies <span className="tab-badge">{categories.length}</span>
          </button>
          <button
            className={`module-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ System Settings
          </button>
          <button
            className={`module-tab ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            📜 Audit Trail <span className="tab-badge">{auditLogs.length}</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: FINANCIALS & MARKETPLACE ANALYTICS
           ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="admin-tab-pane">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              {/* Category Market Share Chart */}
              <div className="data-card">
                <div className="data-card-header">
                  <div>
                    <h3>Market Share by Category</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Distribution of projects and capital across domain sectors</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {categoryStats.map(cat => (
                    <div key={cat.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                        <span style={{ fontWeight: 600 }}>{cat.name} ({cat.count} projects)</span>
                        <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>₹{cat.budget.toLocaleString()} ({cat.percent}%)</span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        background: 'rgba(255,255,255,0.06)',
                        borderRadius: '999px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${Math.max(cat.percent, 3)}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                          borderRadius: '999px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Escrow Pipeline & Demographics */}
              <div className="data-card">
                <div className="data-card-header">
                  <div>
                    <h3>Escrow Velocity & Status</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Milestone custody lifecycle and funds settlement</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '24px' }}>
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Held in Escrow</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--secondary)', marginTop: '4px' }}>
                      ₹{activeEscrowVolume.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Released to Freelancers</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '4px' }}>
                      ₹{releasedPayouts.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="data-card-header" style={{ marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', margin: 0 }}>User Community Breakdown</h4>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', height: '28px', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
                  <div style={{
                    width: `${users.length > 0 ? (freelancerCount / users.length) * 100 : 50}%`,
                    background: '#6366f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#fff'
                  }} title={`Freelancers: ${freelancerCount}`}>
                    {freelancerCount} Freelancers
                  </div>
                  <div style={{
                    width: `${users.length > 0 ? (clientCount / users.length) * 100 : 40}%`,
                    background: '#06b6d4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#fff'
                  }} title={`Clients: ${clientCount}`}>
                    {clientCount} Clients
                  </div>
                  <div style={{
                    width: `${users.length > 0 ? (adminCount / users.length) * 100 : 10}%`,
                    background: '#f43f5e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#fff'
                  }} title={`Admins: ${adminCount}`}>
                    {adminCount}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>🔵 Freelancers: {freelancerCount}</span>
                  <span>🟢 Clients: {clientCount}</span>
                  <span>🔴 Administrators: {adminCount}</span>
                </div>
              </div>
            </div>

            {/* Revenue Simulator Card */}
            <div className="data-card">
              <div className="data-card-header">
                <div>
                  <h3>Interactive Platform Revenue Simulator</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Simulate monthly platform fee earnings based on marketplace gross transaction volume.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600 }}>
                    Target Monthly Transaction Volume: <span style={{ color: 'var(--accent-emerald)', fontWeight: 800 }}>₹{simVolume.toLocaleString()}</span>
                  </label>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Current Platform Commission Rate: <strong>{commissionRate}%</strong>
                  </div>
                </div>

                <input
                  type="range"
                  min="50000"
                  max="5000000"
                  step="25000"
                  value={simVolume}
                  onChange={(e) => setSimVolume(Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary)' }}
                />

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '14px',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Gross Volume</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>₹{simVolume.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Projected Platform Net Commission</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '2px' }}>
                      ₹{Math.round(simVolume * (commissionRate / 100)).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Net Freelancer Disbursals</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--secondary)', marginTop: '2px' }}>
                      ₹{Math.round(simVolume * (1 - (commissionRate / 100))).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: PROJECT MODERATION & GOVERNANCE
           ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="admin-tab-pane">
            <div className="data-card">
              <div className="data-card-header">
                <div>
                  <h3>Project Moderation & Catalog Governance</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Review, approve, or reject client job submissions before or after they become visible on the public marketplace.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Search by title, client, category..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      width: '230px'
                    }}
                  />

                  <select
                    className="filter-select"
                    value={moderationFilter}
                    onChange={(e) => setModerationFilter(e.target.value)}
                  >
                    <option value="all">All Moderation States</option>
                    <option value="pending">Pending Approval</option>
                    <option value="approved">Approved / Live</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <button className="btn btn-outline btn-sm" onClick={handleExportProjectsCSV}>
                    📥 Export CSV
                  </button>
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
                      <th>Actions & Governance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                          No projects matched the selected filters.
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
                              background: (proj.status === 'approved' || proj.status === 'in_progress' || proj.status === 'completed')
                                ? 'rgba(16, 185, 129, 0.15)'
                                : (proj.status === 'rejected' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)'),
                              color: (proj.status === 'approved' || proj.status === 'in_progress' || proj.status === 'completed')
                                ? 'var(--accent-emerald)'
                                : (proj.status === 'rejected' ? 'var(--accent-rose)' : 'var(--accent-amber)')
                            }}>
                              {(proj.status || 'approved').toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => setInspectingProject(proj)}
                                style={{ padding: '4px 8px', fontSize: '12px' }}
                                title="Inspect project details"
                              >
                                👁️ Details
                              </button>

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
                                onClick={() => {
                                  if (window.confirm(`Delete project "${proj.title}"?`)) {
                                    onDeleteProject(proj.id);
                                  }
                                }}
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

        {/* =========================================================================
            TAB 3: USER DIRECTORY & ACCESS CONTROL (RBAC)
           ========================================================================= */}
        {activeTab === 'users' && (
          <div className="admin-tab-pane">
            <div className="data-card">
              <div className="data-card-header">
                <div>
                  <h3>User Management & Role-Based Access Control (RBAC)</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Inspect user activity, reassign roles, toggle account suspension, and reset user credentials.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Search by name, email, username..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      width: '230px'
                    }}
                  />

                  <select
                    className="filter-select"
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="Freelancer">Freelancers</option>
                    <option value="Client">Clients</option>
                    <option value="Admin">Administrators</option>
                  </select>

                  <select
                    className="filter-select"
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                  >
                    <option value="all">All Account States</option>
                    <option value="Active">Active Only</option>
                    <option value="Suspended">Suspended Only</option>
                  </select>

                  <button className="btn btn-outline btn-sm" onClick={handleExportUsersCSV}>
                    📥 Export CSV
                  </button>

                  <button className="btn btn-primary btn-sm" onClick={onOpenCreateUser}>
                    + Add New User
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role Assignment</th>
                      <th>Account Status</th>
                      <th>Joined Date</th>
                      <th>Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => {
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
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => setInspectingUser(u)}
                                style={{ padding: '4px 8px', fontSize: '12px' }}
                                title="Inspect user profile and transaction history"
                              >
                                🔍 Inspect
                              </button>

                              {!isSuperAdmin ? (
                                <>
                                  <button
                                    className={`btn btn-sm ${isSuspended ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => onUpdateUserStatus(u.id, isSuspended ? 'Active' : 'Suspended')}
                                    style={{ padding: '4px 8px', fontSize: '12px' }}
                                  >
                                    {isSuspended ? 'Reactivate' : 'Suspend'}
                                  </button>
                                  <button
                                    className="btn btn-sm"
                                    onClick={() => {
                                      if (window.confirm(`Delete user "${u.name}"?`)) {
                                        onDeleteUser(u.id);
                                      }
                                    }}
                                    style={{ padding: '4px 8px', fontSize: '12px', background: 'rgba(244, 63, 94, 0.2)', color: 'var(--accent-rose)', border: 'none' }}
                                  >
                                    Delete
                                  </button>
                                </>
                              ) : (
                                <span style={{ fontSize: '12px', color: 'var(--accent-rose)', fontWeight: 600, padding: '4px 6px' }}>
                                  🛡️ Super Admin
                                </span>
                              )}
                            </div>
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

        {/* =========================================================================
            TAB 4: PROPOSALS & ESCROW DISPUTE OVERSIGHT
           ========================================================================= */}
        {activeTab === 'proposals' && (
          <div className="admin-tab-pane">
            <div className="data-card">
              <div className="data-card-header">
                <div>
                  <h3>Escrow Dispute Adjudication & Financial Oversight</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Oversee all project milestone funds held in custody. Administrators can release funds to freelancers, issue refunds to clients, or arbitrate disputes.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select
                    className="filter-select"
                    value={escrowFilter}
                    onChange={(e) => setEscrowFilter(e.target.value)}
                  >
                    <option value="all">All Escrow States</option>
                    <option value="Held in Escrow">Held in Escrow</option>
                    <option value="Released to Freelancer">Released to Freelancer</option>
                    <option value="Refunded to Client">Refunded to Client</option>
                    <option value="Under Dispute">Under Dispute</option>
                    <option value="Pending Escrow">Pending Escrow</option>
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Freelancer</th>
                      <th>Bid Amount</th>
                      <th>Timeline</th>
                      <th>Proposal Status</th>
                      <th>Escrow State</th>
                      <th>Admin Escrow Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProposals.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                          No proposals matched the selected filter.
                        </td>
                      </tr>
                    ) : (
                      filteredProposals.map(app => {
                        const isHeld = app.escrowState === 'Held in Escrow';
                        const isDispute = app.escrowState === 'Under Dispute';

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
                                background: app.status === 'accepted' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                color: app.status === 'accepted' ? 'var(--accent-emerald)' : 'var(--accent-amber)'
                              }}>
                                {app.status === 'accepted' ? 'Accepted' : 'Pending'}
                              </span>
                            </td>
                            <td>
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 600,
                                background: isHeld ? 'rgba(6, 182, 212, 0.15)' : (isDispute ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)'),
                                color: isHeld ? 'var(--secondary)' : (isDispute ? 'var(--accent-rose)' : 'var(--text-muted)')
                              }}>
                                {app.escrowState || 'Pending Escrow'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {(isHeld || isDispute) && (
                                  <>
                                    <button
                                      className="btn btn-primary btn-sm"
                                      onClick={() => onEscrowAction(app.id, 'Released to Freelancer', 'completed')}
                                      style={{ padding: '3px 8px', fontSize: '11.5px', background: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)' }}
                                      title="Release payment to freelancer"
                                    >
                                      💰 Release
                                    </button>

                                    <button
                                      className="btn btn-secondary btn-sm"
                                      onClick={() => onEscrowAction(app.id, 'Refunded to Client', 'cancelled')}
                                      style={{ padding: '3px 8px', fontSize: '11.5px' }}
                                      title="Refund escrow back to employer"
                                    >
                                      ↩️ Refund
                                    </button>
                                  </>
                                )}

                                {isHeld && (
                                  <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => onEscrowAction(app.id, 'Under Dispute')}
                                    style={{ padding: '3px 8px', fontSize: '11.5px', color: 'var(--accent-rose)' }}
                                    title="Flag escrow as disputed"
                                  >
                                    ⚖️ Flag Dispute
                                  </button>
                                )}

                                {isDispute && (
                                  <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => onEscrowAction(app.id, 'Settled (50/50 Split)', 'completed')}
                                    style={{ padding: '3px 8px', fontSize: '11.5px', color: 'var(--accent-amber)' }}
                                    title="Arbitrate dispute with 50/50 split"
                                  >
                                    🤝 Settle 50/50
                                  </button>
                                )}

                                {!isHeld && !isDispute && (
                                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                                    No active custody
                                  </span>
                                )}
                              </div>
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

        {/* =========================================================================
            TAB 5: CATEGORIES & TAXONOMY MANAGER
           ========================================================================= */}
        {activeTab === 'categories' && (
          <div className="admin-tab-pane">
            <div className="data-card">
              <div className="data-card-header">
                <div>
                  <h3>Category & Skill Taxonomy Governance</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Configure the official project and talent domain categories. Changes persist across client posting and search filters.
                  </p>
                </div>
              </div>

              {/* Add Category Input */}
              <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '10px', marginBottom: '24px', maxWidth: '480px' }}>
                <input
                  type="text"
                  placeholder="Enter new category (e.g. Blockchain & Web3)..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px'
                  }}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  + Add Category
                </button>
              </form>

              {/* Category Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
                {categories.map(cat => {
                  const count = projects.filter(p => p.category === cat).length;
                  return (
                    <div key={cat} style={{
                      padding: '16px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{cat}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {count} {count === 1 ? 'Project Listed' : 'Projects Listed'}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        style={{
                          background: 'rgba(244, 63, 94, 0.1)',
                          border: 'none',
                          color: 'var(--accent-rose)',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                        title="Delete category"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: SYSTEM SETTINGS & PLATFORM GOVERNANCE
           ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="admin-tab-pane">
            <div className="data-card">
              <div className="data-card-header">
                <div>
                  <h3>Platform Configuration & Operating Policies</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Adjust monetization rates, automated moderation policies, maintenance status, and data backups.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* 1. Platform Fee Slider */}
                <div style={{
                  padding: '18px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '15px' }}>Platform Commission Fee Rate</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        Percentage deducted from milestone escrow releases upon project completion.
                      </div>
                    </div>
                    <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary-light)' }}>
                      {settings.platformFeePercent ?? 10}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={settings.platformFeePercent ?? 10}
                    onChange={(e) => onUpdateSettings({ ...settings, platformFeePercent: Number(e.target.value) })}
                    style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>0% (Free Marketplace)</span>
                    <span>10% (Recommended)</span>
                    <span>30% (Enterprise Premium)</span>
                  </div>
                </div>

                {/* 2. Auto-Approval Toggle */}
                <div style={{
                  padding: '18px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>Instant Project Auto-Approval</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      When enabled, newly posted client projects immediately appear live on the marketplace. When disabled, projects require admin review.
                    </div>
                  </div>

                  <button
                    onClick={() => onUpdateSettings({ ...settings, autoApproveProjects: !settings.autoApproveProjects })}
                    className={`btn btn-sm ${settings.autoApproveProjects ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {settings.autoApproveProjects ? '✓ Enabled (Auto-Live)' : '⚠️ Disabled (Requires Review)'}
                  </button>
                </div>

                {/* 3. User Registration Gate */}
                <div style={{
                  padding: '18px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>Public User Registration</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Allow new clients and freelancers to register accounts via the signup portal.
                    </div>
                  </div>

                  <button
                    onClick={() => onUpdateSettings({ ...settings, allowNewRegistrations: !settings.allowNewRegistrations })}
                    className={`btn btn-sm ${settings.allowNewRegistrations ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {settings.allowNewRegistrations ? '✓ Open Registration' : '🔒 Closed (Admin Only)'}
                  </button>
                </div>

                {/* 4. Maintenance Mode Banner */}
                <div style={{
                  padding: '18px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>Platform Maintenance Notice</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Display an active maintenance banner across all marketplace pages to notify visitors of scheduled maintenance.
                    </div>
                  </div>

                  <button
                    onClick={() => onUpdateSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                    className={`btn btn-sm ${settings.maintenanceMode ? 'btn-secondary' : 'btn-outline'}`}
                    style={settings.maintenanceMode ? { background: 'var(--accent-amber)', color: '#000' } : {}}
                  >
                    {settings.maintenanceMode ? '⚠️ Notice Active' : 'Normal Operation'}
                  </button>
                </div>

                {/* 5. Data Backup & Reset */}
                <div style={{
                  padding: '18px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>System Data Backup & Factory Reset</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Export complete database records for cold storage or reset the demonstration state to factory defaults.
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button className="btn btn-secondary btn-sm" onClick={handleExportJSON}>
                      📥 Export Full Backup (JSON)
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={handleExportProjectsCSV}>
                      📥 Export Projects (CSV)
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={handleExportUsersCSV}>
                      📥 Export Users (CSV)
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => {
                        if (window.confirm('⚠️ Reset all users, projects, and proposals back to pristine demo seeds? This will refresh your storage.')) {
                          onResetFactoryData();
                        }
                      }}
                      style={{ background: 'rgba(244, 63, 94, 0.2)', color: 'var(--accent-rose)', border: 'none' }}
                    >
                      ⚠️ Factory Reset Platform Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: REAL-TIME AUDIT LOGS
           ========================================================================= */}
        {activeTab === 'logs' && (
          <div className="admin-tab-pane">
            <div className="data-card">
              <div className="data-card-header">
                <div>
                  <h3>Real-Time System Audit Trail</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Tamper-evident chronological audit records of authentication sessions, project lifecycle events, and escrow transactions.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Search logs by keyword..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      width: '210px'
                    }}
                  />

                  <select
                    className="filter-select"
                    value={logCategoryFilter}
                    onChange={(e) => setLogCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Event Categories</option>
                    <option value="escrow">Escrow & Bids</option>
                    <option value="projects">Project Events</option>
                    <option value="users">User Governance</option>
                  </select>

                  <button className="btn btn-outline btn-sm" onClick={onClearAuditLogs}>
                    Clear Log History
                  </button>
                </div>
              </div>

              <div className="audit-list">
                {filteredLogs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No audit records matching your search criteria.
                  </div>
                ) : (
                  filteredLogs.map(log => (
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
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INSPECTOR MODALS */}
      <AdminInspectUserModal
        user={inspectingUser}
        isOpen={Boolean(inspectingUser)}
        onClose={() => setInspectingUser(null)}
        projects={projects}
        applications={applications}
        onUpdateUserStatus={onUpdateUserStatus}
        onResetPassword={onResetUserPassword}
      />

      <AdminInspectProjectModal
        project={inspectingProject}
        isOpen={Boolean(inspectingProject)}
        onClose={() => setInspectingProject(null)}
        onUpdateProjectStatus={onUpdateProjectStatus}
        onToggleFeatureProject={onToggleFeatureProject}
        onDeleteProject={onDeleteProject}
      />
    </div>
  );
}
export default AdminModule;
