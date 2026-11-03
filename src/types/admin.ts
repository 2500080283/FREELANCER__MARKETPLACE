import { Project, User, Application, PlatformSettings, PlatformMetrics } from './index';

export interface AdminModuleProps {
  users: User[];
  projects: Project[];
  applications: Application[];
  auditLogs: { id: string; time: string; text: string }[];
  settings: PlatformSettings;
  categories: string[];
  onUpdateProjectStatus: (id: string, status: string) => void;
  onToggleFeatureProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onUpdateUserStatus: (id: string, status: string) => void;
  onUpdateUserRole: (id: string, role: string) => void;
  onDeleteUser: (id: string) => void;
  onResetUserPassword: (id: string, newPass: string) => void;
  onOpenCreateUser: () => void;
  onClearAuditLogs: () => void;
  onUpdateSettings: (newSettings: PlatformSettings) => void;
  onUpdateCategories: (newCategories: string[]) => void;
  onEscrowAction: (appId: string, state: string, projectStatus?: string) => void;
  onResetFactoryData: () => void;
  onNavigateMarketplace: () => void;
}

export type AdminModerationTab = 'analytics' | 'projects' | 'users' | 'proposals' | 'categories' | 'settings' | 'logs';
