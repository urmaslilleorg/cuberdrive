'use client';

import { useState } from 'react';
import { Logo } from '@/components/landing/logo';
import { ChatPanel } from '@/components/landing/chat-panel';

export default function LandingPage() {
  const [chatActive, setChatActive] = useState(false);

  return (
    <main
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
      style={{ background: '#FAFAF8' }}
    >
      {/* Content container */}
      <div
        className="relative z-10 flex flex-col items-center w-full px-6"
        style={{ maxWidth: '700px' }}
      >
        {/* Logo */}
        <div
          className="transition-all duration-500 ease-out"
          style={{
            transform: chatActive ? 'scale(0.5) translateY(-16px)' : 'scale(1)',
            marginBottom: chatActive ? '-16px' : '0',
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
            <p
              className="text-center mt-4"
              style={{
                color: '#6B6B6B',
                fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                letterSpacing: '0',
              }}
            >
              Creative talent{' '}
              <span style={{ color: '#9B9B9B' }}>·</span>{' '}
              AI coworkers{' '}
              <span style={{ color: '#9B9B9B' }}>·</span>{' '}
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
