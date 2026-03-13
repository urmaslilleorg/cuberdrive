'use client';

interface StructuredBriefCardProps {
  content: string;
}

export function StructuredBriefCard({ content }: StructuredBriefCardProps) {
  // Parse the brief content into sections
  const lines = content.split('\n');
  const sections: Array<{ type: 'heading' | 'subheading' | 'text' | 'list-item' | 'separator' | 'bold-line'; content: string }> = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('## ')) {
      sections.push({ type: 'heading', content: trimmed.replace(/^## /, '') });
    } else if (trimmed.startsWith('### ')) {
      sections.push({ type: 'subheading', content: trimmed.replace(/^### /, '') });
    } else if (trimmed.startsWith('---')) {
      sections.push({ type: 'separator', content: '' });
    } else if (trimmed.startsWith('- ')) {
      sections.push({ type: 'list-item', content: trimmed.replace(/^- /, '') });
    } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      sections.push({ type: 'bold-line', content: trimmed.replace(/\*\*/g, '') });
    } else {
      sections.push({ type: 'text', content: trimmed });
    }
  }

  const renderInline = (text: string) => {
    // Handle **bold** inline
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: '#f0efe9', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div
      className="rounded-xl p-5 mt-2 mb-2"
      style={{
        background: '#13131a',
        border: '1px solid rgba(233, 69, 96, 0.3)',
        maxWidth: '100%',
      }}
    >
      <div className="space-y-2">
        {sections.map((section, i) => {
          if (section.type === 'separator') {
            return <hr key={i} style={{ borderColor: '#2a2a30', margin: '8px 0' }} />;
          }
          if (section.type === 'heading') {
            return (
              <h2 key={i} className="text-base font-semibold" style={{ color: '#e94560', fontFamily: 'var(--font-syne)' }}>
                {section.content}
              </h2>
            );
          }
          if (section.type === 'subheading') {
            return (
              <h3 key={i} className="text-xs font-semibold uppercase tracking-widest mt-3 mb-1" style={{ color: '#f0efe9' }}>
                {section.content}
              </h3>
            );
          }
          if (section.type === 'list-item') {
            return (
              <div key={i} className="flex gap-2 text-sm" style={{ color: '#f0efe9' }}>
                <span style={{ color: '#e94560', flexShrink: 0 }}>→</span>
                <span>{renderInline(section.content)}</span>
              </div>
            );
          }
          if (section.type === 'bold-line') {
            return (
              <p key={i} className="text-sm font-semibold" style={{ color: '#f0efe9' }}>
                {section.content}
              </p>
            );
          }
          return (
            <p key={i} className="text-sm leading-relaxed" style={{ color: '#6b6b74' }}>
              {renderInline(section.content)}
            </p>
          );
        })}
      </div>

      <div className="mt-4 pt-4" style={{ borderTop: '1px solid #2a2a30' }}>
        <button
          disabled
          className="w-full py-2.5 px-4 rounded-lg text-sm font-medium cursor-not-allowed opacity-50 transition-all"
          style={{
            background: '#e94560',
            color: '#f0efe9',
            fontFamily: 'var(--font-space-mono)',
          }}
          title="Available in the full CUBER platform"
        >
          Push to talent → (Available in full platform)
        </button>
      </div>
    </div>
  );
}
