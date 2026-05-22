import { t } from '@lingui/core/macro';

import { Policy } from '@/insurance/types/Policy';
import { Claim } from '@/insurance/types/Claim';
import { RiskProfile } from '@/insurance/types/RiskProfile';
import { Premium } from '@/insurance/types/Premium';
import { Renewal } from '@/insurance/types/Renewal';
import { Site } from '@/insurance/types/Site';
import { InsuranceTask } from '@/insurance/types/InsuranceTask';

type ClientDashboardProps = {
  companyId: string;
  companyName: string;
  policies: Policy[];
  claims: Claim[];
  riskProfiles: RiskProfile[];
  premiums: Premium[];
  renewals: Renewal[];
  sites: Site[];
  tasks: InsuranceTask[];
};

function formatCurrency(amountMicros: number | null, currencyCode = 'EUR'): string {
  if (amountMicros == null) return t`N/A`;
  return `${(amountMicros / 1000000).toFixed(2)} ${currencyCode}`;
}

function isExpiringSoon(endDate: string | null): boolean {
  if (!endDate) return false;
  const end = new Date(endDate);
  const now = new Date();
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return end <= thirtyDays && end >= now;
}

export function ClientDashboard({
  companyName,
  policies,
  claims,
  riskProfiles,
  premiums,
  renewals,
  sites,
  tasks,
}: ClientDashboardProps) {
  const activePolicies = policies.filter((p) => p.status === 'active');
  const openClaims = claims.filter(
    (c) => c.status !== 'closed' && c.status !== 'rejected',
  );
  const totalPaid = premiums
    .filter((p) => p.paymentStatus === 'paid')
    .reduce((sum, p) => sum + (p.amount?.amountMicros ?? 0), 0);
  const totalUnpaid = premiums
    .filter((p) => p.paymentStatus === 'unpaid')
    .reduce((sum, p) => sum + (p.amount?.amountMicros ?? 0), 0);
  const totalOverdue = premiums
    .filter((p) => p.paymentStatus === 'overdue')
    .reduce((sum, p) => sum + (p.amount?.amountMicros ?? 0), 0);
  const openTasks = tasks.filter(
    (t) => t.status !== 'completed' && t.status !== 'cancelled',
  );
  const overdueTasks = openTasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date(),
  );
  const upcomingRenewals = renewals.filter(
    (r) => r.status !== 'renewed' && r.status !== 'expired',
  );

  return (
    <div>
      <h2>{t`Client Dashboard`}</h2>
      <p>{companyName}</p>

      {/* Summary Cards */}
      <div>
        <div>
          <span>{t`Policies`}</span>
          <span>{activePolicies.length} / {policies.length}</span>
        </div>
        <div>
          <span>{t`Open Claims`}</span>
          <span>{openClaims.length}</span>
        </div>
        <div>
          <span>{t`Open Tasks`}</span>
          <span>{openTasks.length} ({overdueTasks.length} {t`overdue`})</span>
        </div>
        <div>
          <span>{t`Upcoming Renewals`}</span>
          <span>{upcomingRenewals.length}</span>
        </div>
      </div>

      {/* Policies Section */}
      <div>
        <h3>{t`Policies`}</h3>
        {policies.length === 0 ? (
          <p>{t`No policies found.`}</p>
        ) : (
          policies.map((policy) => (
            <div key={policy.id}>
              <div>
                <span>{policy.policyNumber}</span>
                <span>{policy.type}</span>
                {isExpiringSoon(policy.endDate) && (
                  <span>{t`Expiring Soon`}</span>
                )}
              </div>
              <div>
                <span>{t`Status:`}</span>
                <span>{policy.status}</span>
              </div>
              <div>
                <span>{t`End Date:`}</span>
                <span>{policy.endDate ?? t`N/A`}</span>
              </div>
              <div>
                <span>{t`Premium:`}</span>
                <span>{formatCurrency(policy.premium?.amountMicros ?? null, policy.premium?.currencyCode)}</span>
              </div>
              {policy.policyType && (
                <div>
                  <span>{t`Policy Type:`}</span>
                  <span>{policy.policyType}</span>
                </div>
              )}
              {policy.insurer && (
                <div>
                  <span>{t`Insurer:`}</span>
                  <span>{policy.insurer}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Claims Section */}
      <div>
        <h3>{t`Claims History`}</h3>
        {claims.length === 0 ? (
          <p>{t`No claims found.`}</p>
        ) : (
          claims.map((claim) => (
            <div key={claim.id}>
              <div>
                <span>{claim.claimNumber}</span>
                <span>{claim.status}</span>
              </div>
              <div>
                <span>{t`Amount:`}</span>
                <span>{formatCurrency(claim.amount?.amountMicros ?? null, claim.amount?.currencyCode)}</span>
              </div>
              <div>
                <span>{t`Date:`}</span>
                <span>{claim.date ?? t`N/A`}</span>
              </div>
              {claim.claimType && (
                <div>
                  <span>{t`Claim Type:`}</span>
                  <span>{claim.claimType}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Risk Profile Section */}
      <div>
        <h3>{t`Risk Profile`}</h3>
        {riskProfiles.length === 0 ? (
          <p>{t`No risk profiles found.`}</p>
        ) : (
          riskProfiles.map((rp) => (
            <div key={rp.id}>
              <div>
                <span>{t`Risk Category:`}</span>
                <span>{rp.riskCategory}</span>
              </div>
              <div>
                <span>{t`Score:`}</span>
                <span>{rp.score ?? t`N/A`}</span>
              </div>
              <div>
                <span>{t`Assessment Date:`}</span>
                <span>{rp.assessmentDate ?? t`N/A`}</span>
              </div>
              {rp.notes && (
                <div>
                  <span>{t`Notes:`}</span>
                  <span>{rp.notes}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Premium Payment Status */}
      <div>
        <h3>{t`Premium Payment Status`}</h3>
        <div>
          <div>
            <span>{t`Total Paid`}</span>
            <span>{formatCurrency(totalPaid)}</span>
          </div>
          <div>
            <span>{t`Total Unpaid`}</span>
            <span>{formatCurrency(totalUnpaid)}</span>
          </div>
          <div>
            <span>{t`Total Overdue`}</span>
            <span>{formatCurrency(totalOverdue)}</span>
          </div>
          <div>
            <span>{t`Total Premiums`}</span>
            <span>{premiums.length}</span>
          </div>
        </div>
      </div>

      {/* Upcoming Renewals */}
      <div>
        <h3>{t`Upcoming Renewals`}</h3>
        {upcomingRenewals.length === 0 ? (
          <p>{t`No upcoming renewals.`}</p>
        ) : (
          upcomingRenewals.map((renewal) => (
            <div key={renewal.id}>
              <div>
                <span>{renewal.renewalDate ?? t`No date`}</span>
                <span>{renewal.status}</span>
              </div>
              {renewal.newPremium && (
                <div>
                  <span>{t`New Premium:`}</span>
                  <span>
                    {formatCurrency(
                      renewal.newPremium.amountMicros,
                      renewal.newPremium.currencyCode,
                    )}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Sites Section */}
      <div>
        <h3>{t`Sites`}</h3>
        {sites.length === 0 ? (
          <p>{t`No sites found.`}</p>
        ) : (
          sites.map((site) => (
            <div key={site.id}>
              <div>
                <span>{site.name}</span>
                <span>{site.type}</span>
              </div>
              <div>
                <span>{t`Risk Zone:`}</span>
                <span>{site.riskZone}</span>
              </div>
              <div>
                <span>{t`Address:`}</span>
                <span>{site.address ?? t`N/A`}</span>
              </div>
              {site.areaSqm != null && (
                <div>
                  <span>{t`Area (sqm):`}</span>
                  <span>{site.areaSqm}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Tasks Section */}
      <div>
        <h3>{t`Tasks`}</h3>
        {tasks.length === 0 ? (
          <p>{t`No tasks found.`}</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id}>
              <div>
                <span>{task.title}</span>
                <span>{task.priority}</span>
                <span>{task.status}</span>
              </div>
              <div>
                <span>{t`Due Date:`}</span>
                <span>{task.dueDate ?? t`N/A`}</span>
              </div>
              <div>
                <span>{t`Type:`}</span>
                <span>{task.type}</span>
              </div>
              {task.description && (
                <div>
                  <span>{t`Description:`}</span>
                  <span>{task.description}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
