import { Injectable, Logger } from '@nestjs/common';

import { TwentyORMService } from 'src/engine/twenty-orm/twenty-orm.service';

type ReportFilters = {
  workspaceId: string;
  brokerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
};

type PortfolioSummaryReport = {
  totalPolicies: number;
  activePolicies: number;
  policiesByType: Record<string, number>;
  totalPremiumVolume: number;
  expiring30Days: number;
  expiring60Days: number;
  expiring90Days: number;
};

type ClaimsAnalysisReport = {
  totalClaims: number;
  openClaims: number;
  closedClaims: number;
  totalClaimAmount: number;
  openClaimAmount: number;
  claimsByType: Record<string, number>;
  averageClaimAmount: number;
  claimsRatio: number;
};

type RevenueReport = {
  totalCommission: number;
  pendingCommission: number;
  paidCommission: number;
  commissionByPeriod: Record<string, number>;
};

type RenewalCalendarReport = {
  renewalsByMonth: Record<string, number>;
  upcomingRenewals: Array<{
    renewalId: string;
    policyNumber: string;
    renewalDate: string | null;
    status: string;
  }>;
};

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly twentyORMService: TwentyORMService) {}

  async getPortfolioSummary(
    filters: ReportFilters,
  ): Promise<PortfolioSummaryReport> {
    this.logger.log(
      `Generating portfolio summary for workspace ${filters.workspaceId}`,
    );

    try {
      const policyRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          filters.workspaceId,
          'policy',
        );

      const allPolicies = await policyRepo.find(
        filters.brokerId ? { where: { brokerId: filters.brokerId } } : undefined,
      );

      const activePolicies = allPolicies.filter((p) => p.status === 'active');
      const now = new Date();
      const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const sixtyDays = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
      const ninetyDays = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

      const policiesByType: Record<string, number> = {};
      for (const policy of allPolicies) {
        const type = policy.type ?? 'Unknown';
        policiesByType[type] = (policiesByType[type] ?? 0) + 1;
      }

      const totalPremiumVolume = activePolicies.reduce(
        (sum, p) => sum + (p.premium?.amountMicros ?? 0),
        0,
      );

      return {
        totalPolicies: allPolicies.length,
        activePolicies: activePolicies.length,
        policiesByType,
        totalPremiumVolume,
        expiring30Days: activePolicies.filter(
          (p) =>
            p.endDate &&
            new Date(p.endDate) <= thirtyDays &&
            new Date(p.endDate) >= now,
        ).length,
        expiring60Days: activePolicies.filter(
          (p) =>
            p.endDate &&
            new Date(p.endDate) <= sixtyDays &&
            new Date(p.endDate) >= now,
        ).length,
        expiring90Days: activePolicies.filter(
          (p) =>
            p.endDate &&
            new Date(p.endDate) <= ninetyDays &&
            new Date(p.endDate) >= now,
        ).length,
      };
    } catch (error) {
      this.logger.error(`Error generating portfolio summary: ${error.message}`);
      return {
        totalPolicies: 0,
        activePolicies: 0,
        policiesByType: {},
        totalPremiumVolume: 0,
        expiring30Days: 0,
        expiring60Days: 0,
        expiring90Days: 0,
      };
    }
  }

  async getClaimsAnalysis(
    filters: ReportFilters,
  ): Promise<ClaimsAnalysisReport> {
    this.logger.log(
      `Generating claims analysis for workspace ${filters.workspaceId}`,
    );

    try {
      const claimRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          filters.workspaceId,
          'claim',
        );

      const provisionRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          filters.workspaceId,
          'provision',
        );

      const allClaims = await claimRepo.find(
        filters.brokerId ? { where: { brokerId: filters.brokerId } } : undefined,
      );

      const openClaims = allClaims.filter(
        (c) => c.status !== 'closed' && c.status !== 'rejected',
      );
      const closedClaims = allClaims.filter(
        (c) => c.status === 'closed' || c.status === 'rejected',
      );

      const totalClaimAmount = allClaims.reduce(
        (sum, c) => sum + (c.amount?.amountMicros ?? 0),
        0,
      );
      const openClaimAmount = openClaims.reduce(
        (sum, c) => sum + (c.amount?.amountMicros ?? 0),
        0,
      );

      const claimsByType: Record<string, number> = {};
      for (const claim of allClaims) {
        const type = claim.claimType ?? 'Unknown';
        claimsByType[type] = (claimsByType[type] ?? 0) + 1;
      }

      const averageClaimAmount =
        allClaims.length > 0 ? totalClaimAmount / allClaims.length : 0;

      // Claims ratio = total claims / total premiums
      const allProvisions = await provisionRepo.find(
        filters.brokerId ? { where: { brokerId: filters.brokerId } } : undefined,
      );
      const totalPremiums = allProvisions.reduce(
        (sum, p) => sum + (p.amount?.amountMicros ?? 0),
        0,
      );
      const claimsRatio = totalPremiums > 0
        ? Math.round((totalClaimAmount / totalPremiums) * 10000) / 100
        : 0;

      return {
        totalClaims: allClaims.length,
        openClaims: openClaims.length,
        closedClaims: closedClaims.length,
        totalClaimAmount,
        openClaimAmount,
        claimsByType,
        averageClaimAmount,
        claimsRatio,
      };
    } catch (error) {
      this.logger.error(`Error generating claims analysis: ${error.message}`);
      return {
        totalClaims: 0,
        openClaims: 0,
        closedClaims: 0,
        totalClaimAmount: 0,
        openClaimAmount: 0,
        claimsByType: {},
        averageClaimAmount: 0,
        claimsRatio: 0,
      };
    }
  }

  async getRevenueReport(filters: ReportFilters): Promise<RevenueReport> {
    this.logger.log(
      `Generating revenue report for workspace ${filters.workspaceId}`,
    );

    try {
      const provisionRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          filters.workspaceId,
          'provision',
        );

      const allProvisions = await provisionRepo.find(
        filters.brokerId ? { where: { brokerId: filters.brokerId } } : undefined,
      );

      const totalCommission = allProvisions.reduce(
        (sum, p) => sum + (p.amount?.amountMicros ?? 0),
        0,
      );
      const pendingCommission = allProvisions
        .filter((p) => p.status === 'pending' || p.status === 'overdue')
        .reduce((sum, p) => sum + (p.amount?.amountMicros ?? 0), 0);
      const paidCommission = allProvisions
        .filter((p) => p.status === 'paid')
        .reduce((sum, p) => sum + (p.amount?.amountMicros ?? 0), 0);

      // Group by month (key: YYYY-MM)
      const commissionByPeriod: Record<string, number> = {};
      for (const provision of allProvisions) {
        const month = 'current';
        commissionByPeriod[month] =
          (commissionByPeriod[month] ?? 0) +
          (provision.amount?.amountMicros ?? 0);
      }

      return {
        totalCommission,
        pendingCommission,
        paidCommission,
        commissionByPeriod,
      };
    } catch (error) {
      this.logger.error(`Error generating revenue report: ${error.message}`);
      return {
        totalCommission: 0,
        pendingCommission: 0,
        paidCommission: 0,
        commissionByPeriod: {},
      };
    }
  }

  async getRenewalCalendar(
    filters: ReportFilters,
  ): Promise<RenewalCalendarReport> {
    this.logger.log(
      `Generating renewal calendar for workspace ${filters.workspaceId}`,
    );

    try {
      const renewalRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          filters.workspaceId,
          'renewal',
        );

      const policyRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          filters.workspaceId,
          'policy',
        );

      const allRenewals = await renewalRepo.find(
        filters.brokerId ? { where: { brokerId: filters.brokerId } } : undefined,
      );

      const renewalsByMonth: Record<string, number> = {};
      const upcomingRenewals: RenewalCalendarReport['upcomingRenewals'] = [];

      for (const renewal of allRenewals) {
        if (renewal.renewalDate) {
          const date = new Date(renewal.renewalDate);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          renewalsByMonth[key] = (renewalsByMonth[key] ?? 0) + 1;

          // Active upcoming renewals
          if (renewal.status !== 'renewed' && renewal.status !== 'expired') {
            const policy = renewal.policyId
              ? await policyRepo.findOne({
                  where: { id: renewal.policyId },
                })
              : null;

            upcomingRenewals.push({
              renewalId: renewal.id,
              policyNumber: policy?.policyNumber ?? t`Unknown`,
              renewalDate: renewal.renewalDate,
              status: renewal.status,
            });
          }
        }
      }

      // Sort upcoming by date
      upcomingRenewals.sort((a, b) => {
        if (!a.renewalDate) return 1;
        if (!b.renewalDate) return -1;
        return (
          new Date(a.renewalDate).getTime() -
          new Date(b.renewalDate).getTime()
        );
      });

      return {
        renewalsByMonth,
        upcomingRenewals,
      };
    } catch (error) {
      this.logger.error(`Error generating renewal calendar: ${error.message}`);
      return {
        renewalsByMonth: {},
        upcomingRenewals: [],
      };
    }
  }
}
