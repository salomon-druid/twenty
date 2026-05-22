import { Module } from '@nestjs/common';

import { RenewalGenerationService } from 'src/modules/insurance/services/renewal-generation.service';
import { RenewalStatusService } from 'src/modules/insurance/services/renewal-status.service';
import { EnhancedRenewalWorkflowService } from 'src/modules/insurance/services/enhanced-renewal-workflow.service';
import { ClaimsWorkflowService } from 'src/modules/insurance/services/claims-workflow.service';
import { QuoteWorkflowService } from 'src/modules/insurance/services/quote-workflow.service';
import { InsuranceNotificationService } from 'src/modules/insurance/services/insurance-notification.service';
import { BrokerDashboardService } from 'src/modules/insurance/services/broker-dashboard.service';
import { ReinsuranceService } from 'src/modules/insurance/services/reinsurance.service';
import { ClientDashboardService } from 'src/modules/insurance/services/client-dashboard.service';
import { ReportsService } from 'src/modules/insurance/services/reports.service';
import { RenewalScheduler } from 'src/modules/insurance/cron/renewal-scheduler.cron';
import { EnhancedRenewalScheduler } from 'src/modules/insurance/cron/enhanced-renewal-scheduler.cron';
import { WorkspaceModule } from 'src/engine/core-modules/workspace/workspace.module';

@Module({
  imports: [WorkspaceModule],
  providers: [
    RenewalGenerationService,
    RenewalStatusService,
    EnhancedRenewalWorkflowService,
    ClaimsWorkflowService,
    QuoteWorkflowService,
    InsuranceNotificationService,
    BrokerDashboardService,
    ReinsuranceService,
    ClientDashboardService,
    ReportsService,
    RenewalScheduler,
    EnhancedRenewalScheduler,
  ],
  exports: [
    RenewalGenerationService,
    RenewalStatusService,
    EnhancedRenewalWorkflowService,
    ClaimsWorkflowService,
    QuoteWorkflowService,
    InsuranceNotificationService,
    BrokerDashboardService,
    ReinsuranceService,
    ClientDashboardService,
    ReportsService,
  ],
})
export class InsuranceModule {}
