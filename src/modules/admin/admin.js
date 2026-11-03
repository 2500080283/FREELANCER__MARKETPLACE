/**
 * Admin Module Controller & Business Logic
 * Dedicated module service for platform governance, RBAC, escrow dispute resolution,
 * financial analytics, project moderation, and platform settings.
 */

import {
  getStoredProjects,
  saveStoredProjects,
  getStoredUsers,
  saveStoredUsers,
  getStoredApplications,
  saveStoredApplications,
  getStoredSettings,
  saveStoredSettings,
  getStoredCategories,
  saveStoredCategories,
  getStoredLogs,
  addAuditLog,
  clearAuditLogsStorage,
  resetAllToFactorySeeds
} from '../../data/storage';

// ----------------- PROJECT MODERATION -----------------
export function approveProject(projectId) {
  const projects = getStoredProjects();
  const updated = projects.map(p => {
    if (p.id === projectId) {
      return { ...p, status: 'approved' };
    }
    return p;
  });
  saveStoredProjects(updated);
  addAuditLog(`Admin approved project "${projectId}".`);
  return updated;
}

export function rejectProject(projectId) {
  const projects = getStoredProjects();
  const updated = projects.map(p => {
    if (p.id === projectId) {
      return { ...p, status: 'rejected' };
    }
    return p;
  });
  saveStoredProjects(updated);
  addAuditLog(`Admin rejected project "${projectId}".`);
  return updated;
}

export function toggleFeatureProject(projectId) {
  const projects = getStoredProjects();
  const updated = projects.map(p => {
    if (p.id === projectId) {
      return { ...p, isFeatured: !p.isFeatured };
    }
    return p;
  });
  saveStoredProjects(updated);
  addAuditLog(`Admin toggled featured status for project "${projectId}".`);
  return updated;
}

export function deleteProject(projectId) {
  const projects = getStoredProjects();
  const target = projects.find(p => p.id === projectId);
  const updated = projects.filter(p => p.id !== projectId);
  saveStoredProjects(updated);

  // Clean associated applications
  const apps = getStoredApplications().filter(a => a.projectId !== projectId);
  saveStoredApplications(apps);

  addAuditLog(`Admin deleted project: "${target?.title || projectId}".`);
  return updated;
}

// ----------------- USER MANAGEMENT & RBAC -----------------
export function updateUserStatus(userId, status) {
  const users = getStoredUsers();
  const updated = users.map(u => {
    if (u.id === userId) {
      return { ...u, status };
    }
    return u;
  });
  saveStoredUsers(updated);
  addAuditLog(`Admin updated status of user "${userId}" to "${status}".`);
  return updated;
}

export function updateUserRole(userId, newRole) {
  const users = getStoredUsers();
  const updated = users.map(u => {
    if (u.id === userId) {
      return { ...u, role: newRole };
    }
    return u;
  });
  saveStoredUsers(updated);
  addAuditLog(`Admin reassigned role of user "${userId}" to "${newRole}".`);
  return updated;
}

export function resetUserPassword(userId, newPassword) {
  const users = getStoredUsers();
  const updated = users.map(u => {
    if (u.id === userId) {
      return { ...u, password: newPassword };
    }
    return u;
  });
  saveStoredUsers(updated);
  const target = users.find(u => u.id === userId);
  addAuditLog(`Admin reset password for user: "${target?.name || userId}".`);
  return updated;
}

export function deleteUser(userId) {
  const users = getStoredUsers();
  const target = users.find(u => u.id === userId);
  if (target?.username === 'prudhvi') {
    throw new Error('Cannot delete the primary platform Super Administrator.');
  }
  const updated = users.filter(u => u.id !== userId);
  saveStoredUsers(updated);
  addAuditLog(`Admin deleted user account: "${target?.name || userId}".`);
  return updated;
}

export function createAdminUser(userData) {
  const users = getStoredUsers();
  const newUser = {
    id: `usr-${Date.now()}`,
    name: userData.name.trim(),
    username: userData.username.trim().toLowerCase(),
    email: userData.email.trim().toLowerCase(),
    password: userData.password,
    role: userData.role || 'Freelancer',
    status: 'Active',
    avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
    joinedDate: new Date().toISOString().split('T')[0]
  };
  const updated = [...users, newUser];
  saveStoredUsers(updated);
  addAuditLog(`Admin created new account: "${newUser.name}" (${newUser.role}).`);
  return updated;
}

// ----------------- ESCROW DISPUTE RESOLUTION -----------------
export function resolveEscrowAction(appId, newEscrowState, newProjectStatus) {
  const applications = getStoredApplications();
  const targetApp = applications.find(a => a.id === appId);
  const updatedApps = applications.map(a => {
    if (a.id === appId) {
      return { ...a, escrowState: newEscrowState };
    }
    return a;
  });
  saveStoredApplications(updatedApps);

  if (newProjectStatus && targetApp) {
    const projects = getStoredProjects();
    const updatedProjects = projects.map(p => {
      if (p.id === targetApp.projectId) {
        return { ...p, status: newProjectStatus };
      }
      return p;
    });
    saveStoredProjects(updatedProjects);
  }

  addAuditLog(`Admin arbitrated escrow for "${targetApp?.projectTitle || appId}": Set state to "${newEscrowState}".`);
  return updatedApps;
}

// ----------------- FINANCIAL ANALYTICS -----------------
export function calculatePlatformMetrics() {
  const projects = getStoredProjects();
  const applications = getStoredApplications();
  const settings = getStoredSettings();
  const users = getStoredUsers();

  const commissionRate = settings.platformFeePercent ?? 10;
  const grossMarketplaceValue = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);

  const activeEscrowVolume = applications
    .filter(a => a.status === 'accepted' || a.escrowState === 'Held in Escrow')
    .reduce((sum, a) => sum + (Number(a.bid) || 0), 0);

  const releasedPayouts = applications
    .filter(a => a.escrowState === 'Released to Freelancer')
    .reduce((sum, a) => sum + (Number(a.bid) || 0), 0);

  const platformNetCommission = Math.round((activeEscrowVolume + releasedPayouts) * (commissionRate / 100));

  return {
    grossMarketplaceValue,
    activeEscrowVolume,
    releasedPayouts,
    platformNetCommission,
    commissionRate,
    totalProjects: projects.length,
    totalUsers: users.length,
    totalApplications: applications.length,
    pendingApprovals: projects.filter(p => p.status === 'pending').length
  };
}

export function simulatePlatformRevenue(targetVolume, feePercent) {
  const grossVolume = Number(targetVolume) || 0;
  const fee = Number(feePercent) || 10;
  const netCommission = Math.round(grossVolume * (fee / 100));
  const freelancerPayouts = Math.round(grossVolume * (1 - (fee / 100)));
  return {
    grossVolume,
    netCommission,
    freelancerPayouts,
    feePercent: fee
  };
}

// ----------------- TAXONOMY & PLATFORM SETTINGS -----------------
export function addCategory(name) {
  const categories = getStoredCategories();
  const clean = name.trim();
  if (!clean || categories.includes(clean)) return categories;
  const updated = [...categories, clean];
  saveStoredCategories(updated);
  addAuditLog(`Admin added project category: "${clean}".`);
  return updated;
}

export function deleteCategory(name) {
  const categories = getStoredCategories();
  const updated = categories.filter(c => c !== name);
  saveStoredCategories(updated);
  addAuditLog(`Admin removed project category: "${name}".`);
  return updated;
}

export function updateSettings(newSettings) {
  saveStoredSettings(newSettings);
  addAuditLog('Admin updated platform configuration settings.');
  return newSettings;
}

export function resetFactoryData() {
  return resetAllToFactorySeeds();
}

export function clearAuditLogs() {
  return clearAuditLogsStorage();
}

// Export default service object
export const AdminService = {
  approveProject,
  rejectProject,
  toggleFeatureProject,
  deleteProject,
  updateUserStatus,
  updateUserRole,
  resetUserPassword,
  deleteUser,
  createAdminUser,
  resolveEscrowAction,
  calculatePlatformMetrics,
  simulatePlatformRevenue,
  addCategory,
  deleteCategory,
  updateSettings,
  resetFactoryData,
  clearAuditLogs
};

export default AdminService;
