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
          className="max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed"
          style={{
            background: '#F0F0EA',
            color: '#1A1A1A',
            fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  if (isBrief) {
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
              className="px-4 py-3 text-sm leading-relaxed mb-2"
              style={{
                color: '#1A1A1A',
                fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
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
        className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${isStreaming ? 'streaming-cursor' : ''}`}
        style={{
          color: '#1A1A1A',
          fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
        }}
      >
        {content || <span style={{ color: '#9B9B9B' }}>Thinking...</span>}
      </div>
    </div>
  );
}
