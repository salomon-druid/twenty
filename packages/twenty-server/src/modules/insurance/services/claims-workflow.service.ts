import { Injectable, Logger } from '@nestjs/common';

import { TwentyORMService } from 'src/engine/twenty-orm/twenty-orm.service';

// Claims workflow for commercial/industrial insurance:
// reported → acknowledged → assigned → investigation →
// assessment → negotiation → settlement → payment → closed
//                                     ↓
//                               litigation → court → judgment → payment → closed
//                                     ↓
//                               recovery → subrogation → recovered → closed

const VALID_TRANSITIONS: Record<string, string[]> = {
  reported: ['acknowledged', 'closed'],
  acknowledged: ['assigned', 'closed'],
  assigned: ['investigation', 'closed'],
  investigation: ['assessment', 'closed'],
  assessment: ['negotiation', 'litigation', 'closed'],
  negotiation: ['settlement', 'litigation', 'closed'],
  settlement: ['payment', 'closed'],
  payment: ['closed'],
  litigation: ['court', 'settlement', 'closed'],
  court: ['judgment', 'settlement', 'closed'],
  judgment: ['payment', 'closed'],
  recovery: ['subrogation', 'closed'],
  subrogation: ['recovered', 'closed'],
  recovered: ['closed'],
  closed: [],
};

const TERMINAL_STATUSES = ['closed'];

@Injectable()
export class ClaimsWorkflowService {
  private readonly logger = new Logger(ClaimsWorkflowService.name);

  constructor(private readonly twentyORMService: TwentyORMService) {}

  async updateClaimStatus(
    workspaceId: string,
    claimId: string,
    newStatus: string,
  ): Promise<boolean> {
    try {
      const claimRepository =
        await this.twentyORMService.getRepositoryForWorkspace(
          workspaceId,
          'claim',
        );

      const claim = await claimRepository.findOne({
        where: { id: claimId },
      });

      if (!claim) {
        this.logger.warn(`Claim ${claimId} not found`);
        return false;
      }

      const allowedTransitions = VALID_TRANSITIONS[claim.status] || [];

      if (!allowedTransitions.includes(newStatus)) {
        this.logger.warn(
          `Invalid transition from ${claim.status} to ${newStatus} for claim ${claimId}`,
        );
        return false;
      }

      await claimRepository.update(claimId, {
        status: newStatus,
      });

      this.logger.log(
        `Claim ${claimId} status updated from ${claim.status} to ${newStatus}`,
      );

      return true;
    } catch (error) {
      this.logger.error(
        `Error updating claim status: ${error.message}`,
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
