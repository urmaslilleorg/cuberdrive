'use client';

import { useState } from 'react';
import { Cofounder, ApprovalAction } from '@/lib/supabase-client';
import { Identity } from '@/lib/identity';

interface ApprovalSectionProps {
  cofounders: Cofounder[];
  approvalActions: ApprovalAction[];
  identity: Identity | null;
  onApprove: (action: 'approved' | 'changes_requested', note?: string) => Promise<void>;
}

export function ApprovalSection({
  cofounders,
  approvalActions,
  identity,
  onApprove,
}: ApprovalSectionProps) {
  const [loading, setLoading] = useState(false);
  const [changesNote, setChangesNote] = useState('');
  const [showChangesInput, setShowChangesInput] = useState<string | null>(null);

  const getLatestAction = (cofounderId: string): ApprovalAction | null => {
    const actions = approvalActions
      .filter((a) => a.cofounder_id === cofounderId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return actions[0] || null;
  };

  const approvedCount = cofounders.filter((cf) => {
    const action = getLatestAction(cf.id);
    return action?.action === 'approved';
  }).length;

  const allApproved = cofounders.length > 0 && approvedCount === cofounders.length;

  const handleApprove = async (action: 'approved' | 'changes_requested') => {
    setLoading(true);
    try {
      await onApprove(action, action === 'changes_requested' ? changesNote : undefined);
      setShowChangesInput(null);
      setChangesNote('');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (allApproved) {
    return (
      <div
        className="rounded-2xl p-10 text-center mt-10"
        style={{
          background: 'rgba(0, 201, 167, 0.08)',
          border: '1px solid rgba(0, 201, 167, 0.3)',
        }}
      >
        <div className="text-5xl mb-4">✓</div>
        <h3
          className="text-2xl font-bold mb-2"
          style={{ color: '#00c9a7', fontFamily: 'var(--font-syne)' }}
        >
          Concept approved. Let&apos;s build.
        </h3>
        <p className="text-sm" style={{ color: '#6b6b74' }}>
          All co-founders have approved. Phase 1 is next.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-4">
      {cofounders.map((cf) => {
        const latestAction = getLatestAction(cf.id);
        const isCurrentUser = identity?.cofounder_id === cf.id;
        const status = latestAction?.action || 'pending';

        return (
          <div
            key={cf.id}
            className="rounded-xl p-6 transition-all duration-200"
            style={{
              background: '#13131a',
              border: `1px solid ${
                status === 'approved'
                  ? 'rgba(0, 201, 167, 0.3)'
                  : status === 'changes_requested'
                  ? 'rgba(251, 191, 36, 0.3)'
                  : '#2a2a30'
              }`,
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h4
                  className="text-base font-semibold"
                  style={{ color: '#f0efe9', fontFamily: 'var(--font-syne)' }}
                >
                  {cf.name}
                  {isCurrentUser && (
                    <span className="ml-2 text-xs" style={{ color: '#6b6b74' }}>
                      (you)
                    </span>
                  )}
                </h4>
                {status === 'approved' && latestAction && (
                  <p className="text-sm mt-1" style={{ color: '#00c9a7' }}>
                    ✓ Approved on {formatDate(latestAction.created_at)}
                  </p>
                )}
                {status === 'changes_requested' && latestAction && (
                  <div>
                    <p className="text-sm mt-1" style={{ color: '#fbbf24' }}>
                      ~ Requested changes on {formatDate(latestAction.created_at)}
                    </p>
                    {latestAction.note && (
                      <p className="text-sm mt-1 italic" style={{ color: '#6b6b74' }}>
                        &ldquo;{latestAction.note}&rdquo;
                      </p>
                    )}
                  </div>
                )}
                {status === 'pending' && (
                  <p className="text-sm mt-1" style={{ color: '#6b6b74' }}>
                    Pending review
                  </p>
                )}
              </div>

              {isCurrentUser && status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove('approved')}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                    style={{
                      background: '#e94560',
                      color: '#f0efe9',
                      fontFamily: 'var(--font-outfit)',
                    }}
                  >
                    Approve concept
                  </button>
                  <button
                    onClick={() => setShowChangesInput(cf.id)}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:border-[rgba(233,69,96,0.3)] disabled:opacity-50"
                    style={{
                      background: 'transparent',
                      color: '#6b6b74',
                      border: '1px solid #2a2a30',
                      fontFamily: 'var(--font-outfit)',
                    }}
                  >
                    Request changes
                  </button>
                </div>
              )}
            </div>

            {showChangesInput === cf.id && (
              <div className="mt-4">
                <textarea
                  value={changesNote}
                  onChange={(e) => setChangesNote(e.target.value)}
                  placeholder="Describe the changes you'd like to see..."
                  rows={3}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                  style={{
                    background: '#08080a',
                    border: '1px solid #2a2a30',
                    color: '#f0efe9',
                    fontFamily: 'var(--font-outfit)',
                  }}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleApprove('changes_requested')}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: 'rgba(251, 191, 36, 0.15)',
                      color: '#fbbf24',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                    }}
                  >
                    Submit changes request
                  </button>
                  <button
                    onClick={() => setShowChangesInput(null)}
                    className="px-4 py-2 rounded-lg text-sm"
                    style={{ color: '#6b6b74' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {!identity && (
        <p className="text-sm text-center mt-4" style={{ color: '#6b6b74' }}>
          Viewing mode. You&apos;re not a configured reviewer.
        </p>
      )}
    </div>
  );
}
