import { Module } from '@nestjs/common';

import { RenewalGenerationService } from 'src/modules/insurance/services/renewal-generation.service';
import { RenewalStatusService } from 'src/modules/insurance/services/renewal-status.service';
import { RenewalScheduler } from 'src/modules/insurance/cron/renewal-scheduler.cron';
import { WorkspaceModule } from 'src/engine/core-modules/workspace/workspace.module';

@Module({
  imports: [WorkspaceModule],
  providers: [
    RenewalGenerationService,
    RenewalStatusService,
    RenewalScheduler,
  ],
  exports: [RenewalGenerationService, RenewalStatusService],
})
export class InsuranceModule {}
