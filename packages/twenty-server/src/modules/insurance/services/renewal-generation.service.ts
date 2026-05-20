import { Injectable, Logger } from '@nestjs/common';

import { TwentyORMService } from 'src/engine/twenty-orm/twenty-orm.service';

@Injectable()
export class RenewalGenerationService {
  private readonly logger = new Logger(RenewalGenerationService.name);

  constructor(private readonly twentyORMService: TwentyORMService) {}

  async generateUpcomingRenewals(workspaceId: string): Promise<number> {
    this.logger.log(
      `Generating upcoming renewals for workspace ${workspaceId}`,
    );

    try {
      const policyRepository =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'policy',
        );

      const renewalRepository =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'renewal',
        );

      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const expiringPolicies = await policyRepository.find({
        where: {
          endDate: {
            gte: now,
            lte: thirtyDaysFromNow,
          },
          status: 'active',
        },
      });

      let createdCount = 0;

      for (const policy of expiringPolicies) {
        const existingRenewal = await renewalRepository.findOne({
          where: { policyId: policy.id },
        });

        if (!existingRenewal) {
          await renewalRepository.save({
            renewalDate: policy.endDate,
            newPremium: policy.premium,
            status: 'pending',
            policyId: policy.id,
            brokerId: policy.brokerId,
          });
          createdCount++;
        }
      }

      this.logger.log(
        `Created ${createdCount} new renewals for workspace ${workspaceId}`,
      );

      return createdCount;
    } catch (error) {
      this.logger.error(
        `Error generating renewals for workspace ${workspaceId}: ${error.message}`,
      );
      return 0;
    }
  }
}
