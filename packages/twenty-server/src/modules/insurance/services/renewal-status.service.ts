import { Injectable, Logger } from '@nestjs/common';

import { TwentyORMService } from 'src/engine/twenty-orm/twenty-orm.service';

/**
 * @deprecated Use EnhancedRenewalWorkflowService instead.
 * This service is kept for backward compatibility and delegates
 * to the enhanced workflow for all status transitions.
 */
@Injectable()
export class RenewalStatusService {
  private readonly logger = new Logger(RenewalStatusService.name);

  // Original simple workflow statuses (kept for reference):
  // pending → contacted → negotiated → renewed/expired

  constructor(private readonly twentyORMService: TwentyORMService) {}

  /**
   * Maps old renewal statuses to the enhanced workflow equivalents.
   */
  private mapLegacyStatus(status: string): string {
    switch (status) {
      case 'pending':
        return 'draft';
      case 'contacted':
        return 'market_research';
      case 'negotiated':
        return 'negotiation';
      case 'renewed':
        return 'renewed';
      case 'expired':
        return 'expired';
      default:
        return status;
    }
  }

  async updateRenewalStatus(
    workspaceId: string,
    renewalId: string,
    newStatus: string,
  ): Promise<boolean> {
    this.logger.warn(
      `RenewalStatusService is deprecated. Use EnhancedRenewalWorkflowService for workspace ${workspaceId}.`,
    );

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

      // Map old status to enhanced workflow status
      const mappedStatus = this.mapLegacyStatus(newStatus);

      // Validate the transition using enhanced workflow rules
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

      const currentMapped = this.mapLegacyStatus(renewal.status);
      const allowedTransitions = VALID_TRANSITIONS[currentMapped] || [];

      if (!allowedTransitions.includes(mappedStatus)) {
        this.logger.warn(
          `Invalid transition from ${renewal.status} (mapped: ${currentMapped}) to ${newStatus} (mapped: ${mappedStatus}) for renewal ${renewalId}`,
        );
        return false;
      }

      await renewalRepository.update(renewalId, {
        status: mappedStatus,
      });

      this.logger.log(
        `Renewal ${renewalId} status updated from ${renewal.status} to ${mappedStatus}`,
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
    const mapped = this.mapLegacyStatus(currentStatus);

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

    return VALID_TRANSITIONS[mapped] || [];
  }
}
