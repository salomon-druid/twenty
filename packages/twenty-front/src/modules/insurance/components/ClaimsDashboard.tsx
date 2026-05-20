import { t } from '@lingui/core/macro';

import { Claim } from '@/insurance/types/Claim';

type ClaimsStats = {
  totalClaims: number;
  openClaims: number;
  closedClaims: number;
  pendingClaims: number;
  totalAmount: number;
  openAmount: number;
};

type ClaimsDashboardProps = {
  stats: ClaimsStats;
  claims: Claim[];
};

export function ClaimsDashboard({ stats, claims }: ClaimsDashboardProps) {
  return (
    <div>
      <h2>{t`Claims Dashboard`}</h2>

      <div>
        <div>
          <h3>{t`Total Claims`}</h3>
          <span>{stats.totalClaims}</span>
        </div>
        <div>
          <h3>{t`Open`}</h3>
          <span>{stats.openClaims}</span>
        </div>
        <div>
          <h3>{t`Pending`}</h3>
          <span>{stats.pendingClaims}</span>
        </div>
        <div>
          <h3>{t`Closed`}</h3>
          <span>{stats.closedClaims}</span>
        </div>
      </div>

      <div>
        <h3>{t`Financial Overview`}</h3>
        <div>
          <span>{t`Total Amount:`}</span>
          <span>{(stats.totalAmount / 100).toFixed(2)} EUR</span>
        </div>
        <div>
          <span>{t`Open Amount:`}</span>
          <span>{(stats.openAmount / 100).toFixed(2)} EUR</span>
        </div>
      </div>

      <div>
        <h3>{t`Recent Claims`}</h3>
        {claims.slice(0, 10).map((claim) => (
          <div key={claim.id}>
            <span>{claim.claimNumber}</span>
            <span>{claim.status}</span>
            <span>
              {claim.amount
                ? `${(claim.amount.amountMicros ?? 0) / 1000000} ${claim.amount.currencyCode}`
                : t`N/A`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export type { ClaimsStats };
