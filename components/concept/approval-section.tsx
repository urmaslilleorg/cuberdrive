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
          background: 'rgba(74, 158, 126, 0.06)',
          border: '1px solid rgba(74, 158, 126, 0.25)',
        }}
      >
        <div className="text-5xl mb-4">✓</div>
        <h3
          className="text-2xl font-bold mb-2"
          style={{ color: '#4A9E7E', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
        >
          Concept approved. Let&apos;s build.
        </h3>
        <p className="text-sm" style={{ color: '#9B9B9B' }}>
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
              background: '#FFFFFF',
              border: `1px solid ${
                status === 'approved'
                  ? 'rgba(74, 158, 126, 0.3)'
                  : status === 'changes_requested'
                  ? 'rgba(201, 146, 62, 0.3)'
                  : '#E5E5E0'
              }`,
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h4
                  className="text-base font-semibold"
                  style={{ color: '#1A1A1A', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  {cf.name}
                  {isCurrentUser && (
                    <span className="ml-2 text-xs" style={{ color: '#9B9B9B' }}>
                      (you)
                    </span>
                  )}
                </h4>
                {status === 'approved' && latestAction && (
                  <p className="text-sm mt-1" style={{ color: '#4A9E7E' }}>
                    ✓ Approved on {formatDate(latestAction.created_at)}
                  </p>
                )}
                {status === 'changes_requested' && latestAction && (
                  <div>
                    <p className="text-sm mt-1" style={{ color: '#C9923E' }}>
                      ~ Requested changes on {formatDate(latestAction.created_at)}
                    </p>
                    {latestAction.note && (
                      <p className="text-sm mt-1 italic" style={{ color: '#9B9B9B' }}>
                        &ldquo;{latestAction.note}&rdquo;
                      </p>
                    )}
                  </div>
                )}
                {status === 'pending' && (
                  <p className="text-sm mt-1" style={{ color: '#9B9B9B' }}>
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
                      background: '#D97757',
                      color: '#FFFFFF',
                      fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                    }}
                  >
                    Approve concept
                  </button>
                  <button
                    onClick={() => setShowChangesInput(cf.id)}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: 'transparent',
                      color: '#6B6B6B',
                      border: '1px solid #E5E5E0',
                      fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
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
                    background: '#FAFAF8',
                    border: '1px solid #E5E5E0',
                    color: '#1A1A1A',
                    fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                  }}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleApprove('changes_requested')}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: 'rgba(201, 146, 62, 0.1)',
                      color: '#C9923E',
                      border: '1px solid rgba(201, 146, 62, 0.3)',
                    }}
                  >
                    Submit changes request
                  </button>
                  <button
                    onClick={() => setShowChangesInput(null)}
                    className="px-4 py-2 rounded-lg text-sm"
                    style={{ color: '#9B9B9B' }}
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
        <p className="text-sm text-center mt-4" style={{ color: '#9B9B9B' }}>
          Viewing mode. You&apos;re not a configured reviewer.
        </p>
      )}
    </div>
  );
}
