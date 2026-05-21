import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { RenewalGenerationService } from 'src/modules/insurance/services/renewal-generation.service';
import { InsuranceNotificationService } from 'src/modules/insurance/services/insurance-notification.service';
import { WorkspaceService } from 'src/engine/core-modules/workspace/services/workspace.service';
import { TwentyORMService } from 'src/engine/twenty-orm/twenty-orm.service';

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
      const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

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

      for (const policy of expiringPolicies) {
        if (!policy.endDate || !policy.brokerId) continue;

        const endDate = new Date(policy.endDate);
        const daysUntilExpiry = Math.ceil(
          (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        // Send reminders at 90 and 30 days
        if (daysUntilExpiry === 90 || daysUntilExpiry === 30) {
          try {
            const brokerRepo =
              await this.twentyORMService.getRepositoryForWorkspace(
                workspaceId,
                'broker',
              );
            const broker = await brokerRepo.findOne({
              where: { id: policy.brokerId },
            });

            if (!broker?.email) continue;

            // Get company name
            let companyName = 'Unbekannt';
            if (policy.companyId) {
              const companyRepo =
                await this.twentyORMService.getRepositoryForWorkspace(
                  workspaceId,
                  'company',
                );
              const company = await companyRepo.findOne({
                where: { id: policy.companyId },
              });
              companyName = company?.name ?? 'Unbekannt';
            }

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
      }
    } catch (error) {
      this.logger.error(
        `Error sending renewal reminders for workspace ${workspaceId}: ${error.message}`,
      );
    }
  }
}
