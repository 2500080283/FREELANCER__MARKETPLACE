import { Project, Application, PlatformSettings } from './index';

export interface ClientModuleProps {
  projects: Project[];
  applications: Application[];
  categories: string[];
  settings: PlatformSettings;
  onOpenClientProposals: (project: Project) => void;
  onAcceptProposal: (proposal: Application) => void;
  onEscrowAction: (appId: string, state: string, projectStatus?: string) => void;
  onProjectCreated: (project: Project) => void;
  onNavigateMarketplace: () => void;
}

export type ClientTab = 'projects' | 'contracts' | 'post' | 'profile';

