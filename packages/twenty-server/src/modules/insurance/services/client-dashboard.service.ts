import { Injectable, Logger } from '@nestjs/common';

import { TwentyORMService } from 'src/engine/twenty-orm/twenty-orm.service';

type ClientDashboardData = {
  company: {
    id: string;
    name: string;
  };
  policies: Array<{
    id: string;
    policyNumber: string;
    status: string;
    type: string | null;
    startDate: string | null;
    endDate: string | null;
    insurer: string | null;
    premium: { amountMicros: number | null; currencyCode: string } | null;
  }>;
  claims: Array<{
    id: string;
    claimNumber: string;
    status: string;
    claimType: string | null;
    date: string | null;
    amount: { amountMicros: number | null; currencyCode: string } | null;
  }>;
  riskProfiles: Array<{
    id: string;
    riskCategory: string;
    score: number | null;
    assessmentDate: string | null;
    notes: string | null;
  }>;
  premiums: Array<{
    id: string;
    amount: { amountMicros: number | null; currencyCode: string } | null;
    paymentStatus: string;
    dueDate: string | null;
  }>;
  renewals: Array<{
    id: string;
    renewalDate: string | null;
    status: string;
    newPremium: { amountMicros: number | null; currencyCode: string } | null;
  }>;
  sites: Array<{
    id: string;
    name: string;
    type: string;
    riskZone: string;
    address: string | null;
    areaSqm: number | null;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    type: string;
    dueDate: string | null;
  }>;
  reinsurances: Array<{
    id: string;
    treatyNumber: string;
    type: string;
    reinsurer: string;
    cededPercentage: number | null;
    cededAmount: { amountMicros: number | null; currencyCode: string } | null;
    validFrom: string | null;
    validTo: string | null;
  }>;
  summary: {
    totalPolicies: number;
    activePolicies: number;
    openClaims: number;
    openTasks: number;
    overdueTasks: number;
    upcomingRenewals: number;
    totalPremiumPaid: number;
    totalPremiumUnpaid: number;
    totalPremiumOverdue: number;
    totalCededAmount: number;
    activeTreaties: number;
  };
};

@Injectable()
export class ClientDashboardService {
  private readonly logger = new Logger(ClientDashboardService.name);

  constructor(private readonly twentyORMService: TwentyORMService) {}

  async getClientDashboard(
    workspaceId: string,
    companyId: string,
  ): Promise<ClientDashboardData | null> {
    this.logger.log(
      `Building client dashboard for company ${companyId} in workspace ${workspaceId}`,
    );

    try {
      // Fetch company
      const companyRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'company',
        );
      const company = await companyRepo.findOne({ where: { id: companyId } });

      if (!company) {
        this.logger.warn(`Company ${companyId} not found`);
        return null;
      }

      // Fetch policies (Policy has companyId)
      const policyRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'policy',
        );
      const policies = await policyRepo.find({
        where: { companyId },
      });

      // Collect policy IDs for filtering related entities
      const policyIds = new Set(policies.map((p) => p.id).filter(Boolean));

      // Fetch claims (Claim has companyId)
      const claimRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'claim',
      );
      const claims = await claimRepo.find({
        where: { companyId },
      });

      // Fetch risk profiles (RiskProfile has companyId)
      const riskProfileRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'riskProfile',
        );
      const riskProfiles = await riskProfileRepo.find({
        where: { companyId },
      });

      // Fetch all premiums and filter by policyId in memory
      // (Premium has policyId, NOT companyId)
      const premiumRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'premium',
        );
      const allPremiums = await premiumRepo.find();
      const premiums = allPremiums.filter((p) =>
        p.policyId && policyIds.has(p.policyId),
      );

      // Fetch all renewals and filter by policyId in memory
      // (Renewal has policyId, NOT companyId)
      const renewalRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'renewal',
        );
      const allRenewals = await renewalRepo.find();
      const renewals = allRenewals.filter((r) =>
        r.policyId && policyIds.has(r.policyId),
      );

      // Fetch sites (Site has companyId)
      const siteRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'site',
        );
      const sites = await siteRepo.find({
        where: { companyId },
      });

      // Fetch tasks (InsuranceTask has companyId)
      const taskRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'insuranceTask',
        );
      const tasks = await taskRepo.find({
        where: { companyId },
      });

      // Fetch all reinsurances and filter by policyId in memory
      // (Reinsurance has policyId, NOT companyId)
      const reinsuranceRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'reinsurance',
        );
      const allReinsurances = await reinsuranceRepo.find();
      const reinsurances = allReinsurances.filter((r) =>
        r.policyId && policyIds.has(r.policyId),
      );

      // Compute summary
      const now = new Date();
      const activePolicies = policies.filter((p) => p.status === 'active');
      const openClaims = claims.filter(
        (c) => c.status !== 'closed' && c.status !== 'rejected',
      );
      const openTasks = tasks.filter(
        (t) => t.status !== 'completed' && t.status !== 'cancelled',
      );
      const overdueTasks = openTasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < now,
      );
      const upcomingRenewals = renewals.filter(
        (r) => r.status !== 'renewed' && r.status !== 'expired',
      );
      const totalPremiumPaid = premiums
        .filter((p) => p.paymentStatus === 'paid')
        .reduce((sum, p) => sum + (p.amount?.amountMicros ?? 0), 0);
      const totalPremiumUnpaid = premiums
        .filter((p) => p.paymentStatus === 'unpaid')
        .reduce((sum, p) => sum + (p.amount?.amountMicros ?? 0), 0);
      const totalPremiumOverdue = premiums
        .filter((p) => p.paymentStatus === 'overdue')
        .reduce((sum, p) => sum + (p.amount?.amountMicros ?? 0), 0);
      const totalCededAmount = reinsurances
        .filter((r) => !r.validTo || new Date(r.validTo) >= now)
        .reduce((sum, r) => sum + (r.cededAmount?.amountMicros ?? 0), 0);
      const activeTreaties = reinsurances.filter(
        (r) => !r.validTo || new Date(r.validTo) >= now,
      ).length;

      return {
        company: {
          id: company.id,
          name: company.name ?? 'Unknown',
        },
        policies: policies.map((p) => ({
          id: p.id,
          policyNumber: p.policyNumber ?? '',
          status: p.status ?? '',
          type: p.policyType ?? null,
          startDate: p.startDate ?? null,
          endDate: p.endDate ?? null,
          insurer: p.insurer ?? null,
          premium: p.premium ?? null,
        })),
        claims: claims.map((c) => ({
          id: c.id,
          claimNumber: c.claimNumber ?? '',
          status: c.status ?? '',
          claimType: c.claimType ?? null,
          date: c.date ?? null,
          amount: c.amount ?? null,
        })),
        riskProfiles: riskProfiles.map((rp) => ({
          id: rp.id,
          riskCategory: rp.riskCategory ?? '',
          score: rp.score ?? null,
          assessmentDate: rp.assessmentDate ?? null,
          notes: rp.notes ?? null,
        })),
        premiums: premiums.map((p) => ({
          id: p.id,
          amount: p.amount ?? null,
          paymentStatus: p.paymentStatus ?? '',
          dueDate: p.dueDate ?? null,
        })),
        renewals: renewals.map((r) => ({
          id: r.id,
          renewalDate: r.renewalDate ?? null,
          status: r.status ?? '',
          newPremium: r.newPremium ?? null,
        })),
        sites: sites.map((s) => ({
          id: s.id,
          name: s.name ?? '',
          type: s.type ?? '',
          riskZone: s.riskZone ?? '',
          address: s.address ?? null,
          areaSqm: s.areaSqm ?? null,
        })),
        tasks: tasks.map((t) => ({
          id: t.id,
          title: t.title ?? '',
          description: t.description ?? null,
          status: t.status ?? '',
          priority: t.priority ?? '',
          type: t.type ?? '',
          dueDate: t.dueDate ?? null,
        })),
        reinsurances: reinsurances.map((r) => ({
          id: r.id,
          treatyNumber: r.treatyNumber ?? '',
          type: r.type ?? '',
          reinsurer: r.reinsurer ?? '',
          cededPercentage: r.cededPercentage ?? null,
          cededAmount: r.cededAmount ?? null,
          validFrom: r.validFrom ?? null,
          validTo: r.validTo ?? null,
        })),
        summary: {
          totalPolicies: policies.length,
          activePolicies: activePolicies.length,
          openClaims: openClaims.length,
          openTasks: openTasks.length,
          overdueTasks: overdueTasks.length,
          upcomingRenewals: upcomingRenewals.length,
          totalPremiumPaid,
          totalPremiumUnpaid,
          totalPremiumOverdue,
          totalCededAmount,
          activeTreaties,
        },
      };
    } catch (error) {
      this.logger.error(`Error building client dashboard: ${error.message}`);
      return null;
    }
  }
}
