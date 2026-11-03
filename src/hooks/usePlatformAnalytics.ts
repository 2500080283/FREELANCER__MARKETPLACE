import { useMemo } from 'react';
import { Project, Application, PlatformSettings, PlatformMetrics } from '../types';

export function usePlatformAnalytics(
  projects: Project[] = [],
  applications: Application[] = [],
  settings: Partial<PlatformSettings> = {}
): PlatformMetrics {
  return useMemo(() => {
    const commissionRate = settings.platformFeePercent ?? 10;
    const grossMarketplaceValue = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);

    const activeEscrowVolume = applications
      .filter(a => a.status === 'accepted' || a.escrowState === 'Held in Escrow')
      .reduce((sum, a) => sum + (Number(a.bid) || 0), 0);

    const releasedPayouts = applications
      .filter(a => a.escrowState === 'Released to Freelancer')
      .reduce((sum, a) => sum + (Number(a.bid) || 0), 0);

    const platformNetCommission = Math.round(
      (activeEscrowVolume + releasedPayouts) * (commissionRate / 100)
    );

    const pendingApprovals = projects.filter(p => p.status === 'pending').length;

    return {
      grossMarketplaceValue,
      activeEscrowVolume,
      releasedPayouts,
      platformNetCommission,
      commissionRate,
      totalProjects: projects.length,
      totalUsers: 0,
      totalApplications: applications.length,
      pendingApprovals
    };
  }, [projects, applications, settings.platformFeePercent]);
}

export default usePlatformAnalytics;
