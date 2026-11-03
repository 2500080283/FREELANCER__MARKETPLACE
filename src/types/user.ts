import { Project, Application } from './index';

export interface UserModuleProps {
  projects: Project[];
  applications: Application[];
  bookmarks: string[];
  onOpenClientProposals: (project: Project) => void;
  onOpenApply: (project: Project) => void;
  onToggleBookmark: (projectId: string) => void;
  onNavigateMarketplace: () => void;
}

export type UserWorkspaceTab = 'proposals' | 'projects' | 'bookmarks' | 'profile';
