import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import {
  initLocalStorage,
  getStoredProjects,
  saveStoredProjects,
  getStoredApplications,
  saveStoredApplications,
  getStoredBookmarks,
  saveStoredBookmarks,
  getStoredUsers,
  saveStoredUsers,
  getStoredLogs,
  addAuditLog,
  clearAuditLogsStorage,
  getStoredTheme,
  saveStoredTheme,
  getStoredSettings,
  saveStoredSettings,
  getStoredCategories,
  saveStoredCategories,
  resetAllToFactorySeeds
} from './data/storage';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Modals
import { AuthModal } from './components/modals/AuthModal';
import { ApplyModal } from './components/modals/ApplyModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { ClientProposalsModal } from './components/modals/ClientProposalsModal';
import { AdminUserModal } from './components/modals/AdminUserModal';

// Modules
import { LandingModule } from './modules/landing/LandingModule';
import { MarketplaceModule } from './modules/marketplace/MarketplaceModule';
import { UserModule } from './modules/user/UserModule';
import { AdminModule } from './modules/admin/AdminModule';

export function App() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  // Navigation & Theme
  const [activeModule, setActiveModule] = useState('landing'); // 'landing' | 'marketplace' | 'user' | 'admin'
  const [theme, setTheme] = useState('dark');

  // Stored state
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [settings, setSettings] = useState({});
  const [categories, setCategories] = useState([]);

  // Modals state
  const [applyModalProject, setApplyModalProject] = useState(null);
  const [profileModalFreelancer, setProfileModalFreelancer] = useState(null);
  const [clientViewingProject, setClientViewingProject] = useState(null);
  const [adminUserModalOpen, setAdminUserModalOpen] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    initLocalStorage();

    const storedTheme = getStoredTheme();
    setTheme(storedTheme);
    document.documentElement.setAttribute('data-theme', storedTheme);

    setProjects(getStoredProjects());
    setApplications(getStoredApplications());
    setBookmarks(getStoredBookmarks());
    setUsers(getStoredUsers());
    setAuditLogs(getStoredLogs());
    setSettings(getStoredSettings());
    setCategories(getStoredCategories());
  }, []);

  // Sync body class for landing module vs marketplace/user/admin
  useEffect(() => {
    if (activeModule === 'landing') {
      document.body.className = 'view-landing';
    } else {
      document.body.className = 'view-app';
    }
  }, [activeModule]);

  // Update theme
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    saveStoredTheme(nextTheme);
    showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} theme.`, 'info');
  };

  // Login callback for intelligent redirection
  const handleLoginSuccess = (user) => {
    if (user.role === 'Admin') {
      setActiveModule('admin');
      showToast('🛡️ Redirected to Administrator Control Center.', 'info');
    } else {
      setActiveModule('user');
      showToast(`Redirected to ${user.role} Workspace.`, 'info');
    }
  };

  // Toggle bookmark
  const handleToggleBookmark = (projectId) => {
    let updated;
    if (bookmarks.includes(projectId)) {
      updated = bookmarks.filter(id => id !== projectId);
      showToast('Project removed from saved bookmarks.', 'info');
    } else {
      updated = [...bookmarks, projectId];
      showToast('Project saved to your bookmarks!', 'success');
    }
    setBookmarks(updated);
    saveStoredBookmarks(updated);
  };

  // Create project
  const handleProjectCreated = (newProject) => {
    const updated = [newProject, ...projects];
    setProjects(updated);
    saveStoredProjects(updated);
    const logs = addAuditLog(`Client "${newProject.client?.name}" posted project: "${newProject.title}" (₹${newProject.budget.toLocaleString()}).`);
    setAuditLogs(logs);
  };

  // Submit proposal
  const handleSubmitProposal = (newApp) => {
    const updatedApps = [newApp, ...applications];
    setApplications(updatedApps);
    saveStoredApplications(updatedApps);

    // Increase proposalsCount on the project
    const updatedProjects = projects.map(p => {
      if (p.id === newApp.projectId) {
        return { ...p, proposalsCount: (p.proposalsCount || 0) + 1 };
      }
      return p;
    });
    setProjects(updatedProjects);
    saveStoredProjects(updatedProjects);

    const logs = addAuditLog(`${newApp.freelancerName} submitted a proposal for "${newApp.projectTitle}" (₹${newApp.bid.toLocaleString()}).`);
    setAuditLogs(logs);
  };

  // Accept proposal & escrow allocation
  const handleAcceptProposal = (proposal) => {
    const updatedApps = applications.map(a => {
      if (a.id === proposal.id) {
        return { ...a, status: 'accepted', escrowState: 'Held in Escrow' };
      }
      return a;
    });
    setApplications(updatedApps);
    saveStoredApplications(updatedApps);

    // Mark project as in_progress
    const updatedProjects = projects.map(p => {
      if (p.id === proposal.projectId) {
        return { ...p, status: 'in_progress' };
      }
      return p;
    });
    setProjects(updatedProjects);
    saveStoredProjects(updatedProjects);

    const logs = addAuditLog(`Proposal accepted from ${proposal.freelancerName} for ₹${proposal.bid.toLocaleString()} (Funds held in Escrow).`);
    setAuditLogs(logs);
  };

  // Admin: Update project moderation status
  const handleUpdateProjectStatus = (projectId, status) => {
    const updated = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, status };
      }
      return p;
    });
    setProjects(updated);
    saveStoredProjects(updated);
    const logs = addAuditLog(`Admin updated status of project "${projectId}" to "${status}".`);
    setAuditLogs(logs);
    showToast(`Project status changed to ${status}.`, 'success');
  };

  // Admin: Toggle featured
  const handleToggleFeatureProject = (projectId) => {
    const updated = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, isFeatured: !p.isFeatured };
      }
      return p;
    });
    setProjects(updated);
    saveStoredProjects(updated);
    showToast('Project featured status updated.', 'info');
  };

  // Admin: Delete project
  const handleDeleteProject = (projectId) => {
    const target = projects.find(p => p.id === projectId);
    const updated = projects.filter(p => p.id !== projectId);
    setProjects(updated);
    saveStoredProjects(updated);

    // Clean up associated applications and bookmarks
    const updatedApps = applications.filter(a => a.projectId !== projectId);
    setApplications(updatedApps);
    saveStoredApplications(updatedApps);

    const updatedBookmarks = bookmarks.filter(id => id !== projectId);
    setBookmarks(updatedBookmarks);
    saveStoredBookmarks(updatedBookmarks);

    const logs = addAuditLog(`Admin deleted project: "${target?.title || projectId}".`);
    setAuditLogs(logs);
    showToast('Project deleted successfully.', 'success');
  };

  // Admin: User status
  const handleUpdateUserStatus = (userId, status) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, status };
      }
      return u;
    });
    setUsers(updated);
    saveStoredUsers(updated);
    const logs = addAuditLog(`Admin changed user status for ${userId} to "${status}".`);
    setAuditLogs(logs);
    showToast(`User status updated to ${status}.`, 'info');
  };

  // Admin: User role
  const handleUpdateUserRole = (userId, newRole) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, role: newRole };
      }
      return u;
    });
    setUsers(updated);
    saveStoredUsers(updated);
    const logs = addAuditLog(`Admin reassigned role of user ${userId} to "${newRole}".`);
    setAuditLogs(logs);
    showToast(`User role updated to ${newRole}.`, 'success');
  };

  // Admin: Delete user
  const handleDeleteUser = (userId) => {
    const target = users.find(u => u.id === userId);
    if (target?.username === 'prudhvi') {
      showToast('Cannot delete the primary platform Super Administrator account.', 'error');
      return;
    }
    const updated = users.filter(u => u.id !== userId);
    setUsers(updated);
    saveStoredUsers(updated);
    const logs = addAuditLog(`Admin deleted user account: "${target?.name || userId}".`);
    setAuditLogs(logs);
    showToast('User account removed.', 'success');
  };

  // Admin: Create user
  const handleAdminCreateUser = (newUser) => {
    const updated = [...users, newUser];
    setUsers(updated);
    saveStoredUsers(updated);
    const logs = addAuditLog(`Admin created new user account: "${newUser.name}" (${newUser.role}).`);
    setAuditLogs(logs);
  };

  // Admin: Clear audit logs
  const handleClearAuditLogs = () => {
    const logs = clearAuditLogsStorage();
    setAuditLogs(logs);
    showToast('Audit logs history cleared.', 'info');
  };

  // Admin: Update settings
  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
    const logs = addAuditLog('Admin updated platform configuration settings.');
    setAuditLogs(logs);
    showToast('Platform settings updated successfully.', 'success');
  };

  // Admin: Update categories
  const handleUpdateCategories = (newCategories) => {
    setCategories(newCategories);
    saveStoredCategories(newCategories);
    const logs = addAuditLog(`Admin updated platform taxonomy categories (Total: ${newCategories.length}).`);
    setAuditLogs(logs);
  };

  // Admin: Escrow Arbitrations & Actions
  const handleEscrowAction = (appId, newEscrowState, newProjectStatus) => {
    const targetApp = applications.find(a => a.id === appId);
    const updatedApps = applications.map(a => {
      if (a.id === appId) {
        return { ...a, escrowState: newEscrowState };
      }
      return a;
    });
    setApplications(updatedApps);
    saveStoredApplications(updatedApps);

    if (newProjectStatus && targetApp) {
      const updatedProjects = projects.map(p => {
        if (p.id === targetApp.projectId) {
          return { ...p, status: newProjectStatus };
        }
        return p;
      });
      setProjects(updatedProjects);
      saveStoredProjects(updatedProjects);
    }

    const logs = addAuditLog(`Admin arbitrated escrow for "${targetApp?.projectTitle || appId}": Set state to "${newEscrowState}".`);
    setAuditLogs(logs);
    showToast(`Escrow status updated: ${newEscrowState}.`, 'success');
  };

  // Admin: Reset user password
  const handleResetUserPassword = (userId, newPassword) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, password: newPassword };
      }
      return u;
    });
    setUsers(updated);
    saveStoredUsers(updated);
    const target = users.find(u => u.id === userId);
    const logs = addAuditLog(`Admin reset password for user: "${target?.name || userId}".`);
    setAuditLogs(logs);
    showToast(`Password updated for ${target?.name || 'user'}.`, 'success');
  };

  // Admin: Reset Platform to Factory Seeds
  const handleResetFactoryData = () => {
    const factory = resetAllToFactorySeeds();
    setUsers(factory.users);
    setProjects(factory.projects);
    setApplications(factory.applications);
    setBookmarks(factory.bookmarks);
    setAuditLogs(factory.logs);
    setSettings(factory.settings);
    setCategories(factory.categories);
    showToast('Platform database successfully reset to factory demo seeds.', 'success');
  };

  return (
    <div className={`app-container ${activeModule === 'landing' ? 'view-landing' : ''}`}>
      {/* Maintenance Mode Warning Banner */}
      {settings.maintenanceMode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(90deg, #f59e0b, #d97706)',
          color: '#000000',
          padding: '6px 16px',
          textAlign: 'center',
          fontSize: '12.5px',
          fontWeight: 700,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          <span>⚠️</span>
          <span>SYSTEM NOTICE: FreelanceHub is currently in Administrator Maintenance Mode. Some actions may be restricted.</span>
        </div>
      )}

      {/* Exact Full-Viewport Cover Video Behind All UI / All Interfaces */}
      <div className="bg">
        <video className="bg-video" autoPlay muted loop playsInline>
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Global Navigation Bar */}
      <Navbar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* MODULE ROUTING */}
      {activeModule === 'landing' && (
        <LandingModule onGetStarted={() => setActiveModule('marketplace')} />
      )}

      {activeModule === 'marketplace' && (
        <MarketplaceModule
          projects={projects}
          bookmarks={bookmarks}
          categories={categories}
          settings={settings}
          onToggleBookmark={handleToggleBookmark}
          onOpenApply={(proj) => setApplyModalProject(proj)}
          onOpenProfile={(free) => setProfileModalFreelancer(free)}
          onProjectCreated={handleProjectCreated}
        />
      )}

      {activeModule === 'user' && (
        <UserModule
          projects={projects}
          applications={applications}
          bookmarks={bookmarks}
          onOpenClientProposals={(proj) => setClientViewingProject(proj)}
          onOpenApply={(proj) => setApplyModalProject(proj)}
          onToggleBookmark={handleToggleBookmark}
          onNavigateMarketplace={() => setActiveModule('marketplace')}
        />
      )}

      {activeModule === 'admin' && (
        <AdminModule
          users={users}
          projects={projects}
          applications={applications}
          auditLogs={auditLogs}
          settings={settings}
          categories={categories}
          onUpdateProjectStatus={handleUpdateProjectStatus}
          onToggleFeatureProject={handleToggleFeatureProject}
          onDeleteProject={handleDeleteProject}
          onUpdateUserStatus={handleUpdateUserStatus}
          onUpdateUserRole={handleUpdateUserRole}
          onDeleteUser={handleDeleteUser}
          onResetUserPassword={handleResetUserPassword}
          onOpenCreateUser={() => setAdminUserModalOpen(true)}
          onClearAuditLogs={handleClearAuditLogs}
          onUpdateSettings={handleUpdateSettings}
          onUpdateCategories={handleUpdateCategories}
          onEscrowAction={handleEscrowAction}
          onResetFactoryData={handleResetFactoryData}
          onNavigateMarketplace={() => setActiveModule('marketplace')}
        />
      )}

      {/* Global Footer (shown on all modules except landing) */}
      {activeModule !== 'landing' && (
        <Footer onNavigateMarketplace={() => setActiveModule('marketplace')} />
      )}

      {/* MODALS */}
      <AuthModal onLoginSuccess={handleLoginSuccess} />

      <ApplyModal
        project={applyModalProject}
        isOpen={Boolean(applyModalProject)}
        onClose={() => setApplyModalProject(null)}
        onSubmitProposal={handleSubmitProposal}
      />

      <ProfileModal
        freelancer={profileModalFreelancer}
        isOpen={Boolean(profileModalFreelancer)}
        onClose={() => setProfileModalFreelancer(null)}
      />

      <ClientProposalsModal
        project={clientViewingProject}
        proposals={applications}
        isOpen={Boolean(clientViewingProject)}
        onClose={() => setClientViewingProject(null)}
        onAcceptProposal={handleAcceptProposal}
      />

      <AdminUserModal
        isOpen={adminUserModalOpen}
        onClose={() => setAdminUserModalOpen(false)}
        onCreateUser={handleAdminCreateUser}
      />
    </div>
  );
}
export default App;
