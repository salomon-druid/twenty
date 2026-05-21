import { Injectable, Logger } from '@nestjs/common';

import { TwentyORMService } from 'src/engine/twenty-orm/twenty-orm.service';

// Quote-to-Policy workflow for commercial/industrial insurance:
// draft → internal_review → sent_to_client →
// client_review → negotiation → bound →
// policy_issued → active

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ['internal_review', 'declined'],
  internal_review: ['sent_to_client', 'draft', 'declined'],
  sent_to_client: ['client_review', 'declined', 'expired'],
  client_review: ['negotiation', 'bound', 'declined', 'expired'],
  negotiation: ['bound', 'declined', 'expired'],
  bound: ['policy_issued'],
  policy_issued: ['active'],
  active: [],
  declined: [],
  expired: [],
};

const TERMINAL_STATUSES = ['active', 'declined', 'expired'];

@Injectable()
export class QuoteWorkflowService {
  private readonly logger = new Logger(QuoteWorkflowService.name);

  constructor(private readonly twentyORMService: TwentyORMService) {}

  async updateQuoteStatus(
    workspaceId: string,
    quoteId: string,
    newStatus: string,
  ): Promise<boolean> {
    try {
      const quoteRepository =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'quote',
        );

      const quote = await quoteRepository.findOne({
        where: { id: quoteId },
      });

      if (!quote) {
        this.logger.warn(`Quote ${quoteId} not found`);
        return false;
      }

      const allowedTransitions = VALID_TRANSITIONS[quote.status] || [];

      if (!allowedTransitions.includes(newStatus)) {
        this.logger.warn(
          `Invalid transition from ${quote.status} to ${newStatus} for quote ${quoteId}`,
        );
        return false;
      }

      await quoteRepository.update(quoteId, {
        status: newStatus,
      });

      this.logger.log(
        `Quote ${quoteId} status updated from ${quote.status} to ${newStatus}`,
      );

      return true;
    } catch (error) {
      this.logger.error(
        `Error updating quote status: ${error.message}`,
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
