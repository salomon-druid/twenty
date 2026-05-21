import { Injectable, Logger } from '@nestjs/common';

import { TwentyORMService } from 'src/engine/twenty-orm/twenty-orm.service';

type BrokerDashboardMetrics = {
  // Portfolio
  totalPolicies: number;
  activePolicies: number;
  expiring30Days: number;
  expiring60Days: number;
  expiring90Days: number;
  totalPremiumVolume: number;
  // Claims
  totalClaims: number;
  openClaims: number;
  totalClaimAmount: number;
  openClaimAmount: number;
  // Revenue
  totalCommission: number;
  pendingCommission: number;
  // Tasks
  openTasks: number;
  overdueTasks: number;
  // Clients
  totalClients: number;
};

@Injectable()
export class BrokerDashboardService {
  private readonly logger = new Logger(BrokerDashboardService.name);

  constructor(private readonly twentyORMService: TwentyORMService) {}

  async getDashboardMetrics(
    workspaceId: string,
    brokerId?: string,
  ): Promise<BrokerDashboardMetrics> {
    this.logger.log(
      `Computing broker dashboard metrics for workspace ${workspaceId}${brokerId ? `, broker ${brokerId}` : ''}`,
    );

    try {
      const now = new Date();
      const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const sixtyDays = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
      const ninetyDays = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

      // Policies
      const policyRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'policy',
        );

      const allPolicies = await policyRepo.find(
        brokerId ? { where: { brokerId } } : undefined,
      );
      const activePolicies = allPolicies.filter((p) => p.status === 'active');

      const expiring30 = activePolicies.filter(
        (p) => p.endDate && new Date(p.endDate) <= thirtyDays,
      ).length;
      const expiring60 = activePolicies.filter(
        (p) => p.endDate && new Date(p.endDate) <= sixtyDays,
      ).length;
      const expiring90 = activePolicies.filter(
        (p) => p.endDate && new Date(p.endDate) <= ninetyDays,
      ).length;

      const totalPremiumVolume = activePolicies.reduce(
        (sum, p) => sum + (p.premium?.amountMicros ?? 0),
        0,
      );

      // Claims
      const claimRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'claim',
        );

      const allClaims = await claimRepo.find(
        brokerId ? { where: { brokerId } } : undefined,
      );
      const openClaims = allClaims.filter(
        (c) => c.status !== 'closed' && c.status !== 'rejected',
      );

      const totalClaimAmount = allClaims.reduce(
        (sum, c) => sum + (c.amount?.amountMicros ?? 0),
        0,
      );
      const openClaimAmount = openClaims.reduce(
        (sum, c) => sum + (c.amount?.amountMicros ?? 0),
        0,
      );

      // Commissions (from provisions)
      const provisionRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'provision',
        );

      const allProvisions = await provisionRepo.find(
        brokerId ? { where: { brokerId } } : undefined,
      );
      const totalCommission = allProvisions.reduce(
        (sum, p) => sum + (p.amount?.amountMicros ?? 0),
        0,
      );
      const pendingCommission = allProvisions
        .filter((p) => p.status === 'pending' || p.status === 'overdue')
        .reduce((sum, p) => sum + (p.amount?.amountMicros ?? 0), 0);

      // Tasks
      const taskRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'insuranceTask',
        );

      const allTasks = await taskRepo.find(
        brokerId ? { where: { brokerId } } : undefined,
      );
      const openTasks = allTasks.filter(
        (t) => t.status !== 'completed' && t.status !== 'cancelled',
      );
      const overdueTasks = openTasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < now,
      ).length;

      // Clients (unique companies from policies)
      const uniqueCompanyIds = new Set(
        allPolicies.map((p) => p.companyId).filter(Boolean),
      );

      return {
        totalPolicies: allPolicies.length,
        activePolicies: activePolicies.length,
        expiring30Days: expiring30,
        expiring60Days: expiring60,
        expiring90Days: expiring90,
        totalPremiumVolume,
        totalClaims: allClaims.length,
        openClaims: openClaims.length,
        totalClaimAmount,
        openClaimAmount,
        totalCommission,
        pendingCommission,
        openTasks: openTasks.length,
        overdueTasks,
        totalClients: uniqueCompanyIds.size,
      };
    } catch (error) {
      this.logger.error(
        `Error computing broker dashboard metrics: ${error.message}`,
      );
      return {
        totalPolicies: 0,
        activePolicies: 0,
        expiring30Days: 0,
        expiring60Days: 0,
        expiring90Days: 0,
        totalPremiumVolume: 0,
        totalClaims: 0,
        openClaims: 0,
        totalClaimAmount: 0,
        openClaimAmount: 0,
        totalCommission: 0,
        pendingCommission: 0,
        openTasks: 0,
        overdueTasks: 0,
        totalClients: 0,
      };
    }
  }
}
