const PHASES = [
  { phase: 'Phase 0', week: 'Week 1', title: 'Concept + co-founder alignment', desc: 'THIS PAGE', current: true },
  { phase: 'Phase 1', week: 'Week 1–2', title: 'Supabase schema + Next.js scaffold + auth', desc: 'Foundation', current: false },
  { phase: 'Phase 2', week: 'Week 2–3', title: 'Create Anything + Brief Agent dialogue', desc: 'Core AI feature', current: false },
  { phase: 'Phase 3', week: 'Week 3–4', title: 'Talent matching + AI-assisted bidding', desc: 'Marketplace', current: false },
  { phase: 'Phase 4', week: 'Week 4–5', title: 'Package selection + ride tracking', desc: 'The ride', current: false },
  { phase: 'Phase 5', week: 'Week 5', title: 'Delivery + rating + tipping', desc: 'Completion loop', current: false },
  { phase: 'Phase 6', week: 'Week 5–6', title: 'Brand Vault + CMO Agent intelligence', desc: 'AI memory', current: false },
  { phase: 'Phase 7', week: 'Week 6–7', title: 'Dashboards + Cooper concept UI + polish', desc: 'Production ready', current: false },
];

export function PhaseTimeline() {
  return (
    <div className="mt-10 relative">
      {/* Vertical line */}
      <div
        className="absolute left-4 top-0 bottom-0 w-px"
        style={{ background: '#2a2a30' }}
      />

      <div className="space-y-4">
        {PHASES.map((phase, i) => (
          <div
            key={i}
            className={`stagger-${Math.min(i + 1, 5)} relative flex gap-6 items-start pl-12`}
          >
            {/* Dot */}
            <div
              className="absolute left-2.5 top-2 w-3 h-3 rounded-full flex-shrink-0"
              style={{
                background: phase.current ? '#e94560' : '#2a2a30',
                border: phase.current ? '2px solid #e94560' : '2px solid #2a2a30',
                transform: 'translateX(-50%)',
                left: '16px',
              }}
            />

            {/* Content */}
            <div
              className="flex-1 rounded-xl p-4 transition-all duration-200"
              style={{
                background: phase.current ? 'rgba(233, 69, 96, 0.08)' : '#13131a',
                border: `1px solid ${phase.current ? 'rgba(233, 69, 96, 0.3)' : '#2a2a30'}`,
              }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: phase.current ? '#e94560' : '#6b6b74', fontFamily: 'var(--font-space-mono)' }}
                >
                  {phase.phase}
                </span>
                <span
                  className="text-xs"
                  style={{ color: '#6b6b74', fontFamily: 'var(--font-space-mono)' }}
                >
                  {phase.week}
                </span>
                {phase.current && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(233, 69, 96, 0.2)', color: '#e94560' }}
                  >
                    Current
                  </span>
                )}
              </div>
              <p
                className="text-sm font-medium"
                style={{ color: '#f0efe9', fontFamily: 'var(--font-outfit)' }}
              >
                {phase.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p
        className="mt-8 text-sm text-center"
        style={{ color: '#6b6b74', fontFamily: 'var(--font-space-mono)' }}
      >
        ~7 weeks from kickoff to working prototype. Each phase = one Manus session. Atomic. Verifiable.
      </p>
    </div>
  );
}
