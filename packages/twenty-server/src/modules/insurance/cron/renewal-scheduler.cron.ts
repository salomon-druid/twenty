import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { RenewalGenerationService } from 'src/modules/insurance/services/renewal-generation.service';
import { WorkspaceService } from 'src/engine/core-modules/workspace/services/workspace.service';

@Injectable()
export class RenewalScheduler {
  private readonly logger = new Logger(RenewalScheduler.name);

  constructor(
    private readonly renewalGenerationService: RenewalGenerationService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyRenewalGeneration() {
    this.logger.log('Starting daily renewal generation cron job');

    try {
      const workspaces = await this.workspaceService.getAllActive();

      for (const workspace of workspaces) {
        try {
          const count =
            await this.renewalGenerationService.generateUpcomingRenewals(
              workspace.id,
            );
          this.logger.log(
            `Workspace ${workspace.id}: generated ${count} renewals`,
          );
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
}
