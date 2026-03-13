const TEAM = [
  {
    name: 'Urmas',
    role: 'The Mastermind',
    desc: 'Vision, product decisions, sign-off.',
    quote: 'Every decision made clearly = one less day of development.',
    color: '#e94560',
  },
  {
    name: 'Claude',
    role: 'The Architect',
    desc: 'System design, phase briefs, knowledge keeper.',
    quote: 'Holds the entire project in memory.',
    color: '#a855f7',
  },
  {
    name: 'Manus',
    role: 'The Fixer',
    desc: 'Full implementation from briefs.',
    quote: "Executes what is written. If it's not in the brief, it won't be built.",
    color: '#3b82f6',
  },
  {
    name: 'Cursor',
    role: 'The Cleaner',
    desc: 'Visual polish after core is complete.',
    quote: 'Cursor after Manus, never instead of Manus.',
    color: '#00c9a7',
  },
];

export function TeamCards() {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
      {TEAM.map((member, i) => (
        <div
          key={i}
          className={`stagger-${i + 1} rounded-xl p-6 transition-all duration-200`}
          style={{
            background: '#13131a',
            border: '1px solid #2a2a30',
          }}
        >
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
              style={{ background: `${member.color}20`, color: member.color, fontFamily: 'var(--font-space-mono)' }}
            >
              {member.name[0]}
            </div>
            <div>
              <h3
                className="text-base font-semibold"
                style={{ color: '#f0efe9', fontFamily: 'var(--font-syne)' }}
              >
                {member.name} — {member.role}
              </h3>
              <p className="text-sm mt-0.5" style={{ color: '#6b6b74' }}>
                {member.desc}
              </p>
            </div>
          </div>
          <blockquote
            className="text-sm italic pl-3"
            style={{
              color: member.color,
              borderLeft: `2px solid ${member.color}`,
              fontFamily: 'var(--font-outfit)',
              fontWeight: 300,
            }}
          >
            &ldquo;{member.quote}&rdquo;
          </blockquote>
        </div>
      ))}
    </div>
  );
}
