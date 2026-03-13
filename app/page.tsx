'use client';

import { useState } from 'react';
import { Logo } from '@/components/landing/logo';
import { ChatPanel } from '@/components/landing/chat-panel';

export default function LandingPage() {
  const [chatActive, setChatActive] = useState(false);

  return (
    <main
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
      style={{ background: '#08080a' }}
    >
      {/* Corner marks */}
      <div className="corner-mark corner-mark-tl" style={{ top: '24px', left: '24px' }} />
      <div className="corner-mark corner-mark-tr" style={{ top: '24px', right: '24px' }} />
      <div className="corner-mark corner-mark-bl" style={{ bottom: '24px', left: '24px' }} />
      <div className="corner-mark corner-mark-br" style={{ bottom: '24px', right: '24px' }} />

      {/* Radial glow behind logo */}
      <div
        className="logo-glow absolute pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(233,69,96,0.08) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Content container */}
      <div
        className="relative z-10 flex flex-col items-center w-full px-6"
        style={{ maxWidth: '700px' }}
      >
        {/* Logo */}
        <div
          className="transition-all duration-500 ease-out"
          style={{
            transform: chatActive ? 'scale(0.4) translateY(-20px)' : 'scale(1)',
            marginBottom: chatActive ? '-20px' : '0',
          }}
        >
          <Logo size="hero" linkTo="/concept" />
        </div>

        {/* Tagline */}
        <div
          className="transition-all duration-400 ease-out overflow-hidden"
          style={{
            opacity: chatActive ? 0 : 1,
            maxHeight: chatActive ? '0' : '80px',
          }}
        >
          <div className="flex flex-col items-center">
            <div
              style={{
                width: '48px',
                height: '1px',
                background: '#e94560',
                margin: '16px 0',
              }}
            />
            <p
              className="text-center tracking-widest"
              style={{
                color: '#f0efe9',
                fontFamily: 'var(--font-outfit)',
                fontWeight: 200,
                fontSize: 'clamp(0.75rem, 2vw, 1rem)',
                letterSpacing: '0.15em',
              }}
            >
              Creative talent{' '}
              <span style={{ color: '#e94560' }}>·</span>{' '}
              AI coworkers{' '}
              <span style={{ color: '#e94560' }}>·</span>{' '}
              One ride
            </p>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ height: chatActive ? '16px' : '40px' }} className="transition-all duration-300" />

        {/* Chat panel */}
        <ChatPanel onChatActive={setChatActive} />
      </div>
    </main>
  );
}
