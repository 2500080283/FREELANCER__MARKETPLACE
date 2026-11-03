/**
 * Client / Employer Module Controller & Business Logic
 * Dedicated module service for job postings, candidate proposal reviews,
 * escrow fund deposits, milestone payout releases, and company profile.
 */

import {
  getStoredProjects,
  saveStoredProjects,
  getStoredApplications,
  saveStoredApplications,
  getStoredSettings,
  getStoredUsers,
  saveStoredUsers,
  addAuditLog
} from '../../data/storage';

// ----------------- JOB POSTING & PROJECT MANAGEMENT -----------------
export function createClientProject(clientUser, projectData) {
  const projects = getStoredProjects();
  const settings = getStoredSettings();
  const isAutoApprove = settings?.autoApproveProjects !== false;

  const newProject = {
    id: `proj-${Date.now()}`,
    title: projectData.title.trim(),
    category: projectData.category || 'Web Development',
    budget: Number(projectData.budget),
    description: projectData.description.trim(),
    skills: projectData.skills || ['Web Development'],
    postedTime: 'Just now',
    client: {
      name: clientUser.name,
      email: clientUser.email,
      verified: true,
      rating: 5.0,
      country: 'India'
    },
    status: isAutoApprove ? 'approved' : 'pending',
    proposalsCount: 0,
    isFeatured: false
  };

  const updatedProjects = [newProject, ...projects];
  saveStoredProjects(updatedProjects);

  addAuditLog(`Client "${clientUser.name}" posted project "${newProject.title}" (₹${newProject.budget.toLocaleString()}).`);
  return { newProject, updatedProjects, isAutoApprove };
}

export function getClientProjects(clientEmail) {
  const projects = getStoredProjects();
  return projects.filter(
    p => p.client?.email === clientEmail
  );
}

export function deleteClientProject(projectId, clientEmail) {
  const projects = getStoredProjects();
  const target = projects.find(p => p.id === projectId);
  const updatedProjects = projects.filter(p => p.id !== projectId);
  saveStoredProjects(updatedProjects);

  // Clean applications
  const applications = getStoredApplications().filter(a => a.projectId !== projectId);
  saveStoredApplications(applications);

  addAuditLog(`Client removed project "${target?.title || projectId}".`);
  return getClientProjects(clientEmail);
}

// ----------------- PROPOSALS & CANDIDATE HIRING -----------------
export function getProposalsForClientJobs(clientEmail) {
  const clientProjects = getClientProjects(clientEmail);
  const projectIds = new Set(clientProjects.map(p => p.id));
  const applications = getStoredApplications();
  return applications.filter(app => projectIds.has(app.projectId));
}

export function acceptCandidateProposal(proposalId) {
  const applications = getStoredApplications();
  const targetProposal = applications.find(a => a.id === proposalId);

  const updatedApps = applications.map(a => {
    if (a.id === proposalId) {
      return { ...a, status: 'accepted', escrowState: 'Held in Escrow' };
    }
    return a;
  });
  saveStoredApplications(updatedApps);

  // Update associated project status to in_progress
  if (targetProposal) {
    const projects = getStoredProjects();
    const updatedProjects = projects.map(p => {
      if (p.id === targetProposal.projectId) {
        return { ...p, status: 'in_progress' };
      }
      return p;
    });
    saveStoredProjects(updatedProjects);
  }

  addAuditLog(`Proposal accepted from ${targetProposal?.freelancerName} for ₹${targetProposal?.bid?.toLocaleString()} (Funds held in Escrow).`);
  return updatedApps;
}

// ----------------- ESCROW MILESTONE PAYOUT RELEASES -----------------
export function approveDeliverableAndReleaseEscrow(applicationId) {
  const applications = getStoredApplications();
  const targetApp = applications.find(a => a.id === applicationId);

  const updatedApps = applications.map(a => {
    if (a.id === applicationId) {
      return { ...a, escrowState: 'Released to Freelancer' };
    }
    return a;
  });
  saveStoredApplications(updatedApps);

  // Mark project as completed
  if (targetApp) {
    const projects = getStoredProjects();
    const updatedProjects = projects.map(p => {
      if (p.id === targetApp.projectId) {
        return { ...p, status: 'completed' };
      }
      return p;
    });
    saveStoredProjects(updatedProjects);
  }

  addAuditLog(`Client authorized escrow milestone release for "${targetApp?.projectTitle}": ₹${targetApp?.bid?.toLocaleString()} paid to ${targetApp?.freelancerName}.`);
  return updatedApps;
}

// ----------------- FINANCIAL METRICS & SPENDING -----------------
export function calculateClientSpending(clientEmail) {
  const myProposals = getProposalsForClientJobs(clientEmail);
  const myProjects = getClientProjects(clientEmail);

  const activeContracts = myProposals.filter(
    a => a.status === 'accepted' || a.escrowState === 'Held in Escrow' || a.escrowState === 'Released to Freelancer'
  );

  const escrowHeldTotal = activeContracts
    .filter(a => a.escrowState === 'Held in Escrow')
    .reduce((sum, a) => sum + (Number(a.bid) || 0), 0);

  const completedDisbursedTotal = activeContracts
    .filter(a => a.escrowState === 'Released to Freelancer')
    .reduce((sum, a) => sum + (Number(a.bid) || 0), 0);

  const totalCommittedBudget = myProjects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);

  return {
    jobsPostedCount: myProjects.length,
    proposalsReceivedCount: myProposals.length,
    activeContractsCount: activeContracts.length,
    escrowHeldTotal,
    completedDisbursedTotal,
    totalCommittedBudget
  };
}

// ----------------- COMPANY & EMPLOYER PROFILE -----------------
export function updateCompanyProfile(currentUser, companyData) {
  const users = getStoredUsers();
  const updatedUsers = users.map(u => {
    if (u.id === currentUser.id || u.email === currentUser.email) {
      return {
        ...u,
        name: companyData.name?.trim() || u.name,
        title: companyData.title?.trim() || u.title,
        bio: companyData.bio?.trim() || u.bio
      };
    }
    return u;
  });
  saveStoredUsers(updatedUsers);
  addAuditLog(`Client "${currentUser.name}" updated organization details.`);
  return updatedUsers.find(u => u.id === currentUser.id);
}

// Export default service object
export const ClientService = {
  createClientProject,
  getClientProjects,
  deleteClientProject,
  getProposalsForClientJobs,
  acceptCandidateProposal,
  approveDeliverableAndReleaseEscrow,
  calculateClientSpending,
  updateCompanyProfile
};

export default ClientService;

