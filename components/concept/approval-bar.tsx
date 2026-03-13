'use client';

import { Cofounder, ApprovalAction } from '@/lib/supabase-client';

interface ApprovalBarProps {
  cofounders: Cofounder[];
  approvalActions: ApprovalAction[];
}

export function ApprovalBar({ cofounders, approvalActions }: ApprovalBarProps) {
  const getStatus = (cofounderId: string) => {
    const actions = approvalActions
      .filter((a) => a.cofounder_id === cofounderId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return actions[0]?.action || 'pending';
  };

  const approvedCount = cofounders.filter((cf) => getStatus(cf.id) === 'approved').length;
  const allApproved = cofounders.length > 0 && approvedCount === cofounders.length;

  return (
    <div
      className="flex items-center justify-between px-6 py-2.5 text-sm"
      style={{
        background: allApproved ? 'rgba(0, 201, 167, 0.1)' : '#08080a',
        borderBottom: `1px solid ${allApproved ? 'rgba(0, 201, 167, 0.3)' : '#2a2a30'}`,
      }}
    >
      <span
        className="font-mono text-xs"
        style={{
          color: allApproved ? '#00c9a7' : '#6b6b74',
          fontFamily: 'var(--font-space-mono)',
        }}
      >
        {allApproved
          ? 'Concept approved ✓'
          : `Concept status: ${approvedCount} of ${cofounders.length} co-founders approved`}
      </span>

      <div className="flex items-center gap-2">
        {cofounders.map((cf) => {
          const status = getStatus(cf.id);
          return (
            <div
              key={cf.id}
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
              title={`${cf.name}: ${status}`}
              style={{
                background:
                  status === 'approved'
                    ? 'rgba(0, 201, 167, 0.2)'
                    : status === 'changes_requested'
                    ? 'rgba(251, 191, 36, 0.2)'
                    : '#2a2a30',
                border: `1px solid ${
                  status === 'approved'
                    ? '#00c9a7'
                    : status === 'changes_requested'
                    ? '#fbbf24'
                    : '#2a2a30'
                }`,
                color:
                  status === 'approved'
                    ? '#00c9a7'
                    : status === 'changes_requested'
                    ? '#fbbf24'
                    : '#6b6b74',
              }}
            >
              {status === 'approved' ? '✓' : status === 'changes_requested' ? '~' : cf.name[0]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
