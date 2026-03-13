'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight, X, RotateCcw } from 'lucide-react';
import { ChatMessage } from './chat-message';
import { Message, sendMessage } from '@/lib/chat';
import { getSessionId, clearSession } from '@/lib/identity';

const EXAMPLE_PROMPTS = [
  'I need a summer campaign for sunscreen across FB, IG, DOOH',
  'Brand identity refresh for a Nordic skincare startup',
  '20 banner variants for a pharma product launch',
  'Social content calendar for Q3',
];

interface ChatPanelProps {
  onChatActive: (active: boolean) => void;
}

export function ChatPanel({ onChatActive }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [rateLimitError, setRateLimitError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load existing conversation on mount
  useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    fetch(`/api/chat?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
          setConversationId(data.conversation_id);
          setIsActive(true);
          onChatActive(true);
        }
      })
      .catch(() => {});
  }, [onChatActive]);

  const handleSubmit = useCallback(
    async (text?: string) => {
      const content = (text || input).trim();
      if (!content || isStreaming) return;

      setInput('');
      setRateLimitError('');

      const userMessage: Message = { role: 'user', content };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);

      if (!isActive) {
        setIsActive(true);
        onChatActive(true);
      }

      // Add placeholder for assistant
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
      setIsStreaming(true);

      let assistantContent = '';

      await sendMessage(
        newMessages,
        conversationId,
        (chunk) => {
          assistantContent += chunk;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
            return updated;
          });
        },
        (newConvId) => {
          if (newConvId) setConversationId(newConvId);
          setIsStreaming(false);
        },
        (error) => {
          setIsStreaming(false);
          if (error.includes('rate limit') || error.includes('busy')) {
            setRateLimitError("You've been busy! Take a breather and try again in a few minutes.");
            setMessages((prev) => prev.slice(0, -1));
          } else {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: 'assistant',
                content: 'Something went wrong. Please try again.',
              };
              return updated;
            });
          }
        }
      );
    },
    [input, isStreaming, messages, isActive, conversationId, onChatActive]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleNewChat = () => {
    clearSession();
    setMessages([]);
    setConversationId(null);
    setIsActive(false);
    setInput('');
    setRateLimitError('');
    onChatActive(false);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => handleSubmit(prompt), 50);
  };

  return (
    <div className="w-full max-w-[600px] mx-auto">
      {/* Chat messages area */}
      {isActive && (
        <div
          ref={chatContainerRef}
          className="mb-3 overflow-y-auto rounded-xl"
          style={{
            maxHeight: '60vh',
            minHeight: '200px',
            background: 'rgba(19, 19, 26, 0.6)',
            border: '1px solid #2a2a30',
            padding: '16px',
          }}
        >
          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              role={msg.role}
              content={msg.content}
              isStreaming={isStreaming && i === messages.length - 1 && msg.role === 'assistant'}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Rate limit error */}
      {rateLimitError && (
        <div
          className="mb-3 px-4 py-2 rounded-lg text-sm text-center"
          style={{ background: 'rgba(233, 69, 96, 0.1)', color: '#e94560', border: '1px solid rgba(233, 69, 96, 0.2)' }}
        >
          {rateLimitError}
        </div>
      )}

      {/* Input bar */}
      <div
        className="relative flex items-center gap-2 rounded-xl transition-all duration-200"
        style={{
          background: '#13131a',
          border: '1px solid #2a2a30',
          padding: '12px 16px',
        }}
        onFocus={() => {
          const el = document.querySelector('.chat-input-wrapper') as HTMLElement;
          if (el) el.style.borderColor = '#e94560';
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Task anything..."
          disabled={isStreaming}
          maxLength={2000}
          rows={1}
          className="flex-1 bg-transparent outline-none resize-none text-sm leading-relaxed placeholder:text-[#6b6b74] disabled:opacity-50"
          style={{
            color: '#f0efe9',
            fontFamily: 'var(--font-outfit)',
            minHeight: '24px',
            maxHeight: '120px',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = Math.min(target.scrollHeight, 120) + 'px';
          }}
        />
        <button
          onClick={() => handleSubmit()}
          disabled={isStreaming || !input.trim()}
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-30"
          style={{
            background: '#e94560',
            color: '#f0efe9',
          }}
        >
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Example prompts (only when not active) */}
      {!isActive && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {EXAMPLE_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handlePromptClick(prompt)}
              className="text-xs px-3 py-1.5 rounded-full transition-colors duration-200 hover:text-[#e94560] cursor-pointer"
              style={{
                color: '#6b6b74',
                background: 'transparent',
                border: '1px solid #2a2a30',
                fontFamily: 'var(--font-space-mono)',
              }}
            >
              &quot;{prompt}&quot;
            </button>
          ))}
        </div>
      )}

      {/* New chat button (only when active) */}
      {isActive && (
        <div className="mt-2 flex justify-center">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 text-xs transition-colors duration-200 hover:text-[#f0efe9]"
            style={{ color: '#6b6b74', fontFamily: 'var(--font-space-mono)' }}
          >
            <RotateCcw size={12} />
            New conversation
          </button>
        </div>
      )}
    </div>
  );
}
