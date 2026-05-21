import { Injectable, Logger } from '@nestjs/common';

import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { EmailService } from 'src/engine/core-modules/email/email.service';
import { TwentyORMService } from 'src/engine/twenty-orm/twenty-orm.service';

type RenewalReminderData = {
  workspaceId: string;
  brokerEmail: string;
  brokerName: string;
  policyNumber: string;
  companyName: string;
  renewalDate: Date;
  daysUntilExpiry: number;
  premium: number | null;
  currencyCode: string;
};

type ClaimUpdateData = {
  workspaceId: string;
  brokerEmail: string;
  brokerName: string;
  claimNumber: string;
  companyName: string;
  oldStatus: string;
  newStatus: string;
  claimAmount: number | null;
  currencyCode: string;
};

type PremiumDueData = {
  workspaceId: string;
  brokerEmail: string;
  brokerName: string;
  policyNumber: string;
  companyName: string;
  dueDate: Date;
  amount: number | null;
  currencyCode: string;
  isOverdue: boolean;
};

@Injectable()
export class InsuranceNotificationService {
  private readonly logger = new Logger(InsuranceNotificationService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly twentyORMService: TwentyORMService,
    private readonly twentyConfigService: TwentyConfigService,
  ) {}

  private getFromAddress(): string {
    const fromName = this.twentyConfigService.get('EMAIL_FROM_NAME') ?? 'Twenty';
    const fromAddress =
      this.twentyConfigService.get('EMAIL_FROM_ADDRESS') ?? 'no-reply@twenty.com';

    return `${fromName} <${fromAddress}>`;
  }

  async sendRenewalReminder(data: RenewalReminderData): Promise<void> {
    const subject =
      data.daysUntilExpiry <= 30
        ? `⚠️ Dringend: Police ${data.policyNumber} läuft in ${data.daysUntilExpiry} Tagen ab`
        : `Erinnerung: Police ${data.policyNumber} läuft in ${data.daysUntilExpiry} Tagen ab`;

    const body = `
Sehr geehrte/r ${data.brokerName},

dies ist eine Erinnerung an die bevorstehende Verlängerung folgender Police:

  Policennummer: ${data.policyNumber}
  Kunde: ${data.companyName}
  Verlängerungsdatum: ${data.renewalDate.toLocaleDateString('de-DE')}
  Tage bis Ablauf: ${data.daysUntilExpiry}
  ${data.premium ? `Prämie: ${(data.premium / 100).toFixed(2)} ${data.currencyCode}` : ''}

${data.daysUntilExpiry <= 30 ? '⚠️ Diese Police läuft in weniger als 30 Tagen ab. Bitte umgehend Maßnahmen ergreifen.' : 'Bitte planen Sie die Verlängerung rechtzeitig ein.'}

Mit freundlichen Grüßen
Ihr Versicherungsmanagement-System
    `.trim();

    try {
      await this.emailService.send({
        from: this.getFromAddress(),
        to: data.brokerEmail,
        subject,
        text: body,
      });
      this.logger.log(
        `Renewal reminder sent to ${data.brokerEmail} for policy ${data.policyNumber}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send renewal reminder: ${error.message}`,
      );
    }
  }

  async sendClaimUpdate(data: ClaimUpdateData): Promise<void> {
    const subject = `Schaden ${data.claimNumber} — Status geändert zu: ${data.newStatus}`;

    const body = `
Sehr geehrte/r ${data.brokerName},

der Status des folgenden Schadens wurde geändert:

  Schadensnummer: ${data.claimNumber}
  Kunde: ${data.companyName}
  Vorheriger Status: ${data.oldStatus}
  Neuer Status: ${data.newStatus}
  ${data.claimAmount ? `Schadenbetrag: ${(data.claimAmount / 100).toFixed(2)} ${data.currencyCode}` : ''}

Bitte prüfen Sie den aktuellen Stand und ergreifen Sie ggf. weitere Maßnahmen.

Mit freundlichen Grüßen
Ihr Versicherungsmanagement-System
    `.trim();

    try {
      await this.emailService.send({
        from: this.getFromAddress(),
        to: data.brokerEmail,
        subject,
        text: body,
      });
      this.logger.log(
        `Claim update sent to ${data.brokerEmail} for claim ${data.claimNumber}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send claim update: ${error.message}`,
      );
    }
  }

  async sendPremiumDueReminder(data: PremiumDueData): Promise<void> {
    const subject = data.isOverdue
      ? `⚠️ Überfällig: Prämienzahlung für Police ${data.policyNumber}`
      : `Erinnerung: Prämienzahlung fällig für Police ${data.policyNumber}`;

    const body = `
Sehr geehrte/r ${data.brokerName},

${data.isOverdue ? 'die folgende Prämienzahlung ist überfällig' : 'die folgende Prämienzahlung ist bald fällig'}:

  Policennummer: ${data.policyNumber}
  Kunde: ${data.companyName}
  Fälligkeitsdatum: ${data.dueDate.toLocaleDateString('de-DE')}
  ${data.amount ? `Betrag: ${(data.amount / 100).toFixed(2)} ${data.currencyCode}` : ''}

${data.isOverdue ? '⚠️ Diese Zahlung ist überfällig. Bitte umgehend Maßnahmen ergreifen.' : 'Bitte stellen Sie sicher, dass die Zahlung rechtzeitig erfolgt.'}

Mit freundlichen Grüßen
Ihr Versicherungsmanagement-System
    `.trim();

    try {
      await this.emailService.send({
        from: this.getFromAddress(),
        to: data.brokerEmail,
        subject,
        text: body,
      });
      this.logger.log(
        `Premium reminder sent to ${data.brokerEmail} for policy ${data.policyNumber}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send premium reminder: ${error.message}`,
      );
    }
  }

  async sendTaskReminder(
    workspaceId: string,
    taskTitle: string,
    dueDate: Date,
    assignedToEmail: string,
    assignedToName: string,
  ): Promise<void> {
    const subject = `Aufgabenerinnerung: ${taskTitle}`;

    const body = `
Sehr geehrte/r ${assignedToName},

die folgende Aufgabe ist fällig:

  Aufgabe: ${taskTitle}
  Fälligkeitsdatum: ${dueDate.toLocaleDateString('de-DE')}

Bitte erledigen Sie diese Aufgabe rechtzeitig.

Mit freundlichen Grüßen
Ihr Versicherungsmanagement-System
    `.trim();

    try {
      await this.emailService.send({
        from: this.getFromAddress(),
        to: assignedToEmail,
        subject,
        text: body,
      });
      this.logger.log(
        `Task reminder sent to ${assignedToEmail} for task ${taskTitle}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send task reminder: ${error.message}`,
      );
    }
  }
}
