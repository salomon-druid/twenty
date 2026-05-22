import { t } from '@lingui/core/macro';

type ReinsuranceSummary = {
  totalTreaties: number;
  activeTreaties: number;
  expiringTreaties: number;
  totalCededAmount: number;
  totalCommission: number;
  treatiesByType: Record<string, number>;
  treatiesByReinsurer: Record<string, number>;
};

type TreatyAlert = {
  treatyId: string;
  treatyNumber: string;
  type: 'expiring' | 'expired';
  validTo: string | null;
  daysRemaining: number | null;
};

type ReinsuranceDashboardProps = {
  summary: ReinsuranceSummary;
  alerts: TreatyAlert[];
};

function formatCurrency(amountMicros: number, currencyCode = 'EUR'): string {
  return `${(amountMicros / 1000000).toFixed(2)} ${currencyCode}`;
}

export function ReinsuranceDashboard({
  summary,
  alerts,
}: ReinsuranceDashboardProps) {
  return (
    <div>
      <h2>{t`Reinsurance Overview`}</h2>

      {/* Summary Cards */}
      <div>
        <div>
          <span>{t`Total Treaties`}</span>
          <span>{summary.totalTreaties}</span>
        </div>
        <div>
          <span>{t`Active Treaties`}</span>
          <span>{summary.activeTreaties}</span>
        </div>
        <div>
          <span>{t`Expiring Treaties`}</span>
          <span>{summary.expiringTreaties}</span>
        </div>
        <div>
          <span>{t`Total Ceded Amount`}</span>
          <span>{formatCurrency(summary.totalCededAmount)}</span>
        </div>
        <div>
          <span>{t`Total Commission`}</span>
          <span>{summary.totalCommission}%</span>
        </div>
      </div>

      {/* Treaty Alerts */}
      <div>
        <h3>{t`Treaty Alerts`}</h3>
        {alerts.length === 0 ? (
          <p>{t`No treaty alerts.`}</p>
        ) : (
          alerts.map((alert) => (
            <div key={alert.treatyId}>
              <span>{alert.treatyNumber}</span>
              <span>
                {alert.type === 'expired'
                  ? t`Expired`
                  : t`Expiring in ${alert.daysRemaining} days`}
              </span>
              <span>{alert.validTo ?? t`N/A`}</span>
            </div>
          ))
        )}
      </div>

      {/* Treaties by Type */}
      {Object.keys(summary.treatiesByType).length > 0 && (
        <div>
          <h3>{t`Treaties by Type`}</h3>
          {Object.entries(summary.treatiesByType).map(([type, count]) => (
            <div key={type}>
              <span>{type}</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Treaties by Reinsurer */}
      {Object.keys(summary.treatiesByReinsurer).length > 0 && (
        <div>
          <h3>{t`Treaties by Reinsurer`}</h3>
          {Object.entries(summary.treatiesByReinsurer).map(
            ([reinsurer, count]) => (
              <div key={reinsurer}>
                <span>{reinsurer}</span>
                <span>{count}</span>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}

export type { ReinsuranceSummary, TreatyAlert };
