/**
 * User / Freelancer Module Controller & Business Logic
 * Dedicated module service for talent profiles, proposal bidding, saved bookmarks,
 * milestone deliverables, and freelancer earnings tracking.
 */

import {
  getStoredProjects,
  getStoredApplications,
  saveStoredApplications,
  getStoredBookmarks,
  saveStoredBookmarks,
  getStoredUsers,
  saveStoredUsers,
  addAuditLog
} from '../../data/storage';

// ----------------- PROFILE MANAGEMENT -----------------
export function getFreelancerProfile(email) {
  const users = getStoredUsers();
  return users.find(u => u.email === email) || null;
}

export function updateFreelancerProfile(currentUser, profileData) {
  const users = getStoredUsers();
  const updatedUsers = users.map(u => {
    if (u.id === currentUser.id || u.email === currentUser.email) {
      return {
        ...u,
        name: profileData.name?.trim() || u.name,
        title: profileData.title?.trim() || u.title,
        hourlyRate: profileData.hourlyRate?.trim() || u.hourlyRate,
        skills: profileData.skills || u.skills,
        bio: profileData.bio?.trim() || u.bio
      };
    }
    return u;
  });
  saveStoredUsers(updatedUsers);
  addAuditLog(`User "${currentUser.name}" updated their profile credentials.`);
  return updatedUsers.find(u => u.id === currentUser.id);
}

// ----------------- PROPOSALS & BIDS -----------------
export function submitProposal(proposalData) {
  const applications = getStoredApplications();

  const newApp = {
    id: `app-${Date.now()}`,
    projectId: proposalData.projectId,
    projectTitle: proposalData.projectTitle,
    freelancerName: proposalData.freelancerName,
    freelancerEmail: proposalData.freelancerEmail,
    bid: Number(proposalData.bid),
    timeline: proposalData.timeline || '7 Days',
    coverLetter: proposalData.coverLetter || '',
    status: 'pending',
    escrowState: 'Pending Escrow',
    date: new Date().toISOString()
  };

  const updatedApps = [newApp, ...applications];
  saveStoredApplications(updatedApps);

  addAuditLog(`${newApp.freelancerName} submitted proposal for "${newApp.projectTitle}" (₹${newApp.bid.toLocaleString()}).`);
  return { newApp, updatedApps };
}

export function getMyProposals(freelancerEmail) {
  const applications = getStoredApplications();
  return applications.filter(
    app => app.freelancerEmail === freelancerEmail
  );
}

export function withdrawProposal(proposalId, freelancerEmail) {
  const applications = getStoredApplications();
  const target = applications.find(a => a.id === proposalId);
  const updated = applications.filter(a => a.id !== proposalId);
  saveStoredApplications(updated);

  addAuditLog(`Freelancer withdrawn proposal "${proposalId}" for "${target?.projectTitle}".`);
  return updated.filter(a => a.freelancerEmail === freelancerEmail);
}

// ----------------- BOOKMARKS & SAVED JOBS -----------------
export function getSavedProjects() {
  const bookmarks = getStoredBookmarks();
  const projects = getStoredProjects();
  return projects.filter(p => bookmarks.includes(p.id));
}

export function toggleProjectBookmark(projectId) {
  const bookmarks = getStoredBookmarks();
  let updated;
  let isSaved = false;

  if (bookmarks.includes(projectId)) {
    updated = bookmarks.filter(id => id !== projectId);
    isSaved = false;
  } else {
    updated = [...bookmarks, projectId];
    isSaved = true;
  }

  saveStoredBookmarks(updated);
  return { bookmarks: updated, isSaved };
}

export function isProjectBookmarked(projectId) {
  const bookmarks = getStoredBookmarks();
  return bookmarks.includes(projectId);
}

// ----------------- FINANCIALS & EARNINGS -----------------
export function calculateFreelancerEarnings(freelancerEmail) {
  const myProposals = getMyProposals(freelancerEmail);

  const earnedTotal = myProposals
    .filter(a => a.escrowState === 'Released to Freelancer')
    .reduce((sum, a) => sum + (Number(a.bid) || 0), 0);

  const heldInEscrow = myProposals
    .filter(a => a.escrowState === 'Held in Escrow' || a.status === 'accepted')
    .reduce((sum, a) => sum + (Number(a.bid) || 0), 0);

  const pendingBidsVolume = myProposals
    .filter(a => a.status === 'pending')
    .reduce((sum, a) => sum + (Number(a.bid) || 0), 0);

  return {
    earnedTotal,
    heldInEscrow,
    pendingBidsVolume,
    proposalsCount: myProposals.length,
    activeContractsCount: myProposals.filter(a => a.status === 'accepted').length
  };
}

// Export default service object
export const UserService = {
  getFreelancerProfile,
  updateFreelancerProfile,
  submitProposal,
  getMyProposals,
  withdrawProposal,
  getSavedProjects,
  toggleProjectBookmark,
  isProjectBookmarked,
  calculateFreelancerEarnings
};

export default UserService;
