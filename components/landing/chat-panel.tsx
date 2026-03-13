'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { ChatMessage } from './chat-message';
import { Message, sendMessage } from '@/lib/chat';
import { getSessionId, clearSession } from '@/lib/identity';

const EXAMPLE_PROMPTS = [
  'Summer campaign for sunscreen',
  'Brand identity refresh for a startup',
  '20 banner variants for a product launch',
  'Social content calendar for Q3',
];

interface ChatPanelProps {
  onChatActive: (active: boolean) => void;
}

// Extract clickable options from assistant message
// Looks for lines starting with A), B), C) or 1., 2., 3. or — or bullet patterns
function extractOptions(content: string): string[] {
  const lines = content.split('\n');
  const options: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Match: A) ..., B) ..., 1. ..., 2. ..., - ..., • ...
    const match = trimmed.match(/^(?:[A-D]\)|[1-9]\.|[-•–])\s+(.+)$/);
    if (match && match[1]) {
      const text = match[1].trim();
      // Only include short options (not full sentences > 80 chars)
      if (text.length <= 80) {
        options.push(text);
      }
    }
  }

  // Return options only if we found 2–6 of them (looks like a real choice list)
  if (options.length >= 2 && options.length <= 6) {
    return options;
  }
  return [];
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

  // Get options from the last assistant message (only when not streaming)
  const lastMessage = messages[messages.length - 1];
  const pillOptions =
    !isStreaming && lastMessage?.role === 'assistant' && lastMessage.content
      ? extractOptions(lastMessage.content)
      : [];

  return (
    <div className="w-full max-w-[600px] mx-auto">
      {/* Chat messages area */}
      {isActive && (
        <div
          ref={chatContainerRef}
          className="mb-3 overflow-y-auto"
          style={{
            maxHeight: '60vh',
            minHeight: '200px',
            padding: '16px 0',
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

      {/* Clickable pill options (shown after last assistant message, not streaming) */}
      {isActive && pillOptions.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {pillOptions.map((option, i) => (
            <button
              key={i}
              onClick={() => handlePromptClick(option)}
              className="text-sm px-3 py-1.5 rounded-full transition-all duration-150 hover:border-[#D97757] hover:text-[#D97757] cursor-pointer"
              style={{
                color: '#6B6B6B',
                background: '#FFFFFF',
                border: '1px solid #E5E5E0',
                fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* Rate limit error */}
      {rateLimitError && (
        <div
          className="mb-3 px-4 py-2 rounded-lg text-sm text-center"
          style={{
            background: 'rgba(217, 119, 87, 0.06)',
            color: '#D97757',
            border: '1px solid rgba(217, 119, 87, 0.2)',
          }}
        >
          {rateLimitError}
        </div>
      )}

      {/* Input bar */}
      <div
        className="relative flex items-center gap-2 rounded-xl transition-all duration-200"
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E5E0',
          padding: '12px 16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
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
          className="flex-1 bg-transparent outline-none resize-none text-sm leading-relaxed disabled:opacity-50"
          style={{
            color: '#1A1A1A',
            fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
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
            background: '#D97757',
            color: '#FFFFFF',
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
              className="text-xs px-3 py-1.5 rounded-full transition-colors duration-200 hover:border-[#D97757] hover:text-[#D97757] cursor-pointer"
              style={{
                color: '#9B9B9B',
                background: 'transparent',
                border: '1px solid #E5E5E0',
                fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* New chat button (only when active) */}
      {isActive && (
        <div className="mt-2 flex justify-center">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 text-xs transition-colors duration-200 hover:text-[#1A1A1A]"
            style={{
              color: '#9B9B9B',
              fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
            }}
          >
            <RotateCcw size={12} />
            New conversation
          </button>
        </div>
      )}
    </div>
  );
}
