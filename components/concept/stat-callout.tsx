interface StatCalloutProps {
  value: string;
  label: string;
}

export function StatCallout({ value, label }: StatCalloutProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <span
        className="font-mono font-bold leading-none"
        style={{
          color: '#e94560',
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontFamily: 'var(--font-space-mono)',
        }}
      >
        {value}
      </span>
      <span
        className="mt-2 text-sm"
        style={{ color: '#6b6b74', fontFamily: 'var(--font-outfit)', fontWeight: 300 }}
      >
        {label}
      </span>
    </div>
  );
}
