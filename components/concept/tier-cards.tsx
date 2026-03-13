const TIERS = [
  {
    name: 'Standard',
    desc: 'New to CUBER. Verified portfolio. Basic AI support. Access to open briefs.',
    color: '#6B6B6B',
    badge: null,
  },
  {
    name: 'Premium',
    desc: '20+ completed rides. 90%+ approval rate. Priority matching. Advanced AI coworker. Access to preferred briefs.',
    color: '#1A1A1A',
    badge: null,
  },
  {
    name: 'Black',
    desc: 'Top 5%. Invite-only. Dedicated brand relationships. Cooper hardware eligible. Premium pricing.',
    color: '#D97757',
    badge: 'Invite only',
  },
];

export function TierCards() {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
      {TIERS.map((tier, i) => (
        <div
          key={i}
          className={`stagger-${i + 1} rounded-xl p-6 transition-all duration-200 hover:border-[#D5D5D0]`}
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E5E0',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-lg font-bold"
              style={{ color: tier.color, fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              {tier.name}
            </h3>
            {tier.badge && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(217, 119, 87, 0.1)', color: '#D97757' }}
              >
                {tier.badge}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#6B6B6B' }}>
            {tier.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
