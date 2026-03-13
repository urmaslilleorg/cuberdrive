'use client';

import Link from 'next/link';

interface LogoProps {
  size?: 'hero' | 'small' | 'mini';
  linkTo?: string;
  className?: string;
}

export function Logo({ size = 'hero', linkTo = '/concept', className = '' }: LogoProps) {
  const sizeStyles: Record<string, React.CSSProperties> = {
    hero: {
      fontSize: '64px',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1,
    },
    small: {
      fontSize: '22px',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1,
    },
    mini: {
      fontSize: '16px',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1,
    },
  };

  const content = (
    <span
      className={`cursor-pointer select-none transition-opacity duration-200 hover:opacity-80 ${className}`}
      style={{
        fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
        ...sizeStyles[size],
      }}
    >
      <span style={{ color: '#D97757' }}>c</span>
      <span style={{ color: '#1A1A1A' }}>UBER</span>
    </span>
  );

  if (linkTo) {
    return (
      <Link href={linkTo} className="no-underline hover:no-underline">
        {content}
      </Link>
    );
  }

  return content;
}
