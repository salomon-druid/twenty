import { Injectable, Logger } from '@nestjs/common';

import { TwentyORMService } from 'src/engine/twenty-orm/twenty-orm.service';

type ReinsuranceSummary = {
  totalTreaties: number;
  activeTreaties: number;
  expiringTreaties: number;
  totalCededAmount: number;
  averageCommissionRate: number;
  treatiesByType: Record<string, number>;
  treatiesByReinsurer: Record<string, number>;
};

type TreatyAlert = {
  treatyId: string;
  treatyNumber: string;
  type: 'expiring' | 'expired';
  validTo: string | null;
  daysRemaining: number | null;
};

@Injectable()
export class ReinsuranceService {
  private readonly logger = new Logger(ReinsuranceService.name);

  constructor(private readonly twentyORMService: TwentyORMService) {}

  async getReinsuranceSummary(
    workspaceId: string,
    brokerId?: string,
  ): Promise<ReinsuranceSummary> {
    this.logger.log(
      `Computing reinsurance summary for workspace ${workspaceId}${brokerId ? `, broker ${brokerId}` : ''}`,
    );

    try {
      const reinsuranceRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'reinsurance',
        );

      const allTreaties = await reinsuranceRepo.find(
        brokerId ? { where: { brokerId } } : undefined,
      );

      const now = new Date();
      const activeTreaties = allTreaties.filter((t) => {
        if (!t.validTo) return true;
        return new Date(t.validTo) >= now;
      });

      const expiringTreaties = activeTreaties.filter((t) => {
        if (!t.validTo) return false;
        const validTo = new Date(t.validTo);
        const ninetyDays = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
        return validTo <= ninetyDays;
      });

      const totalCededAmount = activeTreaties.reduce(
        (sum, t) => sum + (t.cededAmount?.amountMicros ?? 0),
        0,
      );

      const totalCommission = activeTreaties.reduce(
        (sum, t) => sum + (t.commission ?? 0),
        0,
      );

      const averageCommissionRate = activeTreaties.length > 0
        ? Math.round((totalCommission / activeTreaties.length) * 10) / 10
        : 0;

      const treatiesByType: Record<string, number> = {};
      for (const treaty of allTreaties) {
        const type = treaty.type ?? 'Unknown';
        treatiesByType[type] = (treatiesByType[type] ?? 0) + 1;
      }

      const treatiesByReinsurer: Record<string, number> = {};
      for (const treaty of allTreaties) {
        const reinsurer = treaty.reinsurer ?? 'Unknown';
        treatiesByReinsurer[reinsurer] =
          (treatiesByReinsurer[reinsurer] ?? 0) + 1;
      }

      return {
        totalTreaties: allTreaties.length,
        activeTreaties: activeTreaties.length,
        expiringTreaties: expiringTreaties.length,
        totalCededAmount,
        averageCommissionRate,
        treatiesByType,
        treatiesByReinsurer,
      };
    } catch (error) {
      this.logger.error(
        `Error computing reinsurance summary: ${error.message}`,
      );
      return {
        totalTreaties: 0,
        activeTreaties: 0,
        expiringTreaties: 0,
        totalCededAmount: 0,
        averageCommissionRate: 0,
        treatiesByType: {},
        treatiesByReinsurer: {},
      };
    }
  }

  async getTreatyAlerts(
    workspaceId: string,
    brokerId?: string,
  ): Promise<TreatyAlert[]> {
    this.logger.log(
      `Computing treaty alerts for workspace ${workspaceId}${brokerId ? `, broker ${brokerId}` : ''}`,
    );

    try {
      const reinsuranceRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'reinsurance',
        );

      const allTreaties = await reinsuranceRepo.find(
        brokerId ? { where: { brokerId } } : undefined,
      );

      const now = new Date();
      const alerts: TreatyAlert[] = [];

      for (const treaty of allTreaties) {
        if (!treaty.validTo) continue;

        const validTo = new Date(treaty.validTo);
        const daysRemaining = Math.ceil(
          (validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (daysRemaining < 0) {
          alerts.push({
            treatyId: treaty.id,
            treatyNumber: treaty.treatyNumber,
            type: 'expired',
            validTo: treaty.validTo,
            daysRemaining,
          });
        } else if (daysRemaining <= 90) {
          alerts.push({
            treatyId: treaty.id,
            treatyNumber: treaty.treatyNumber,
            type: 'expiring',
            validTo: treaty.validTo,
            daysRemaining,
          });
        }
      }

      // Sort by days remaining (most urgent first)
      alerts.sort((a, b) => {
        if (a.daysRemaining == null) return 1;
        if (b.daysRemaining == null) return -1;
        return a.daysRemaining - b.daysRemaining;
      });

      return alerts;
    } catch (error) {
      this.logger.error(`Error computing treaty alerts: ${error.message}`);
      return [];
    }
  }

  async getCededPremiumByPolicy(
    workspaceId: string,
    policyId: string,
  ): Promise<{ totalCeded: number; treaties: Array<{ id: string; treatyNumber: string; cededAmount: number | null; cededPercentage: number | null }> }> {
    this.logger.log(
      `Computing ceded premium for policy ${policyId} in workspace ${workspaceId}`,
    );

    try {
      const reinsuranceRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'reinsurance',
        );

      const treaties = await reinsuranceRepo.find({
        where: { policyId },
      });

      const totalCeded = treaties.reduce(
        (sum, t) => sum + (t.cededAmount?.amountMicros ?? 0),
        0,
      );

      return {
        totalCeded,
        treaties: treaties.map((t) => ({
          id: t.id,
          treatyNumber: t.treatyNumber,
          cededAmount: t.cededAmount?.amountMicros ?? null,
          cededPercentage: t.cededPercentage,
        })),
      };
    } catch (error) {
      this.logger.error(`Error computing ceded premium: ${error.message}`);
      return { totalCeded: 0, treaties: [] };
    }
  }
}
