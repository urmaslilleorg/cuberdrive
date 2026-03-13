'use client';

import { StructuredBriefCard } from './structured-brief-card';
import { detectBriefInContent } from '@/lib/chat';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming = false }: ChatMessageProps) {
  const isBrief = role === 'assistant' && detectBriefInContent(content);

  if (role === 'user') {
    return (
      <div className="flex justify-end mb-3">
        <div
          className="max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed"
          style={{
            background: '#e94560',
            color: '#f0efe9',
            fontFamily: 'var(--font-outfit)',
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  if (isBrief) {
    // Split content at the brief marker
    const briefIndex = content.indexOf('## 📋 CUBER BRIEF');
    const briefIndex2 = content.indexOf('## CUBER BRIEF');
    const splitAt = briefIndex !== -1 ? briefIndex : briefIndex2;

    const beforeBrief = splitAt > 0 ? content.slice(0, splitAt).trim() : '';
    const briefContent = content.slice(splitAt);

    return (
      <div className="flex justify-start mb-3">
        <div className="max-w-[90%] w-full">
          {beforeBrief && (
            <div
              className="rounded-xl px-4 py-3 text-sm leading-relaxed mb-2"
              style={{
                background: '#13131a',
                color: '#f0efe9',
                fontFamily: 'var(--font-outfit)',
              }}
            >
              {beforeBrief}
            </div>
          )}
          <StructuredBriefCard content={briefContent} />
          {isStreaming && <span className="streaming-cursor" />}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-3">
      <div
        className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${isStreaming ? 'streaming-cursor' : ''}`}
        style={{
          background: '#13131a',
          color: '#f0efe9',
          fontFamily: 'var(--font-outfit)',
        }}
      >
        {content || <span style={{ color: '#6b6b74' }}>Thinking...</span>}
      </div>
    </div>
  );
}
