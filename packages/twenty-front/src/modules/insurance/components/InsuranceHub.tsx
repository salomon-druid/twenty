import { t } from '@lingui/core/macro';

type InsuranceHubProps = {
  onNavigate: (section: string) => void;
};

export function InsuranceHub({ onNavigate }: InsuranceHubProps) {
  const sections = [
    {
      id: 'policies',
      title: t`Policies`,
      description: t`Manage insurance policies, coverage details, and policy lifecycle`,
    },
    {
      id: 'claims',
      title: t`Claims`,
      description: t`Track and manage insurance claims from report to settlement`,
    },
    {
      id: 'renewals',
      title: t`Renewals`,
      description: t`Manage policy renewals and renewal workflows`,
    },
    {
      id: 'quotes',
      title: t`Quotes`,
      description: t`Create and manage insurance quotes and proposals`,
    },
    {
      id: 'reinsurances',
      title: t`Reinsurance`,
      description: t`Manage reinsurance treaties and ceded premiums`,
    },
    {
      id: 'risks',
      title: t`Risk Profiles`,
      description: t`Assess and manage client risk profiles`,
    },
    {
      id: 'premiums',
      title: t`Premiums`,
      description: t`Track premium payments and payment status`,
    },
    {
      id: 'provisions',
      title: t`Provisions`,
      description: t`Manage broker commissions and provisions`,
    },
    {
      id: 'tasks',
      title: t`Tasks`,
      description: t`Manage insurance-related tasks and follow-ups`,
    },
    {
      id: 'sites',
      title: t`Sites`,
      description: t`Manage client sites and locations`,
    },
    {
      id: 'broker-dashboard',
      title: t`Broker Dashboard`,
      description: t`Overview of portfolio, claims, revenue, and tasks`,
    },
    {
      id: 'client-dashboard',
      title: t`Client Dashboard`,
      description: t`Client-facing dashboard with policies, claims, and renewals`,
    },
    {
      id: 'reports',
      title: t`Reports & Analytics`,
      description: t`Portfolio summary, claims analysis, revenue reports`,
    },
  ];

  return (
    <div>
      <h2>{t`Insurance Hub`}</h2>
      <p>{t`Commercial & Industrial Insurance Management`}</p>

      <div>
        {sections.map((section) => (
          <div
            key={section.id}
            onClick={() => onNavigate(section.id)}
          >
            <span>{section.title}</span>
            <p>{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
