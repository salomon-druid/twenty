import { Injectable, Logger } from '@nestjs/common';

import { TwentyORMService } from 'src/engine/twenty-orm/twenty-orm.service';

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['contacted', 'expired'],
  contacted: ['negotiated', 'expired'],
  negotiated: ['renewed', 'expired'],
  renewed: [],
  expired: [],
};

@Injectable()
export class RenewalStatusService {
  private readonly logger = new Logger(RenewalStatusService.name);

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
}
