'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { Logo } from '@/components/landing/logo';
import { ConceptSection } from '@/components/concept/concept-section';
import { StatCallout } from '@/components/concept/stat-callout';
import { RideTimeline } from '@/components/concept/ride-timeline';
import { ArchitectureDiagram } from '@/components/concept/architecture-diagram';
import { PhaseTimeline } from '@/components/concept/phase-timeline';
import { PricingTable } from '@/components/concept/pricing-table';
import { TierCards } from '@/components/concept/tier-cards';
import { TeamCards } from '@/components/concept/team-cards';
import { ApprovalBar } from '@/components/concept/approval-bar';
import { ApprovalSection } from '@/components/concept/approval-section';
import { CommentPanel } from '@/components/concept/comment-panel';
import { IdentityModal } from '@/components/shared/identity-modal';
import { supabase, Cofounder, Comment, ApprovalAction } from '@/lib/supabase-client';
import { getIdentity, Identity } from '@/lib/identity';

export default function ConceptPage() {
  const [cofounders, setCofounders] = useState<Cofounder[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [approvalActions, setApprovalActions] = useState<ApprovalAction[]>([]);
  const [identity, setIdentityState] = useState<Identity | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [pendingCommentSection, setPendingCommentSection] = useState<string | null>(null);

  useEffect(() => {
    setIdentityState(getIdentity());
  }, []);

  const fetchData = useCallback(async () => {
    const [cfRes, commentsRes, approvalsRes] = await Promise.all([
      supabase.from('cofounders').select('*').order('created_at'),
      supabase
        .from('comments')
        .select('*, cofounders(name, email)')
        .order('created_at', { ascending: false }),
      supabase
        .from('approval_actions')
        .select('*, cofounders(name, email)')
        .order('created_at', { ascending: false }),
    ]);

    if (cfRes.data) setCofounders(cfRes.data);
    if (commentsRes.data) setComments(commentsRes.data as Comment[]);
    if (approvalsRes.data) setApprovalActions(approvalsRes.data as ApprovalAction[]);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const commentsChannel = supabase
      .channel('comments-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, () => {
        fetchData();
      })
      .subscribe();

    const approvalsChannel = supabase
      .channel('approvals-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'approval_actions' },
        () => {
          fetchData();
        }
      )
      .subscribe();

    const cofoundersChannel = supabase
      .channel('cofounders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cofounders' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(approvalsChannel);
      supabase.removeChannel(cofoundersChannel);
    };
  }, [fetchData]);

  const getCommentCount = (sectionId: string) =>
    comments.filter((c) => c.section_id === sectionId).length;

  const handleCommentClick = (sectionId: string) => {
    if (!identity) {
      setPendingCommentSection(sectionId);
      setShowIdentityModal(true);
      return;
    }
    setActiveSection(sectionId);
  };

  const handleIdentitySuccess = (newIdentity: Identity) => {
    setIdentityState(newIdentity);
    setShowIdentityModal(false);
    if (pendingCommentSection) {
      setActiveSection(pendingCommentSection);
      setPendingCommentSection(null);
    }
  };

  const handleCommentSubmit = async (sectionId: string, content: string) => {
    if (!identity) return;

    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section_id: sectionId,
        cofounder_id: identity.cofounder_id,
        content,
      }),
    });

    if (res.ok) {
      await fetchData();
    }
  };

  const handleApprove = async (
    action: 'approved' | 'changes_requested',
    note?: string
  ) => {
    if (!identity) return;

    await fetch('/api/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cofounder_id: identity.cofounder_id,
        action,
        note,
      }),
    });

    await fetchData();
  };

  const SectionHeading = ({
    children,
    centered = false,
  }: {
    children: React.ReactNode;
    centered?: boolean;
  }) => (
    <h2
      className={`text-3xl md:text-4xl font-bold mb-6 ${centered ? 'text-center' : ''}`}
      style={{
        color: '#1A1A1A',
        fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.02em',
      }}
    >
      {children}
    </h2>
  );

  const Card = ({
    title,
    children,
    accentColor,
  }: {
    title: string;
    children: React.ReactNode;
    accentColor?: string;
  }) => (
    <div
      className="rounded-xl p-6 transition-all duration-200 hover:border-[#D5D5D0]"
      style={{ background: '#FFFFFF', border: '1px solid #E5E5E0' }}
    >
      <h3
        className="text-base font-semibold mb-3"
        style={{
          color: accentColor || '#1A1A1A',
          fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
        }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: '#6B6B6B' }}>
        {children}
      </p>
    </div>
  );

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh' }}>
      {/* Sticky top bar */}
      <div className="sticky top-0 z-30" style={{ background: '#FAFAF8' }}>
        {/* Nav */}
        <div
          className="flex items-center justify-between px-6 py-3"
          style={{ borderBottom: '1px solid #E5E5E0' }}
        >
          <Logo size="small" linkTo="/" />
          <span
            className="text-xs hidden sm:block"
            style={{
              color: '#9B9B9B',
              fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
            }}
          >
            Phase 0 — Concept
          </span>
        </div>
        {/* Approval bar */}
        <ApprovalBar cofounders={cofounders} approvalActions={approvalActions} />
      </div>

      {/* Content */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        {/* SECTION 1: THE PROBLEM */}
        <ConceptSection
          id="the-problem"
          commentCount={getCommentCount('the-problem')}
          onCommentClick={handleCommentClick}
        >
          <SectionHeading>The agency model is breaking</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-2">
            <Card title="In-house trap" accentColor="#D97757">
              Expensive fixed teams. Limited talent pool. Siloed departments. Can&apos;t scale up or down.
            </Card>
            <Card title="Holding company overhead">
              WPP, Publicis, Omnicom, Dentsu. Slow. 40–60% of fees go to overhead, not talent. Creative, media, and production disconnected across P&Ls.
            </Card>
            <Card title="Freelance chaos">
              Upwork, Fiverr. Race to the bottom. No brand context. No quality tiers. No workflow. No institutional memory.
            </Card>
          </div>

          <p
            className="mt-8 text-base md:text-lg leading-relaxed stagger-3"
            style={{
              color: '#1A1A1A',
              fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 400,
            }}
          >
            Marketing is fragmented into silos — Creative, Media Planning, Research, Testing, Production — each with its own agency, its own P&L, its own workflow.{' '}
            <span style={{ color: '#D97757' }}>The brand pays for the gaps.</span>
          </p>

          <div className="grid grid-cols-3 gap-8 mt-10 stagger-4">
            <StatCallout value="12–16 weeks" label="average time from brief to campaign delivery" />
            <StatCallout value="3–5 agencies" label="involved in a single campaign" />
            <StatCallout value="40–60%" label="of agency fees go to overhead" />
          </div>
        </ConceptSection>

        {/* SECTION 2: THE OPPORTUNITY */}
        <ConceptSection
          id="the-opportunity"
          commentCount={getCommentCount('the-opportunity')}
          onCommentClick={handleCommentClick}
        >
          <SectionHeading centered>What if there was an Uber for creative work?</SectionHeading>
          <div className="max-w-2xl mx-auto text-center">
            <p
              className="text-xl md:text-2xl font-medium leading-relaxed mb-6 stagger-2"
              style={{
                color: '#1A1A1A',
                fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                letterSpacing: '-0.01em',
              }}
            >
              A platform where brands post a need, AI structures it into a brief, matched talent bids instantly, and you track delivery like tracking a ride.
            </p>
            <p
              className="text-base stagger-3"
              style={{
                color: '#6B6B6B',
                fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontWeight: 400,
              }}
            >
              No agency overhead. No freelance chaos. Just the right talent, the right price, the right workflow.
            </p>
          </div>
        </ConceptSection>

        {/* SECTION 3: INTRODUCING CUBER */}
        <ConceptSection
          id="introducing-cuber"
          commentCount={getCommentCount('introducing-cuber')}
          onCommentClick={handleCommentClick}
        >
          <SectionHeading>Introducing CUBER</SectionHeading>
          <p
            className="text-base md:text-lg leading-relaxed max-w-3xl mb-8 stagger-2"
            style={{
              color: '#1A1A1A',
              fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 400,
            }}
          >
            A decentralised creative agency platform where brands post creative needs through a guided dialogue, AI structures it into a brief, matched freelance talent bids automatically, and the brand chooses from capability-based packages — then tracks delivery like an Uber ride. AI agents trained on brand knowledge work alongside freelancers as embedded coworkers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-3">
            <div
              className="rounded-xl p-6"
              style={{ background: '#FFFFFF', border: '1px solid #E5E5E0' }}
            >
              <div
                className="text-xs font-medium mb-2"
                style={{ color: '#D97757', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                Target
              </div>
              <p className="text-sm" style={{ color: '#1A1A1A' }}>
                Mid-size brands with €1M–€20M annual ad spend escaping holding company dependency
              </p>
            </div>
            <div
              className="rounded-xl p-6"
              style={{ background: '#FFFFFF', border: '1px solid #E5E5E0' }}
            >
              <div
                className="text-xs font-medium mb-2"
                style={{ color: '#D97757', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                MVP scope
              </div>
              <p className="text-sm" style={{ color: '#1A1A1A' }}>
                Creative + production silos. Working prototype with synthetic data.
              </p>
            </div>
          </div>
        </ConceptSection>

        {/* SECTION 4: THE RIDE */}
        <ConceptSection
          id="the-ride"
          commentCount={getCommentCount('the-ride')}
          onCommentClick={handleCommentClick}
        >
          <SectionHeading>The ride — from need to delivery</SectionHeading>
          <RideTimeline />
        </ConceptSection>

        {/* SECTION 5: AI COWORKERS */}
        <ConceptSection
          id="ai-coworkers"
          commentCount={getCommentCount('ai-coworkers')}
          onCommentClick={handleCommentClick}
        >
          <SectionHeading>Your AI team never sleeps</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-2">
            <Card title="Brief Agent" accentColor="#9B59B6">
              Turns vague requests into structured briefs through dialogue. Uses market data and brand history to add context.
            </Card>
            <Card title="Brand CMO Agent" accentColor="#3B7DD8">
              Reviews every deliverable against brand guidelines, tone of voice, and past approved work. Flags issues before the client sees them.
            </Card>
            <Card title="Talent Bid Agent" accentColor="#4A9E7E">
              Pre-fills bids, matches portfolio examples, suggests pricing based on the talent&apos;s rate card and brief requirements.
            </Card>
          </div>
          <p
            className="mt-8 text-sm stagger-3"
            style={{
              color: '#9B9B9B',
              fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 400,
            }}
          >
            Powered by OpenClaw architecture — persistent, autonomous, skill-based agents that learn from every interaction. Inspired by the viral open-source AI agent framework of early 2026.
          </p>
        </ConceptSection>

        {/* SECTION 6: DATA MODEL */}
        <ConceptSection
          id="data-model"
          commentCount={getCommentCount('data-model')}
          onCommentClick={handleCommentClick}
        >
          <SectionHeading>Intelligence built on three layers</SectionHeading>
          <div className="space-y-4 mt-6 stagger-2">
            {[
              {
                layer: 'Layer 1: Common',
                desc: 'Industry rates, benchmarks, delivery timelines, quality standards across all creative disciplines.',
                color: '#3B7DD8',
              },
              {
                layer: 'Layer 2: Category',
                desc: 'Per vertical expertise: advertising, branding, content production, digital, print.',
                color: '#9B59B6',
              },
              {
                layer: 'Layer 3: Brand Vault',
                desc: 'CVI, tone of voice, campaign history, approved/rejected work, feedback preferences. The more a brand uses CUBER, the smarter it gets.',
                color: '#D97757',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-5 flex gap-4 items-start"
                style={{ background: '#FFFFFF', border: `1px solid ${item.color}30` }}
              >
                <div
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ background: item.color }}
                />
                <div>
                  <h4
                    className="text-sm font-semibold mb-1"
                    style={{ color: item.color, fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
                  >
                    {item.layer}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B6B6B' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p
            className="mt-6 text-xs stagger-3"
            style={{ color: '#9B9B9B', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            Data architecture derived from the Südameapteek AI Marketing Expert three-layer model — battle-tested in production.
          </p>
        </ConceptSection>

        {/* SECTION 7: PRICING MODEL */}
        <ConceptSection
          id="pricing-model"
          commentCount={getCommentCount('pricing-model')}
          onCommentClick={handleCommentClick}
        >
          <SectionHeading>Output-based pricing — borrowed from pharma</SectionHeading>
          <p
            className="text-base leading-relaxed max-w-2xl mb-2 stagger-2"
            style={{
              color: '#6B6B6B',
              fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 400,
            }}
          >
            Global brands like Sandoz/Novartis already buy creative through structured output-based menu cards with fixed pricing per deliverable type and complexity tier. CUBER democratises this model.
          </p>
          <PricingTable />
          <p
            className="mt-4 text-sm stagger-3"
            style={{
              color: '#6B6B6B',
              fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 400,
            }}
          >
            Talent sets their rates per deliverable. CUBER aggregates bids into fixed packages.{' '}
            <span style={{ color: '#1A1A1A' }}>The brand never haggles.</span>
          </p>
        </ConceptSection>

        {/* SECTION 8: TALENT TIERS */}
        <ConceptSection
          id="talent-tiers"
          commentCount={getCommentCount('talent-tiers')}
          onCommentClick={handleCommentClick}
        >
          <SectionHeading>Tier system — earned, not bought</SectionHeading>
          <TierCards />
        </ConceptSection>

        {/* SECTION 9: COOPER */}
        <ConceptSection
          id="cooper"
          commentCount={getCommentCount('cooper')}
          onCommentClick={handleCommentClick}
        >
          <SectionHeading>Cooper — your brand team in a box</SectionHeading>
          <div className="flex flex-col md:flex-row gap-8 items-start stagger-2">
            {/* Device illustration */}
            <div
              className="flex-shrink-0 w-32 h-32 rounded-2xl flex items-center justify-center"
              style={{
                background: '#F5F5F0',
                border: '1px solid rgba(217, 119, 87, 0.25)',
              }}
            >
              <div className="text-center">
                <div className="text-4xl mb-1">⬛</div>
                <div
                  className="text-xs font-medium"
                  style={{ color: '#D97757', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  Cooper
                </div>
              </div>
            </div>

            <div className="flex-1">
              <p
                className="text-base leading-relaxed mb-4"
                style={{
                  color: '#1A1A1A',
                  fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontWeight: 400,
                }}
              >
                A dedicated hardware device — delivered to a freelancer or agency — running the brand&apos;s AI agents locally. Persistent memory. 24/7 operation. Deep brand knowledge. Zero cloud latency.
              </p>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{
                  color: '#6B6B6B',
                  fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontWeight: 400,
                }}
              >
                Inspired by the OpenClaw + Mac Mini trend of early 2026: thousands of people running autonomous AI agents on dedicated hardware.
              </p>
              <span
                className="inline-block text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(201, 146, 62, 0.08)',
                  color: '#C9923E',
                  border: '1px solid rgba(201, 146, 62, 0.2)',
                  fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                }}
              >
                V2 concept — included in prototype UI, not built yet
              </span>
            </div>
          </div>
        </ConceptSection>

        {/* SECTION 10: ARCHITECTURE */}
        <ConceptSection
          id="architecture"
          commentCount={getCommentCount('architecture')}
          onCommentClick={handleCommentClick}
        >
          <SectionHeading>Architecture — four layers</SectionHeading>
          <ArchitectureDiagram />
        </ConceptSection>

        {/* SECTION 11: TECH STACK */}
        <ConceptSection
          id="tech-stack"
          commentCount={getCommentCount('tech-stack')}
          onCommentClick={handleCommentClick}
        >
          <SectionHeading>Built to scale from day one</SectionHeading>
          <div className="mt-6 space-y-3 stagger-2">
            {[
              { tech: 'Next.js 14+', note: 'App Router + TypeScript', color: '#1A1A1A' },
              { tech: 'Tailwind CSS + shadcn/ui', note: 'Design system', color: '#3B7DD8' },
              { tech: 'Supabase', note: 'PostgreSQL + Auth + Realtime + pgvector', color: '#4A9E7E' },
              { tech: 'Claude API', note: 'Agent reasoning', color: '#9B59B6' },
              { tech: 'Vercel', note: 'Hosting + edge functions', color: '#1A1A1A' },
              { tech: 'OpenClaw pattern', note: 'Agent architecture', color: '#D97757' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-200 hover:border-[#D5D5D0]"
                style={{ background: '#FFFFFF', border: '1px solid #E5E5E0' }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: item.color }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: '#1A1A1A', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  {item.tech}
                </span>
                <span className="text-sm" style={{ color: '#9B9B9B' }}>
                  — {item.note}
                </span>
              </div>
            ))}
          </div>
          <p
            className="mt-6 text-xs stagger-3"
            style={{ color: '#9B9B9B', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            No Airtable. Relational data from day one. Marketplace complexity demands PostgreSQL.
          </p>
        </ConceptSection>

        {/* SECTION 12: BUILD PLAN */}
        <ConceptSection
          id="build-plan"
          commentCount={getCommentCount('build-plan')}
          onCommentClick={handleCommentClick}
        >
          <SectionHeading>How we build — Ocean&apos;s Eleven</SectionHeading>
          <TeamCards />
        </ConceptSection>

        {/* SECTION 13: PHASE PLAN */}
        <ConceptSection
          id="phase-plan"
          commentCount={getCommentCount('phase-plan')}
          onCommentClick={handleCommentClick}
        >
          <SectionHeading>Prototype in 7 phases</SectionHeading>
          <PhaseTimeline />
        </ConceptSection>

        {/* SECTION 14: APPROVAL */}
        <ConceptSection id="approval" noBorder>
          <SectionHeading centered>Ready to build?</SectionHeading>
          <ApprovalSection
            cofounders={cofounders}
            approvalActions={approvalActions}
            identity={identity}
            onApprove={handleApprove}
          />
          {!identity && cofounders.length > 0 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowIdentityModal(true)}
                className="text-sm transition-colors hover:text-[#1A1A1A]"
                style={{ color: '#9B9B9B' }}
              >
                Are you a configured reviewer?{' '}
                <span style={{ color: '#D97757' }}>Sign in →</span>
              </button>
            </div>
          )}
        </ConceptSection>

        {/* Footer */}
        <footer
          className="py-10 text-center"
          style={{ borderTop: '1px solid #E5E5E0' }}
        >
          <p
            className="text-sm"
            style={{ color: '#9B9B9B', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            CUBER — cuberdrive.com
          </p>
          <p className="text-xs mt-1" style={{ color: '#9B9B9B' }}>
            © 2026
          </p>
          <p className="text-xs mt-1" style={{ color: '#E5E5E0' }}>
            Built with the Division AI team playbook
          </p>
        </footer>
      </div>

      {/* Comment panel */}
      <CommentPanel
        sectionId={activeSection}
        comments={comments}
        identity={identity}
        onClose={() => setActiveSection(null)}
        onSubmit={handleCommentSubmit}
        onSignInClick={() => {
          setActiveSection(null);
          setShowIdentityModal(true);
        }}
      />

      {/* Identity modal */}
      {showIdentityModal && (
        <IdentityModal
          onClose={() => {
            setShowIdentityModal(false);
            setPendingCommentSection(null);
          }}
          onSuccess={handleIdentitySuccess}
        />
      )}
    </div>
  );
}
