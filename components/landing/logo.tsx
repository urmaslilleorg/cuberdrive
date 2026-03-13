'use client';

import Link from 'next/link';

interface LogoProps {
  size?: 'hero' | 'small' | 'mini';
  linkTo?: string;
  className?: string;
}

export function Logo({ size = 'hero', linkTo = '/concept', className = '' }: LogoProps) {
  const sizeClasses = {
    hero: 'text-[clamp(4.5rem,9vw,9rem)]',
    small: 'text-3xl',
    mini: 'text-xl',
  };

  const content = (
    <span
      className={`font-mono font-bold tracking-tight cursor-pointer select-none transition-all duration-300 group ${sizeClasses[size]} ${className}`}
      style={{ fontFamily: 'var(--font-space-mono)' }}
    >
      <span style={{ color: '#e94560' }}>c</span>
      <span
        style={{ color: '#f0efe9' }}
        className="group-hover:opacity-80 transition-opacity duration-300"
      >
        UBER
      </span>
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
