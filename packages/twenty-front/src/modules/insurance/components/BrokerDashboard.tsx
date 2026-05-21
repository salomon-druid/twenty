import { t } from '@lingui/core/macro';

type BrokerDashboardMetrics = {
  totalPolicies: number;
  activePolicies: number;
  expiring30Days: number;
  expiring60Days: number;
  expiring90Days: number;
  totalPremiumVolume: number;
  totalClaims: number;
  openClaims: number;
  totalClaimAmount: number;
  openClaimAmount: number;
  totalCommission: number;
  pendingCommission: number;
  openTasks: number;
  overdueTasks: number;
  totalClients: number;
};

type BrokerDashboardProps = {
  metrics: BrokerDashboardMetrics;
};

function formatCurrency(amountMicros: number, currencyCode = 'EUR'): string {
  return `${(amountMicros / 1000000).toFixed(2)} ${currencyCode}`;
}

export function BrokerDashboard({ metrics }: BrokerDashboardProps) {
  return (
    <div>
      <h2>{t`Broker Dashboard`}</h2>

      {/* Portfolio Overview */}
      <div>
        <h3>{t`Portfolio Overview`}</h3>
        <div>
          <div>
            <span>{t`Total Policies`}</span>
            <span>{metrics.totalPolicies}</span>
          </div>
          <div>
            <span>{t`Active Policies`}</span>
            <span>{metrics.activePolicies}</span>
          </div>
          <div>
            <span>{t`Expiring in 30 Days`}</span>
            <span>{metrics.expiring30Days}</span>
          </div>
          <div>
            <span>{t`Expiring in 60 Days`}</span>
            <span>{metrics.expiring60Days}</span>
          </div>
          <div>
            <span>{t`Expiring in 90 Days`}</span>
            <span>{metrics.expiring90Days}</span>
          </div>
          <div>
            <span>{t`Total Premium Volume`}</span>
            <span>{formatCurrency(metrics.totalPremiumVolume)}</span>
          </div>
        </div>
      </div>

      {/* Claims Overview */}
      <div>
        <h3>{t`Claims Overview`}</h3>
        <div>
          <div>
            <span>{t`Total Claims`}</span>
            <span>{metrics.totalClaims}</span>
          </div>
          <div>
            <span>{t`Open Claims`}</span>
            <span>{metrics.openClaims}</span>
          </div>
          <div>
            <span>{t`Total Claim Amount`}</span>
            <span>{formatCurrency(metrics.totalClaimAmount)}</span>
          </div>
          <div>
            <span>{t`Open Claim Amount`}</span>
            <span>{formatCurrency(metrics.openClaimAmount)}</span>
          </div>
        </div>
      </div>

      {/* Revenue Overview */}
      <div>
        <h3>{t`Revenue Overview`}</h3>
        <div>
          <div>
            <span>{t`Total Commission`}</span>
            <span>{formatCurrency(metrics.totalCommission)}</span>
          </div>
          <div>
            <span>{t`Pending Commission`}</span>
            <span>{formatCurrency(metrics.pendingCommission)}</span>
          </div>
        </div>
      </div>

      {/* Task Overview */}
      <div>
        <h3>{t`Task Overview`}</h3>
        <div>
          <div>
            <span>{t`Open Tasks`}</span>
            <span>{metrics.openTasks}</span>
          </div>
          <div>
            <span>{t`Overdue Tasks`}</span>
            <span>{metrics.overdueTasks}</span>
          </div>
        </div>
      </div>

      {/* Client Overview */}
      <div>
        <h3>{t`Client Overview`}</h3>
        <div>
          <div>
            <span>{t`Total Clients`}</span>
            <span>{metrics.totalClients}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { BrokerDashboardMetrics };
