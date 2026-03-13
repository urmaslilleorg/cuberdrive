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
        style={{ background: 'rgba(0,0,0,0.7)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm rounded-2xl p-6"
        style={{ background: '#13131a', border: '1px solid #2a2a30' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[#2a2a30]"
          style={{ color: '#6b6b74' }}
        >
          <X size={16} />
        </button>

        <h2
          className="text-lg font-semibold mb-1"
          style={{ color: '#f0efe9', fontFamily: 'var(--font-syne)' }}
        >
          Identify yourself
        </h2>
        <p className="text-sm mb-5" style={{ color: '#6b6b74' }}>
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
                background: '#08080a',
                border: '1px solid #2a2a30',
                color: '#f0efe9',
                fontFamily: 'var(--font-outfit)',
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
                background: '#08080a',
                border: '1px solid #2a2a30',
                color: '#f0efe9',
                fontFamily: 'var(--font-outfit)',
              }}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: '#e94560' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim() || !email.trim()}
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            style={{
              background: '#e94560',
              color: '#f0efe9',
              fontFamily: 'var(--font-outfit)',
            }}
          >
            {loading ? 'Checking...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
