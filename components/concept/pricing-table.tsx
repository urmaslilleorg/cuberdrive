const ROWS = [
  { deliverable: 'Instagram carousel (5 slides)', adapt: '$280', customise: '$520', create: '$1,100' },
  { deliverable: 'Static banner (standard sizes)', adapt: '$192', customise: '$380', create: '$720' },
  { deliverable: 'eDetail (Veeva, up to 10 pages)', adapt: '$1,080', customise: '$1,440', create: '$2,700' },
  { deliverable: 'Landing page (responsive)', adapt: '$624', customise: '$1,200', create: '$2,400' },
  { deliverable: 'Brand video (30s, social)', adapt: '$1,500', customise: '$3,200', create: '$6,500' },
];

export function PricingTable() {
  return (
    <div className="mt-10 overflow-x-auto">
      <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            <th
              className="text-left py-3 px-4 text-sm font-medium"
              style={{
                color: '#6b6b74',
                fontFamily: 'var(--font-space-mono)',
                borderBottom: '1px solid #2a2a30',
              }}
            >
              Deliverable
            </th>
            {['Adapt', 'Customise', 'Create'].map((col) => (
              <th
                key={col}
                className="text-right py-3 px-4 text-sm font-medium"
                style={{
                  color: col === 'Create' ? '#e94560' : '#6b6b74',
                  fontFamily: 'var(--font-space-mono)',
                  borderBottom: '1px solid #2a2a30',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => (
            <tr
              key={i}
              className="transition-colors duration-150 hover:bg-[rgba(255,255,255,0.02)]"
            >
              <td
                className="py-3 px-4 text-sm"
                style={{
                  color: '#f0efe9',
                  fontFamily: 'var(--font-outfit)',
                  borderBottom: '1px solid #2a2a30',
                }}
              >
                {row.deliverable}
              </td>
              <td
                className="py-3 px-4 text-right text-sm font-mono"
                style={{
                  color: '#6b6b74',
                  fontFamily: 'var(--font-space-mono)',
                  borderBottom: '1px solid #2a2a30',
                }}
              >
                {row.adapt}
              </td>
              <td
                className="py-3 px-4 text-right text-sm font-mono"
                style={{
                  color: '#f0efe9',
                  fontFamily: 'var(--font-space-mono)',
                  borderBottom: '1px solid #2a2a30',
                }}
              >
                {row.customise}
              </td>
              <td
                className="py-3 px-4 text-right text-sm font-mono font-bold"
                style={{
                  color: '#e94560',
                  fontFamily: 'var(--font-space-mono)',
                  borderBottom: '1px solid #2a2a30',
                }}
              >
                {row.create}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
