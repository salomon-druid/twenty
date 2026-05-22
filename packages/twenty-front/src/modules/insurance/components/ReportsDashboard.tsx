import { t } from '@lingui/core/macro';

type PortfolioSummaryReport = {
  totalPolicies: number;
  activePolicies: number;
  policiesByType: Record<string, number>;
  totalPremiumVolume: number;
  expiring30Days: number;
  expiring60Days: number;
  expiring90Days: number;
};

type ClaimsAnalysisReport = {
  totalClaims: number;
  openClaims: number;
  closedClaims: number;
  totalClaimAmount: number;
  openClaimAmount: number;
  claimsByType: Record<string, number>;
  averageClaimAmount: number;
  claimsRatio: number;
};

type RevenueReport = {
  totalCommission: number;
  pendingCommission: number;
  paidCommission: number;
  commissionByPeriod: Record<string, number>;
};

type RenewalCalendarReport = {
  renewalsByMonth: Record<string, number>;
  upcomingRenewals: Array<{
    renewalId: string;
    policyNumber: string;
    renewalDate: string | null;
    status: string;
  }>;
};

type ReportsDashboardProps = {
  portfolio: PortfolioSummaryReport;
  claims: ClaimsAnalysisReport;
  revenue: RevenueReport;
  renewalCalendar: RenewalCalendarReport;
};

function formatCurrency(amountMicros: number, currencyCode = 'EUR'): string {
  return `${(amountMicros / 1000000).toFixed(2)} ${currencyCode}`;
}

export function ReportsDashboard({
  portfolio,
  claims,
  revenue,
  renewalCalendar,
}: ReportsDashboardProps) {
  return (
    <div>
      <h2>{t`Reports & Analytics`}</h2>

      {/* Portfolio Summary */}
      <div>
        <h3>{t`Portfolio Summary`}</h3>
        <div>
          <div>
            <span>{t`Total Policies`}</span>
            <span>{portfolio.totalPolicies}</span>
          </div>
          <div>
            <span>{t`Active Policies`}</span>
            <span>{portfolio.activePolicies}</span>
          </div>
          <div>
            <span>{t`Total Premium Volume`}</span>
            <span>{formatCurrency(portfolio.totalPremiumVolume)}</span>
          </div>
          <div>
            <span>{t`Expiring in 30 Days`}</span>
            <span>{portfolio.expiring30Days}</span>
          </div>
          <div>
            <span>{t`Expiring in 60 Days`}</span>
            <span>{portfolio.expiring60Days}</span>
          </div>
          <div>
            <span>{t`Expiring in 90 Days`}</span>
            <span>{portfolio.expiring90Days}</span>
          </div>
        </div>
        {Object.keys(portfolio.policiesByType).length > 0 && (
          <div>
            <h4>{t`Policies by Type`}</h4>
            {Object.entries(portfolio.policiesByType).map(([type, count]) => (
              <div key={type}>
                <span>{type}</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Claims Analysis */}
      <div>
        <h3>{t`Claims Analysis`}</h3>
        <div>
          <div>
            <span>{t`Total Claims`}</span>
            <span>{claims.totalClaims}</span>
          </div>
          <div>
            <span>{t`Open Claims`}</span>
            <span>{claims.openClaims}</span>
          </div>
          <div>
            <span>{t`Closed Claims`}</span>
            <span>{claims.closedClaims}</span>
          </div>
          <div>
            <span>{t`Total Claim Amount`}</span>
            <span>{formatCurrency(claims.totalClaimAmount)}</span>
          </div>
          <div>
            <span>{t`Open Claim Amount`}</span>
            <span>{formatCurrency(claims.openClaimAmount)}</span>
          </div>
          <div>
            <span>{t`Average Claim Amount`}</span>
            <span>{formatCurrency(claims.averageClaimAmount)}</span>
          </div>
          <div>
            <span>{t`Claims Ratio`}</span>
            <span>{claims.claimsRatio}%</span>
          </div>
        </div>
        {Object.keys(claims.claimsByType).length > 0 && (
          <div>
            <h4>{t`Claims by Type`}</h4>
            {Object.entries(claims.claimsByType).map(([type, count]) => (
              <div key={type}>
                <span>{type}</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revenue Report */}
      <div>
        <h3>{t`Revenue Report`}</h3>
        <div>
          <div>
            <span>{t`Total Commission`}</span>
            <span>{formatCurrency(revenue.totalCommission)}</span>
          </div>
          <div>
            <span>{t`Paid Commission`}</span>
            <span>{formatCurrency(revenue.paidCommission)}</span>
          </div>
          <div>
            <span>{t`Pending Commission`}</span>
            <span>{formatCurrency(revenue.pendingCommission)}</span>
          </div>
        </div>
        {Object.keys(revenue.commissionByPeriod).length > 0 && (
          <div>
            <h4>{t`Commission by Period`}</h4>
            {Object.entries(revenue.commissionByPeriod).map(
              ([period, amount]) => (
                <div key={period}>
                  <span>{period}</span>
                  <span>{formatCurrency(amount)}</span>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Renewal Calendar */}
      <div>
        <h3>{t`Renewal Calendar`}</h3>
        {Object.keys(renewalCalendar.renewalsByMonth).length > 0 && (
          <div>
            <h4>{t`Renewals by Month`}</h4>
            {Object.entries(renewalCalendar.renewalsByMonth)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([month, count]) => (
                <div key={month}>
                  <span>{month}</span>
                  <span>{count}</span>
                </div>
              ))}
          </div>
        )}
        <div>
          <h4>{t`Upcoming Renewals`}</h4>
          {renewalCalendar.upcomingRenewals.length === 0 ? (
            <p>{t`No upcoming renewals.`}</p>
          ) : (
            renewalCalendar.upcomingRenewals.map((renewal) => (
              <div key={renewal.renewalId}>
                <span>{renewal.policyNumber}</span>
                <span>{renewal.renewalDate ?? t`No date`}</span>
                <span>{renewal.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export type {
  PortfolioSummaryReport,
  ClaimsAnalysisReport,
  RevenueReport,
  RenewalCalendarReport,
};
