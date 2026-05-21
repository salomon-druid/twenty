import { Injectable, Logger } from '@nestjs/common';

import { TwentyORMService } from 'src/engine/twenty-orm/twenty-orm.service';

// Enhanced renewal workflow for commercial/industrial insurance:
// draft → market_research → quote_requested → quotes_received →
// negotiation → client_review → bound → issued → active
//                                                     ↓
//                                               renewal_due → renewal_negotiation → renewed/expired

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ['market_research', 'expired'],
  market_research: ['quote_requested', 'expired'],
  quote_requested: ['quotes_received', 'expired'],
  quotes_received: ['negotiation', 'expired'],
  negotiation: ['client_review', 'expired'],
  client_review: ['bound', 'negotiation', 'expired'],
  bound: ['issued'],
  issued: ['active'],
  active: ['renewal_due'],
  renewal_due: ['renewal_negotiation', 'expired'],
  renewal_negotiation: ['renewed', 'expired'],
  renewed: [],
  expired: [],
};

const TERMINAL_STATUSES = ['renewed', 'expired'];

@Injectable()
export class EnhancedRenewalWorkflowService {
  private readonly logger = new Logger(EnhancedRenewalWorkflowService.name);

  constructor(private readonly twentyORMService: TwentyORMService) {}

  async updateRenewalStatus(
    workspaceId: string,
    renewalId: string,
    newStatus: string,
  ): Promise<boolean> {
    try {
      const renewalRepository =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'renewal',
        );

      const renewal = await renewalRepository.findOne({
        where: { id: renewalId },
      });

      if (!renewal) {
        this.logger.warn(`Renewal ${renewalId} not found`);
        return false;
      }

      const allowedTransitions = VALID_TRANSITIONS[renewal.status] || [];

      if (!allowedTransitions.includes(newStatus)) {
        this.logger.warn(
          `Invalid transition from ${renewal.status} to ${newStatus} for renewal ${renewalId}`,
        );
        return false;
      }

      await renewalRepository.update(renewalId, {
        status: newStatus,
      });

      this.logger.log(
        `Renewal ${renewalId} status updated from ${renewal.status} to ${newStatus}`,
      );

      return true;
    } catch (error) {
      this.logger.error(
        `Error updating renewal status: ${error.message}`,
      );
      return false;
    }
  }

  getValidTransitions(currentStatus: string): string[] {
    return VALID_TRANSITIONS[currentStatus] || [];
  }

  isTerminalStatus(status: string): boolean {
    return TERMINAL_STATUSES.includes(status);
  }

  getAllStatuses(): string[] {
    return Object.keys(VALID_TRANSITIONS);
  }
}
