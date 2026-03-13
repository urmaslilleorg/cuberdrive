const TEAM = [
  {
    name: 'Urmas',
    role: 'The Mastermind',
    desc: 'Vision, product decisions, sign-off.',
    quote: 'Every decision made clearly = one less day of development.',
    color: '#D97757',
  },
  {
    name: 'Claude',
    role: 'The Architect',
    desc: 'System design, phase briefs, knowledge keeper.',
    quote: 'Holds the entire project in memory.',
    color: '#9B59B6',
  },
  {
    name: 'Manus',
    role: 'The Fixer',
    desc: 'Full implementation from briefs.',
    quote: "Executes what is written. If it's not in the brief, it won't be built.",
    color: '#3B7DD8',
  },
  {
    name: 'Cursor',
    role: 'The Cleaner',
    desc: 'Visual polish after core is complete.',
    quote: 'Cursor after Manus, never instead of Manus.',
    color: '#4A9E7E',
  },
];

export function TeamCards() {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
      {TEAM.map((member, i) => (
        <div
          key={i}
          className={`stagger-${i + 1} rounded-xl p-6 transition-all duration-200 hover:border-[#D5D5D0]`}
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E5E0',
          }}
        >
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
              style={{
                background: `${member.color}14`,
                color: member.color,
                fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
              }}
            >
              {member.name[0]}
            </div>
            <div>
              <h3
                className="text-base font-semibold"
                style={{ color: '#1A1A1A', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                {member.name} — {member.role}
              </h3>
              <p className="text-sm mt-0.5" style={{ color: '#6B6B6B' }}>
                {member.desc}
              </p>
            </div>
          </div>
          <blockquote
            className="text-sm italic pl-3"
            style={{
              color: member.color,
              borderLeft: `2px solid ${member.color}`,
              fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 400,
            }}
          >
            &ldquo;{member.quote}&rdquo;
          </blockquote>
        </div>
      ))}
    </div>
  );
}
