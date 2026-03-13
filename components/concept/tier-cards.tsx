const TIERS = [
  {
    name: 'Standard',
    desc: 'New to CUBER. Verified portfolio. Basic AI support. Access to open briefs.',
    color: '#6b6b74',
    badge: null,
  },
  {
    name: 'Premium',
    desc: '20+ completed rides. 90%+ approval rate. Priority matching. Advanced AI coworker. Access to preferred briefs.',
    color: '#f0efe9',
    badge: null,
  },
  {
    name: 'Black',
    desc: 'Top 5%. Invite-only. Dedicated brand relationships. Cooper hardware eligible. Premium pricing.',
    color: '#e94560',
    badge: 'Invite only',
  },
];

export function TierCards() {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
      {TIERS.map((tier, i) => (
        <div
          key={i}
          className={`stagger-${i + 1} rounded-xl p-6 transition-all duration-200 hover:border-[rgba(233,69,96,0.3)]`}
          style={{
            background: '#13131a',
            border: '1px solid #2a2a30',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-lg font-bold"
              style={{ color: tier.color, fontFamily: 'var(--font-syne)' }}
            >
              {tier.name}
            </h3>
            {tier.badge && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(233, 69, 96, 0.15)', color: '#e94560' }}
              >
                {tier.badge}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#6b6b74' }}>
            {tier.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
