const LAYERS = [
  {
    label: 'Layer 1 — Interfaces',
    color: '#3B7DD8',
    bg: 'rgba(59, 125, 216, 0.06)',
    border: 'rgba(59, 125, 216, 0.2)',
    items: ['Create Anything', 'Brand Dashboard', 'Talent Portal', 'Slack'],
  },
  {
    label: 'Layer 2 — AI Orchestration',
    color: '#9B59B6',
    bg: 'rgba(155, 89, 182, 0.06)',
    border: 'rgba(155, 89, 182, 0.2)',
    items: ['Brief Agent', 'Brand CMO Agent', 'Talent Bid Agent', 'Matching Engine', 'Pricing Aggregator'],
  },
  {
    label: 'Layer 3 — Marketplace Core',
    color: '#D97757',
    bg: 'rgba(217, 119, 87, 0.06)',
    border: 'rgba(217, 119, 87, 0.2)',
    items: ['Briefs / RFP', 'Bids + Packages', 'Delivery Tracker', 'Rate + Tip', 'Talent Tiers'],
  },
  {
    label: 'Layer 4 — Data Layer',
    color: '#4A9E7E',
    bg: 'rgba(74, 158, 126, 0.06)',
    border: 'rgba(74, 158, 126, 0.2)',
    items: ['Supabase', 'Vector Store', 'Claude API', 'File Storage', 'Cooper (V2)'],
  },
];

export function ArchitectureDiagram() {
  return (
    <div className="mt-10 space-y-3">
      {LAYERS.map((layer, i) => (
        <div key={i}>
          <div
            className="text-xs font-medium mb-2"
            style={{ color: layer.color, fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            {layer.label}
          </div>
          <div className="flex flex-wrap gap-2">
            {layer.items.map((item) => (
              <div
                key={item}
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  background: layer.bg,
                  border: `1px solid ${layer.border}`,
                  color: '#1A1A1A',
                  fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontWeight: 400,
                }}
              >
                {item}
              </div>
            ))}
          </div>
          {i < LAYERS.length - 1 && (
            <div className="flex justify-center mt-3">
              <div style={{ color: '#D5D5D0', fontSize: '1.2rem' }}>↓</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
