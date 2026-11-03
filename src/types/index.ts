/**
 * TypeScript Type Definitions for FreelanceHub
 * Domain models, interfaces, and component prop types
 */

export type UserRole = 'Admin' | 'Client' | 'Freelancer';
export type AccountStatus = 'Active' | 'Suspended';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  status: AccountStatus;
  avatar?: string;
  joinedDate?: string;
  title?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: string;
}

export type ProjectStatus = 'approved' | 'pending' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';

export interface ProjectClient {
  name: string;
  email: string;
  verified: boolean;
  rating: number;
  country: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  budget: number;
  description: string;
  skills: string[];
  postedTime: string;
  client: ProjectClient;
  status: ProjectStatus;
  proposalsCount: number;
  isFeatured?: boolean;
}

export type ProposalStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';
export type EscrowState = 'Pending Escrow' | 'Held in Escrow' | 'Released to Freelancer' | 'Refunded to Client' | 'Under Dispute' | 'Settled (50/50 Split)';

export interface Application {
  id: string;
  projectId: string;
  projectTitle: string;
  freelancerName: string;
  freelancerEmail: string;
  bid: number;
  timeline: string;
  coverLetter?: string;
  status: ProposalStatus;
  escrowState: EscrowState;
  date: string;
}

export interface AuditLog {
  id: string;
  time: string;
  text: string;
}

export interface PlatformSettings {
  platformFeePercent: number;
  autoApproveProjects: boolean;
  allowNewRegistrations: boolean;
  maintenanceMode: boolean;
  escrowDisputeWindowDays: number;
}

export interface PlatformMetrics {
  grossMarketplaceValue: number;
  activeEscrowVolume: number;
  releasedPayouts: number;
  platformNetCommission: number;
  commissionRate: number;
  totalProjects: number;
  totalUsers: number;
  totalApplications: number;
  pendingApprovals: number;
}

export interface CategoryStat {
  name: string;
  count: number;
  budget: number;
  percent: number;
}

export interface FreelancerEarnings {
  earnedTotal: number;
  heldInEscrow: number;
  pendingBidsVolume: number;
  proposalsCount: number;
  activeContractsCount: number;
}

export interface ClientSpending {
  jobsPostedCount: number;
  proposalsReceivedCount: number;
  activeContractsCount: number;
  escrowHeldTotal: number;
  completedDisbursedTotal: number;
  totalCommittedBudget: number;
}

