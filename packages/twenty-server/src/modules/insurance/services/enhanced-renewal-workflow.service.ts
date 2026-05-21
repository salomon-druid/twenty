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

// Map old (Phase 1) renewal statuses to enhanced workflow equivalents
const LEGACY_STATUS_MAP: Record<string, string> = {
  pending: 'draft',
  contacted: 'market_research',
  negotiated: 'negotiation',
  renewed: 'renewed',
  expired: 'expired',
};

const TERMINAL_STATUSES = ['renewed', 'expired'];

@Injectable()
export class EnhancedRenewalWorkflowService {
  private readonly logger = new Logger(EnhancedRenewalWorkflowService.name);

  constructor(private readonly twentyORMService: TwentyORMService) {}

  /**
   * Maps legacy renewal statuses to the enhanced workflow equivalents.
   * Used when reading existing data from the database.
   */
  static mapLegacyStatus(status: string): string {
    return LEGACY_STATUS_MAP[status] ?? status;
  }

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

      // Map legacy status to enhanced workflow status
      const currentStatus = EnhancedRenewalWorkflowService.mapLegacyStatus(
        renewal.status,
      );
      const targetStatus = EnhancedRenewalWorkflowService.mapLegacyStatus(
        newStatus,
      );

      const allowedTransitions = VALID_TRANSITIONS[currentStatus] || [];

      if (!allowedTransitions.includes(targetStatus)) {
        this.logger.warn(
          `Invalid transition from ${renewal.status} (mapped: ${currentStatus}) to ${newStatus} (mapped: ${targetStatus}) for renewal ${renewalId}`,
        );
        return false;
      }

      await renewalRepository.update(renewalId, {
        status: targetStatus,
      });

      this.logger.log(
        `Renewal ${renewalId} status updated from ${renewal.status} to ${targetStatus}`,
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
    const mapped =
      EnhancedRenewalWorkflowService.mapLegacyStatus(currentStatus);

    return VALID_TRANSITIONS[mapped] || [];
  }

  isTerminalStatus(status: string): boolean {
    const mapped =
      EnhancedRenewalWorkflowService.mapLegacyStatus(status);

    return TERMINAL_STATUSES.includes(mapped);
  }

  getAllStatuses(): string[] {
    return Object.keys(VALID_TRANSITIONS);
  }
}
