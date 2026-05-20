import { Injectable, Logger } from '@nestjs/common';

import { isDefined } from 'twenty-shared/utils';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { PolicyWorkspaceEntity } from 'src/modules/insurance/standard-objects/policy.workspace-entity';
import { RenewalWorkspaceEntity } from 'src/modules/insurance/standard-objects/renewal.workspace-entity';

@Injectable()
export class RenewalGenerationService {
  private readonly logger = new Logger(RenewalGenerationService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  async generateUpcomingRenewals(workspaceId: string): Promise<number> {
    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const policyRepository =
          await this.globalWorkspaceOrmManager.getRepository(
            workspaceId,
            PolicyWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const renewalRepository =
          await this.globalWorkspaceOrmManager.getRepository(
            workspaceId,
            RenewalWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        const expiringPolicies = await policyRepository.find({
          where: {
            endDate: {
              gte: now.toISOString(),
              lte: thirtyDaysFromNow.toISOString(),
            },
          },
        });

        if (expiringPolicies.length === 0) {
          this.logger.log(
            `No policies expiring in the next 30 days for workspace ${workspaceId}`,
          );

          return 0;
        }

        let createdCount = 0;

        for (const policy of expiringPolicies) {
          if (!isDefined(policy.id)) {
            continue;
          }

          const existingRenewal = await renewalRepository.findOne({
            where: { policyId: policy.id },
          });

          if (isDefined(existingRenewal)) {
            continue;
          }

          const renewalDate = policy.endDate ?? new Date();
          const premiumAmount = policy.premium?.amount;
          const currencyCode = policy.premium?.currencyCode;

          await renewalRepository.save({
            renewalDate,
            newPremium: isDefined(premiumAmount)
              ? { amount: premiumAmount, currencyCode: currencyCode ?? 'USD' }
              : null,
            status: 'pending',
            policyId: policy.id,
            brokerId: policy.brokerId,
          });

          createdCount++;
        }

        this.logger.log(
          `Created ${createdCount} renewal(s) for workspace ${workspaceId}`,
        );

        return createdCount;
      },
      authContext,
    );
  }
}
