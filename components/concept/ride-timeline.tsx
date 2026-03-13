const STEPS = [
  {
    number: '01',
    title: 'Create anything',
    desc: 'Brand types a need in natural language. Like "Ask anything" in AI chats — but it creates real work.',
  },
  {
    number: '02',
    title: 'AI dialogue',
    desc: 'CUBER asks clarifying questions to build the perfect brief. Exactly like a senior account director would.',
  },
  {
    number: '03',
    title: 'Structured brief',
    desc: 'Auto-generated from dialogue. Every brief follows the same structure — talent knows exactly what to bid on.',
  },
  {
    number: '04',
    title: 'Matched talent',
    desc: 'Filtered by skill, tier, availability, past brand experience, and AI compatibility score.',
  },
  {
    number: '05',
    title: 'AI-assisted bid',
    desc: 'The Talent Bid Agent pre-fills 80% of the response. What used to take 2 weeks takes 20 minutes.',
  },
  {
    number: '06',
    title: 'Choose package',
    desc: '2–3 options differentiated by talent superpower. Fixed price. No surprises. No hourly billing.',
  },
  {
    number: '07',
    title: 'Ride in progress',
    desc: 'Live timeline. Brand CMO Agent reviews work-in-progress against brand guidelines.',
  },
  {
    number: '08',
    title: 'Delivered',
    desc: 'Assets delivered. Brand reviews and approves.',
  },
  {
    number: '09',
    title: 'Rate + tip',
    desc: 'Quality feedback loop. Talent tiers adjust based on performance.',
  },
];

export function RideTimeline() {
  return (
    <div className="relative mt-12">
      {/* Vertical line */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
        style={{ background: '#2a2a30', transform: 'translateX(-50%)' }}
      />

      <div className="space-y-8">
        {STEPS.map((step, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div
              key={step.number}
              className={`stagger-${Math.min(i + 1, 5)} relative flex items-center gap-8 ${
                isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
              } flex-col md:flex-row`}
            >
              {/* Content */}
              <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'} text-left`}>
                <div
                  className="inline-block rounded-xl p-6 transition-all duration-200 hover:border-[rgba(233,69,96,0.3)]"
                  style={{
                    background: '#13131a',
                    border: '1px solid #2a2a30',
                    maxWidth: '400px',
                  }}
                >
                  <div
                    className="text-xs font-mono mb-2"
                    style={{ color: '#e94560', fontFamily: 'var(--font-space-mono)' }}
                  >
                    {step.number}
                  </div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: '#f0efe9', fontFamily: 'var(--font-syne)' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b6b74' }}>
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Circle node */}
              <div
                className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center hidden md:flex"
                style={{
                  background: '#08080a',
                  border: '2px solid #e94560',
                }}
              >
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: '#e94560', fontFamily: 'var(--font-space-mono)' }}
                >
                  {i + 1}
                </span>
              </div>

              {/* Empty side */}
              <div className="flex-1 hidden md:block" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
