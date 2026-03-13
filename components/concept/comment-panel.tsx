'use client';

import { useState, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { Comment } from '@/lib/supabase-client';
import { Identity } from '@/lib/identity';

interface CommentPanelProps {
  sectionId: string | null;
  comments: Comment[];
  identity: Identity | null;
  onClose: () => void;
  onSubmit: (sectionId: string, content: string) => Promise<void>;
  onSignInClick: () => void;
}

export function CommentPanel({
  sectionId,
  comments,
  identity,
  onClose,
  onSubmit,
  onSignInClick,
}: CommentPanelProps) {
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const sectionComments = comments
    .filter((c) => c.section_id === sectionId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const handleSubmit = async () => {
    if (!sectionId || !newComment.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(sectionId, newComment.trim());
      setNewComment('');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const SECTION_LABELS: Record<string, string> = {
    'the-problem': 'The Problem',
    'the-opportunity': 'The Opportunity',
    'introducing-cuber': 'Introducing CUBER',
    'the-ride': 'The Ride',
    'ai-coworkers': 'AI Coworkers',
    'data-model': 'Data Model',
    'pricing-model': 'Pricing Model',
    'talent-tiers': 'Talent Tiers',
    'cooper': 'Cooper',
    'architecture': 'Architecture',
    'tech-stack': 'Tech Stack',
    'build-plan': 'Build Plan',
    'phase-plan': 'Phase Plan',
    'approval': 'Approval',
  };

  return (
    <>
      {/* Backdrop */}
      {sectionId && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.15)' }}
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 h-full z-50 flex flex-col transition-transform duration-300 ease-out"
        style={{
          width: 'min(400px, 100vw)',
          background: '#FFFFFF',
          borderLeft: '1px solid #E5E5E0',
          transform: sectionId ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid #E5E5E0' }}
        >
          <div>
            <h3
              className="text-sm font-semibold"
              style={{ color: '#1A1A1A', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              Comments
            </h3>
            {sectionId && (
              <p className="text-xs mt-0.5" style={{ color: '#9B9B9B' }}>
                {SECTION_LABELS[sectionId] || sectionId}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[#F5F5F0]"
            style={{ color: '#9B9B9B' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {sectionComments.length === 0 ? (
            <p className="text-sm text-center mt-8" style={{ color: '#9B9B9B' }}>
              No comments yet. Be the first.
            </p>
          ) : (
            sectionComments.map((comment) => (
              <div key={comment.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: '#D97757', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
                  >
                    {comment.cofounders?.name || 'Co-founder'}
                  </span>
                  <span className="text-xs" style={{ color: '#9B9B9B' }}>
                    {formatTime(comment.created_at)}
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: '#1A1A1A', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Input area */}
        <div className="px-5 py-4" style={{ borderTop: '1px solid #E5E5E0' }}>
          {identity ? (
            <div className="space-y-2">
              <p className="text-xs" style={{ color: '#9B9B9B' }}>
                Commenting as <span style={{ color: '#D97757' }}>{identity.name}</span>
              </p>
              <div className="flex gap-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  className="flex-1 rounded-lg px-3 py-2 text-sm outline-none resize-none"
                  style={{
                    background: '#FAFAF8',
                    border: '1px solid #E5E5E0',
                    color: '#1A1A1A',
                    fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !newComment.trim()}
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30 self-end"
                  style={{ background: '#D97757', color: '#FFFFFF' }}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onSignInClick}
              className="w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-90"
              style={{
                background: 'rgba(217, 119, 87, 0.08)',
                color: '#D97757',
                border: '1px solid rgba(217, 119, 87, 0.2)',
                fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
              }}
            >
              Sign in to comment
            </button>
          )}
        </div>
      </div>
    </>
  );
}
