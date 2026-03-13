interface StatCalloutProps {
  value: string;
  label: string;
}

export function StatCallout({ value, label }: StatCalloutProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <span
        className="font-bold leading-none"
        style={{
          color: '#D97757',
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </span>
      <span
        className="mt-2 text-sm"
        style={{ color: '#9B9B9B', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 400 }}
      >
        {label}
      </span>
    </div>
  );
}
