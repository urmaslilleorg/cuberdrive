'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { Logo } from '@/components/landing/logo';
import { Trash2, Plus, Download } from 'lucide-react';

type Cofounder = {
  id: string;
  name: string;
  email: string;
  approved: boolean;
  approved_at: string | null;
  created_at: string;
};

type Comment = {
  id: string;
  section_id: string;
  content: string;
  created_at: string;
  cofounders: { name: string; email: string } | null;
};

type ApprovalAction = {
  id: string;
  cofounder_id: string;
  action: string;
  note: string | null;
  created_at: string;
  cofounders: { name: string; email: string } | null;
};

const ADMIN_KEY = 'cuber_admin_auth';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [cofounders, setCofounders] = useState<Cofounder[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [approvals, setApprovals] = useState<ApprovalAction[]>([]);
  const [loading, setLoading] = useState(false);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [addError, setAddError] = useState('');

  const [sectionFilter, setSectionFilter] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_KEY);
    if (stored) {
      setAuthenticated(true);
      setAdminPassword(stored);
    }
  }, []);

  const fetchData = useCallback(async (pwd: string) => {
    setLoading(true);
    try {
      const [cfRes, commentsRes, approvalsRes] = await Promise.all([
        fetch('/api/cofounders'),
        fetch('/api/comments'),
        fetch('/api/approve'),
      ]);
      if (cfRes.ok) setCofounders(await cfRes.json());
      if (commentsRes.ok) setComments(await commentsRes.json());
      if (approvalsRes.ok) setApprovals(await approvalsRes.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated && adminPassword) {
      fetchData(adminPassword);
    }
  }, [authenticated, adminPassword, fetchData]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      localStorage.setItem(ADMIN_KEY, password);
      setAdminPassword(password);
      setAuthenticated(true);
    } else {
      setAuthError('Invalid password');
    }
  };

  const handleAddCofounder = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    const res = await fetch('/api/cofounders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, email: newEmail, admin_password: adminPassword }),
    });
    if (res.ok) {
      setNewName('');
      setNewEmail('');
      fetchData(adminPassword);
    } else {
      const data = await res.json();
      setAddError(data.error || 'Failed to add co-founder');
    }
  };

  const handleRemoveCofounder = async (id: string) => {
    if (!confirm('Remove this co-founder?')) return;
    await fetch('/api/cofounders', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, admin_password: adminPassword }),
    });
    fetchData(adminPassword);
  };

  const handleExport = () => {
    const data = { cofounders, comments, approvals };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cuber-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const filteredComments = sectionFilter
    ? comments.filter((c) => c.section_id === sectionFilter)
    : comments;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const inputStyle = {
    background: '#FAFAF8',
    border: '1px solid #E5E5E0',
    color: '#1A1A1A',
    fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
  };

  if (!authenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: '#FAFAF8' }}
      >
        <div
          className="w-full max-w-sm rounded-2xl p-8"
          style={{ background: '#FFFFFF', border: '1px solid #E5E5E0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
        >
          <Logo size="small" linkTo="/" />
          <h1
            className="text-xl font-semibold mt-4 mb-1"
            style={{ color: '#1A1A1A', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            Admin Panel
          </h1>
          <p className="text-sm mb-6" style={{ color: '#9B9B9B' }}>
            Enter the admin password to continue.
          </p>
          <form onSubmit={handleAuth} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={inputStyle}
            />
            {authError && (
              <p className="text-sm" style={{ color: '#D97757' }}>
                {authError}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
              style={{ background: '#D97757', color: '#FFFFFF', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-3"
        style={{ background: '#FAFAF8', borderBottom: '1px solid #E5E5E0' }}
      >
        <Logo size="small" linkTo="/" />
        <div className="flex items-center gap-3">
          {loading && (
            <span className="text-xs" style={{ color: '#9B9B9B' }}>Loading...</span>
          )}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-[#F0F0EA]"
            style={{ color: '#6B6B6B', border: '1px solid #E5E5E0' }}
          >
            <Download size={12} />
            Export JSON
          </button>
          <button
            onClick={() => {
              localStorage.removeItem(ADMIN_KEY);
              setAuthenticated(false);
            }}
            className="text-xs transition-colors hover:text-[#1A1A1A]"
            style={{ color: '#9B9B9B' }}
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Co-founders */}
        <section>
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: '#1A1A1A', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            Co-founders
          </h2>

          {/* Add form */}
          <form onSubmit={handleAddCofounder} className="flex gap-2 mb-4 flex-wrap">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
              required
              className="flex-1 min-w-[140px] px-3 py-2 rounded-lg text-sm outline-none"
              style={inputStyle}
            />
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email"
              required
              className="flex-1 min-w-[200px] px-3 py-2 rounded-lg text-sm outline-none"
              style={inputStyle}
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
              style={{ background: '#D97757', color: '#FFFFFF', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              <Plus size={14} />
              Add
            </button>
          </form>
          {addError && (
            <p className="text-sm mb-3" style={{ color: '#D97757' }}>
              {addError}
            </p>
          )}

          {/* Table */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E5E5E0' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#F5F5F0', borderBottom: '1px solid #E5E5E0' }}>
                  {['Name', 'Email', 'Status', 'Added', ''].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-medium"
                      style={{ color: '#9B9B9B', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cofounders.map((cf) => {
                  const latestApproval = approvals
                    .filter((a) => a.cofounder_id === cf.id)
                    .sort(
                      (a, b) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    )[0];
                  const status = latestApproval?.action || 'pending';

                  return (
                    <tr
                      key={cf.id}
                      style={{ borderBottom: '1px solid #E5E5E0' }}
                      className="hover:bg-[#F5F5F0] transition-colors"
                    >
                      <td className="px-4 py-3" style={{ color: '#1A1A1A' }}>
                        {cf.name}
                      </td>
                      <td className="px-4 py-3" style={{ color: '#9B9B9B' }}>
                        {cf.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background:
                              status === 'approved'
                                ? 'rgba(74, 158, 126, 0.1)'
                                : status === 'changes_requested'
                                ? 'rgba(201, 146, 62, 0.1)'
                                : '#F0F0EA',
                            color:
                              status === 'approved'
                                ? '#4A9E7E'
                                : status === 'changes_requested'
                                ? '#C9923E'
                                : '#9B9B9B',
                          }}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#9B9B9B' }}>
                        {formatDate(cf.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleRemoveCofounder(cf.id)}
                          className="w-7 h-7 rounded flex items-center justify-center transition-colors hover:bg-[rgba(217,119,87,0.1)]"
                          style={{ color: '#9B9B9B' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {cofounders.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-sm"
                      style={{ color: '#9B9B9B' }}
                    >
                      No co-founders configured yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Comments */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xl font-semibold"
              style={{ color: '#1A1A1A', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              Comments ({comments.length})
            </h2>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="text-sm px-3 py-1.5 rounded-lg outline-none"
              style={inputStyle}
            >
              <option value="">All sections</option>
              {Array.from(new Set(comments.map((c) => c.section_id))).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            {filteredComments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-xl p-4"
                style={{ background: '#FFFFFF', border: '1px solid #E5E5E0' }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: '#D97757', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
                  >
                    {comment.cofounders?.name || 'Unknown'} — {comment.section_id}
                  </span>
                  <span className="text-xs" style={{ color: '#9B9B9B' }}>
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm" style={{ color: '#1A1A1A' }}>
                  {comment.content}
                </p>
              </div>
            ))}
            {filteredComments.length === 0 && (
              <p className="text-sm text-center py-6" style={{ color: '#9B9B9B' }}>
                No comments yet.
              </p>
            )}
          </div>
        </section>

        {/* Approvals */}
        <section>
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: '#1A1A1A', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            Approval history ({approvals.length})
          </h2>
          <div className="space-y-2">
            {approvals.map((a) => (
              <div
                key={a.id}
                className="rounded-xl p-4 flex items-start justify-between gap-4"
                style={{ background: '#FFFFFF', border: '1px solid #E5E5E0' }}
              >
                <div>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: '#1A1A1A', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
                  >
                    {a.cofounders?.name || 'Unknown'}
                  </span>
                  <span
                    className="ml-2 text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background:
                        a.action === 'approved'
                          ? 'rgba(74, 158, 126, 0.1)'
                          : 'rgba(201, 146, 62, 0.1)',
                      color: a.action === 'approved' ? '#4A9E7E' : '#C9923E',
                    }}
                  >
                    {a.action}
                  </span>
                  {a.note && (
                    <p className="text-xs mt-1 italic" style={{ color: '#9B9B9B' }}>
                      &ldquo;{a.note}&rdquo;
                    </p>
                  )}
                </div>
                <span className="text-xs flex-shrink-0" style={{ color: '#9B9B9B' }}>
                  {formatDate(a.created_at)}
                </span>
              </div>
            ))}
            {approvals.length === 0 && (
              <p className="text-sm text-center py-6" style={{ color: '#9B9B9B' }}>
                No approval actions yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
