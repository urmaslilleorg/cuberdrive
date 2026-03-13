'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface ConceptSectionProps {
  id: string;
  children: React.ReactNode;
  commentCount?: number;
  onCommentClick?: (sectionId: string) => void;
  noBorder?: boolean;
}

export function ConceptSection({
  id,
  children,
  commentCount = 0,
  onCommentClick,
  noBorder = false,
}: ConceptSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={`section-fade relative ${visible ? 'visible' : ''}`}
      style={{
        padding: '80px 0',
        borderBottom: noBorder ? 'none' : '1px solid #2a2a30',
      }}
    >
      {/* Comment icon */}
      {onCommentClick && (
        <button
          onClick={() => onCommentClick(id)}
          className="absolute top-6 right-0 flex items-center gap-1.5 transition-all duration-200 hover:opacity-100 group"
          style={{ opacity: 0.4 }}
          title={`${commentCount} comment${commentCount !== 1 ? 's' : ''}`}
        >
          <span
            className="text-xs font-mono"
            style={{ color: commentCount > 0 ? '#e94560' : '#6b6b74' }}
          >
            {commentCount > 0 ? commentCount : ''}
          </span>
          <MessageSquare
            size={16}
            style={{ color: commentCount > 0 ? '#e94560' : '#6b6b74' }}
            className="group-hover:text-[#e94560] transition-colors"
          />
        </button>
      )}
      {children}
    </section>
  );
}
