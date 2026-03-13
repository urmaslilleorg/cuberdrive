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
                color: '#9B9B9B',
                fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                borderBottom: '1px solid #E5E5E0',
              }}
            >
              Deliverable
            </th>
            {['Adapt', 'Customise', 'Create'].map((col) => (
              <th
                key={col}
                className="text-right py-3 px-4 text-sm font-medium"
                style={{
                  color: col === 'Create' ? '#D97757' : '#9B9B9B',
                  fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                  borderBottom: '1px solid #E5E5E0',
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
              className="transition-colors duration-150 hover:bg-[#F5F5F0]"
            >
              <td
                className="py-3 px-4 text-sm"
                style={{
                  color: '#1A1A1A',
                  fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                  borderBottom: '1px solid #E5E5E0',
                }}
              >
                {row.deliverable}
              </td>
              <td
                className="py-3 px-4 text-right text-sm"
                style={{
                  color: '#9B9B9B',
                  fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                  borderBottom: '1px solid #E5E5E0',
                }}
              >
                {row.adapt}
              </td>
              <td
                className="py-3 px-4 text-right text-sm"
                style={{
                  color: '#6B6B6B',
                  fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                  borderBottom: '1px solid #E5E5E0',
                }}
              >
                {row.customise}
              </td>
              <td
                className="py-3 px-4 text-right text-sm font-semibold"
                style={{
                  color: '#D97757',
                  fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                  borderBottom: '1px solid #E5E5E0',
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
