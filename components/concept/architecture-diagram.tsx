const LAYERS = [
  {
    label: 'Layer 1 — Interfaces',
    color: '#3b82f6',
    items: ['Create Anything', 'Brand Dashboard', 'Talent Portal', 'Slack'],
  },
  {
    label: 'Layer 2 — AI Orchestration',
    color: '#a855f7',
    items: ['Brief Agent', 'Brand CMO Agent', 'Talent Bid Agent', 'Matching Engine', 'Pricing Aggregator'],
  },
  {
    label: 'Layer 3 — Marketplace Core',
    color: '#e94560',
    items: ['Briefs / RFP', 'Bids + Packages', 'Delivery Tracker', 'Rate + Tip', 'Talent Tiers'],
  },
  {
    label: 'Layer 4 — Data Layer',
    color: '#00c9a7',
    items: ['Supabase', 'Vector Store', 'Claude API', 'File Storage', 'Cooper (V2)'],
  },
];

export function ArchitectureDiagram() {
  return (
    <div className="mt-10 space-y-3">
      {LAYERS.map((layer, i) => (
        <div key={i} className="stagger-${i + 1}">
          <div
            className="text-xs font-mono mb-2"
            style={{ color: layer.color, fontFamily: 'var(--font-space-mono)' }}
          >
            {layer.label}
          </div>
          <div className="flex flex-wrap gap-2">
            {layer.items.map((item) => (
              <div
                key={item}
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  background: `${layer.color}18`,
                  border: `1px solid ${layer.color}40`,
                  color: '#f0efe9',
                  fontFamily: 'var(--font-outfit)',
                  fontWeight: 400,
                }}
              >
                {item}
              </div>
            ))}
          </div>
          {i < LAYERS.length - 1 && (
            <div className="flex justify-center mt-3">
              <div style={{ color: '#2a2a30', fontSize: '1.2rem' }}>↓</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
