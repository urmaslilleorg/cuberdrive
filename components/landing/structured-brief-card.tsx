'use client';

interface StructuredBriefCardProps {
  content: string;
}

export function StructuredBriefCard({ content }: StructuredBriefCardProps) {
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
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: '#1A1A1A', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div
      className="rounded-xl p-5 mt-2 mb-2"
      style={{
        background: '#F5F5F0',
        border: '1px solid #E5E5E0',
        maxWidth: '100%',
      }}
    >
      <div className="space-y-2">
        {sections.map((section, i) => {
          if (section.type === 'separator') {
            return <hr key={i} style={{ borderColor: '#E5E5E0', margin: '8px 0' }} />;
          }
          if (section.type === 'heading') {
            return (
              <h2 key={i} className="text-base font-semibold" style={{ color: '#D97757', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                {section.content}
              </h2>
            );
          }
          if (section.type === 'subheading') {
            return (
              <h3 key={i} className="text-xs font-semibold uppercase tracking-widest mt-3 mb-1" style={{ color: '#1A1A1A', fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                {section.content}
              </h3>
            );
          }
          if (section.type === 'list-item') {
            return (
              <div key={i} className="flex gap-2 text-sm" style={{ color: '#1A1A1A' }}>
                <span style={{ color: '#D97757', flexShrink: 0 }}>→</span>
                <span>{renderInline(section.content)}</span>
              </div>
            );
          }
          if (section.type === 'bold-line') {
            return (
              <p key={i} className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>
                {section.content}
              </p>
            );
          }
          return (
            <p key={i} className="text-sm leading-relaxed" style={{ color: '#6B6B6B' }}>
              {renderInline(section.content)}
            </p>
          );
        })}
      </div>

      <div className="mt-4 pt-4" style={{ borderTop: '1px solid #E5E5E0' }}>
        <button
          disabled
          className="w-full py-2.5 px-4 rounded-lg text-sm font-medium cursor-not-allowed opacity-40 transition-all"
          style={{
            background: '#D97757',
            color: '#FFFFFF',
            fontFamily: '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
          }}
          title="Available in the full CUBER platform"
        >
          Push to talent → (Available in full platform)
        </button>
      </div>
    </div>
  );
}
