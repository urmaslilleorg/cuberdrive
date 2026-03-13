'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { setIdentity } from '@/lib/identity';

interface IdentityModalProps {
  onClose: () => void;
  onSuccess: (identity: { name: string; email: string; cofounder_id: string }) => void;
}

export function IdentityModal({ onClose, onSuccess }: IdentityModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/cofounders');
      const cofounders = await res.json();

      const match = cofounders.find(
        (cf: { email: string; id: string; name: string }) =>
          cf.email.toLowerCase() === email.toLowerCase().trim()
      );

      if (match) {
        const identity = { name: match.name, email: match.email, cofounder_id: match.id };
        setIdentity(identity);
        onSuccess(identity);
      } else {
        setError("You don't have comment access. Contact the project owner.");
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.2)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm rounded-2xl p-6"
        style={{ background: '#FFFFFF', border: '1px solid #E5E5E0', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[#F5F5F0]"
          style={{ color: '#9B9B9B' }}
        >
          <X size={16} />
        </button>

        <h2
          className="text-lg font-semibold mb-1"
          style={{ color: '#1A1A1A', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
        >
          Identify yourself
        </h2>
        <p className="text-sm mb-5" style={{ color: '#6B6B6B' }}>
          Enter your name and email to comment and approve.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{
                background: '#FAFAF8',
                border: '1px solid #E5E5E0',
                color: '#1A1A1A',
                fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
              }}
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{
                background: '#FAFAF8',
                border: '1px solid #E5E5E0',
                color: '#1A1A1A',
                fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
              }}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: '#D97757' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim() || !email.trim()}
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            style={{
              background: '#D97757',
              color: '#FFFFFF',
              fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
            }}
          >
            {loading ? 'Checking...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
