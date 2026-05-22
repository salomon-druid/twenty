import { t } from '@lingui/core/macro';

import { Policy } from '@/insurance/types/Policy';
import { Claim } from '@/insurance/types/Claim';
import { Premium } from '@/insurance/types/Premium';
import { Renewal } from '@/insurance/types/Renewal';
import { Reinsurance } from '@/insurance/types/Reinsurance';

type PolicyDetailProps = {
  policy: Policy;
  claims: Claim[];
  premiums: Premium[];
  renewals: Renewal[];
  reinsurances: Reinsurance[];
  onEdit: () => void;
  onNewClaim: () => void;
  onNewRenewal: () => void;
};

function formatCurrency(amountMicros: number | null, currencyCode = 'EUR'): string {
  if (amountMicros == null) return t`N/A`;
  return `${(amountMicros / 1000000).toFixed(2)} ${currencyCode}`;
}

function formatDate(date: string | null): string {
  if (!date) return t`N/A`;
  return new Date(date).toLocaleDateString('de-DE');
}

export function PolicyDetail({
  policy,
  claims,
  premiums,
  renewals,
  reinsurances,
  onEdit,
  onNewClaim,
  onNewRenewal,
}: PolicyDetailProps) {
  const openClaims = claims.filter(
    (c) => c.status !== 'closed' && c.status !== 'rejected',
  );
  const totalPremiumPaid = premiums
    .filter((p) => p.paymentStatus === 'paid')
    .reduce((sum, p) => sum + (p.amount?.amountMicros ?? 0), 0);
  const totalPremiumUnpaid = premiums
    .filter((p) => p.paymentStatus === 'unpaid' || p.paymentStatus === 'overdue')
    .reduce((sum, p) => sum + (p.amount?.amountMicros ?? 0), 0);
  const totalCeded = reinsurances.reduce(
    (sum, r) => sum + (r.cededAmount?.amountMicros ?? 0),
    0,
  );
  const activeRenewals = renewals.filter(
    (r) => r.status !== 'renewed' && r.status !== 'expired',
  );

  return (
    <div>
      <div>
        <h2>{policy.policyNumber}</h2>
        <span>{policy.status}</span>
        <button onClick={onEdit}>{t`Edit`}</button>
      </div>

      {/* Quick Actions */}
      <div>
        <button onClick={onNewClaim}>{t`New Claim`}</button>
        <button onClick={onNewRenewal}>{t`New Renewal`}</button>
      </div>

      {/* Summary Cards */}
      <div>
        <div>
          <span>{t`Policy Type`}</span>
          <span>{policy.policyType ?? t`N/A`}</span>
        </div>
        <div>
          <span>{t`Insurer`}</span>
          <span>{policy.insurer ?? t`N/A`}</span>
        </div>
        <div>
          <span>{t`Sum Insured`}</span>
          <span>{formatCurrency(policy.sumInsured?.amountMicros ?? null, policy.sumInsured?.currencyCode)}</span>
        </div>
        <div>
          <span>{t`Deductible`}</span>
          <span>{formatCurrency(policy.deductible?.amountMicros ?? null, policy.deductible?.currencyCode)}</span>
        </div>
        <div>
          <span>{t`Premium`}</span>
          <span>{formatCurrency(policy.premium?.amountMicros ?? null, policy.premium?.currencyCode)}</span>
        </div>
        <div>
          <span>{t`Brokerage Rate`}</span>
          <span>{policy.brokerageRate != null ? `${policy.brokerageRate}%` : t`N/A`}</span>
        </div>
      </div>

      {/* Coverage Period */}
      <div>
        <h3>{t`Coverage Period`}</h3>
        <div>
          <span>{t`Start Date`}</span>
          <span>{formatDate(policy.startDate)}</span>
        </div>
        <div>
          <span>{t`End Date`}</span>
          <span>{formatDate(policy.endDate)}</span>
        </div>
        <div>
          <span>{t`Payment Terms`}</span>
          <span>{policy.paymentTerms ?? t`N/A`}</span>
        </div>
        <div>
          <span>{t`Invoice Number`}</span>
          <span>{policy.invoiceNumber ?? t`N/A`}</span>
        </div>
      </div>

      {/* Commercial/Industrial Details */}
      <div>
        <h3>{t`Commercial Details`}</h3>
        <div>
          <span>{t`Industry Code`}</span>
          <span>{policy.industryCode ?? t`N/A`}</span>
        </div>
        <div>
          <span>{t`Employee Count`}</span>
          <span>{policy.employeeCount ?? t`N/A`}</span>
        </div>
        <div>
          <span>{t`Annual Revenue`}</span>
          <span>{formatCurrency(policy.annualRevenue?.amountMicros ?? null, policy.annualRevenue?.currencyCode)}</span>
        </div>
        <div>
          <span>{t`Underwriter`}</span>
          <span>{policy.underwriter ?? t`N/A`}</span>
        </div>
        <div>
          <span>{t`Co-Insurance`}</span>
          <span>{policy.coInsurance != null ? `${policy.coInsurance}%` : t`N/A`}</span>
        </div>
      </div>

      {/* Claims Summary */}
      <div>
        <h3>{t`Claims (${openClaims.length} ${t`open`})`}</h3>
        {claims.length === 0 ? (
          <p>{t`No claims for this policy.`}</p>
        ) : (
          claims.map((claim) => (
            <div key={claim.id}>
              <span>{claim.claimNumber}</span>
              <span>{claim.status}</span>
              <span>{formatCurrency(claim.amount?.amountMicros ?? null, claim.amount?.currencyCode)}</span>
              <span>{formatDate(claim.date)}</span>
            </div>
          ))
        )}
      </div>

      {/* Premium Summary */}
      <div>
        <h3>{t`Premium Payments`}</h3>
        <div>
          <span>{t`Total Paid`}</span>
          <span>{formatCurrency(totalPremiumPaid)}</span>
        </div>
        <div>
          <span>{t`Total Unpaid`}</span>
          <span>{formatCurrency(totalPremiumUnpaid)}</span>
        </div>
        <div>
          <span>{t`Total Premiums`}</span>
          <span>{premiums.length}</span>
        </div>
      </div>

      {/* Reinsurance Summary */}
      <div>
        <h3>{t`Reinsurance`}</h3>
        {reinsurances.length === 0 ? (
          <p>{t`No reinsurance treaties for this policy.`}</p>
        ) : (
          <>
            <div>
              <span>{t`Total Ceded Amount`}</span>
              <span>{formatCurrency(totalCeded)}</span>
            </div>
            {reinsurances.map((r) => (
              <div key={r.id}>
                <span>{r.treatyNumber}</span>
                <span>{r.type}</span>
                <span>{r.reinsurer}</span>
                <span>{r.cededPercentage != null ? `${r.cededPercentage}%` : t`N/A`}</span>
                <span>{formatCurrency(r.cededAmount?.amountMicros ?? null, r.cededAmount?.currencyCode)}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Renewal Summary */}
      <div>
        <h3>{t`Renewals (${activeRenewals.length} ${t`active`})`}</h3>
        {renewals.length === 0 ? (
          <p>{t`No renewals for this policy.`}</p>
        ) : (
          renewals.map((renewal) => (
            <div key={renewal.id}>
              <span>{formatDate(renewal.renewalDate)}</span>
              <span>{renewal.status}</span>
              {renewal.newPremium && (
                <span>{formatCurrency(renewal.newPremium.amountMicros, renewal.newPremium.currencyCode ?? 'EUR')}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
