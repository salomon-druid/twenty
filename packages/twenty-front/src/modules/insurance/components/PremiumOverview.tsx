import { t } from '@lingui/core/macro';

import { Premium } from '@/insurance/types/Premium';

type PremiumStats = {
  totalPremiums: number;
  paidPremiums: number;
  unpaidPremiums: number;
  overduePremiums: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  overdueAmount: number;
};

type PremiumOverviewProps = {
  stats: PremiumStats;
  premiums: Premium[];
};

export function PremiumOverview({ stats, premiums }: PremiumOverviewProps) {
  const paymentRate =
    stats.totalPremiums > 0
      ? Math.round((stats.paidPremiums / stats.totalPremiums) * 100)
      : 0;

  return (
    <div>
      <h2>{t`Premium Overview`}</h2>

      <div>
        <div>
          <h3>{t`Total Premiums`}</h3>
          <span>{stats.totalPremiums}</span>
        </div>
        <div>
          <h3>{t`Paid`}</h3>
          <span>{stats.paidPremiums}</span>
        </div>
        <div>
          <h3>{t`Unpaid`}</h3>
          <span>{stats.unpaidPremiums}</span>
        </div>
        <div>
          <h3>{t`Overdue`}</h3>
          <span>{stats.overduePremiums}</span>
        </div>
      </div>

      <div>
        <h3>{t`Payment Rate`}</h3>
        <span>{paymentRate}%</span>
      </div>

      <div>
        <h3>{t`Financial Summary`}</h3>
        <div>
          <span>{t`Total Amount:`}</span>
          <span>{(stats.totalAmount / 100).toFixed(2)} EUR</span>
        </div>
        <div>
          <span>{t`Paid Amount:`}</span>
          <span>{(stats.paidAmount / 100).toFixed(2)} EUR</span>
        </div>
        <div>
          <span>{t`Outstanding:`}</span>
          <span>{(stats.unpaidAmount / 100).toFixed(2)} EUR</span>
        </div>
        <div>
          <span>{t`Overdue:`}</span>
          <span>{(stats.overdueAmount / 100).toFixed(2)} EUR</span>
        </div>
      </div>

      <div>
        <h3>{t`Recent Premiums`}</h3>
        {premiums.slice(0, 10).map((premium) => (
          <div key={premium.id}>
            <span>
              {premium.amount
                ? `${(premium.amount.amountMicros ?? 0) / 1000000} ${premium.amount.currencyCode}`
                : t`N/A`}
            </span>
            <span>{premium.paymentStatus}</span>
            <span>{premium.dueDate ?? t`No due date`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export type { PremiumStats };
