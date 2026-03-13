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
        background: allApproved ? 'rgba(74, 158, 126, 0.06)' : '#FAFAF8',
        borderBottom: `1px solid ${allApproved ? 'rgba(74, 158, 126, 0.3)' : '#E5E5E0'}`,
      }}
    >
      <span
        className="text-xs"
        style={{
          color: allApproved ? '#4A9E7E' : '#9B9B9B',
          fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
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
                    ? 'rgba(74, 158, 126, 0.12)'
                    : status === 'changes_requested'
                    ? 'rgba(201, 146, 62, 0.12)'
                    : '#F0F0EA',
                border: `1px solid ${
                  status === 'approved'
                    ? '#4A9E7E'
                    : status === 'changes_requested'
                    ? '#C9923E'
                    : '#E5E5E0'
                }`,
                color:
                  status === 'approved'
                    ? '#4A9E7E'
                    : status === 'changes_requested'
                    ? '#C9923E'
                    : '#9B9B9B',
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
