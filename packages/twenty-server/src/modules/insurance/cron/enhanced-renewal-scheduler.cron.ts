import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { RenewalGenerationService } from 'src/modules/insurance/services/renewal-generation.service';
import { InsuranceNotificationService } from 'src/modules/insurance/services/insurance-notification.service';
import { WorkspaceService } from 'src/engine/core-modules/workspace/services/workspace.service';
import { TwentyORMService } from 'src/engine/twenty-orm/twenty-orm.service';

const REMINDER_DAYS = [90, 30];

@Injectable()
export class EnhancedRenewalScheduler {
  private readonly logger = new Logger(EnhancedRenewalScheduler.name);

  constructor(
    private readonly renewalGenerationService: RenewalGenerationService,
    private readonly notificationService: InsuranceNotificationService,
    private readonly workspaceService: WorkspaceService,
    private readonly twentyORMService: TwentyORMService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyRenewalCheck() {
    this.logger.log('Starting daily renewal check cron job');

    try {
      const workspaces = await this.workspaceService.getAllActive();

      for (const workspace of workspaces) {
        try {
          // Generate renewals for expiring policies
          const count =
            await this.renewalGenerationService.generateUpcomingRenewals(
              workspace.id,
            );
          this.logger.log(
            `Workspace ${workspace.id}: generated ${count} renewals`,
          );

          // Send email reminders for policies expiring soon
          await this.sendRenewalReminders(workspace.id);
        } catch (error) {
          this.logger.error(
            `Error processing workspace ${workspace.id}: ${error.message}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(`Cron job failed: ${error.message}`);
    }
  }

  private async sendRenewalReminders(workspaceId: string): Promise<void> {
    try {
      const now = new Date();
      const ninetyDays = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

      const policyRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'policy',
        );

      const expiringPolicies = await policyRepo.find({
        where: {
          endDate: {
            gte: now,
            lte: ninetyDays,
          },
          status: 'active',
        },
      });

      if (expiringPolicies.length === 0) {
        return;
      }

      // Batch-load all brokers and companies referenced by expiring policies
      const brokerIds = [
        ...new Set(
          expiringPolicies
            .map((p) => p.brokerId)
            .filter((id): id is string => id != null),
        ),
      ];
      const companyIds = [
        ...new Set(
          expiringPolicies
            .map((p) => p.companyId)
            .filter((id): id is string => id != null),
        ),
      ];

      const brokerRepo =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'broker',
        );
      const brokers = await brokerRepo.find({
        where: { id: { in: brokerIds } },
      });
      const brokerMap = new Map(brokers.map((b) => [b.id, b]));

      const companyMap = new Map<string, string>();
      if (companyIds.length > 0) {
        const companyRepo =
          await this.twentyORMService.getRepositoryForWorkspace(
            workspaceId,
            'company',
          );
        const companies = await companyRepo.find({
          where: { id: { in: companyIds } },
        });
        for (const c of companies) {
          companyMap.set(c.id, c.name ?? 'Unbekannt');
        }
      }

      for (const policy of expiringPolicies) {
        if (!policy.endDate || !policy.brokerId) continue;

        const endDate = new Date(policy.endDate);
        const daysUntilExpiry = Math.round(
          (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (!REMINDER_DAYS.includes(daysUntilExpiry)) {
          continue;
        }

        const broker = brokerMap.get(policy.brokerId);
        if (!broker?.email) continue;

        const companyName = policy.companyId
          ? companyMap.get(policy.companyId) ?? 'Unbekannt'
          : 'Unbekannt';

        try {
          await this.notificationService.sendRenewalReminder({
            workspaceId,
            brokerEmail: broker.email,
            brokerName: broker.name,
            policyNumber: policy.policyNumber,
            companyName,
            renewalDate: endDate,
            daysUntilExpiry,
            premium: policy.premium?.amountMicros ?? null,
            currencyCode: policy.premium?.currencyCode ?? 'EUR',
          });
        } catch (error) {
          this.logger.error(
            `Error sending renewal reminder for policy ${policy.policyNumber}: ${error.message}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Error sending renewal reminders for workspace ${workspaceId}: ${error.message}`,
      );
    }
  }
}
