import React from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';

export default function CodeBlock({ title, lang = 'python', code }) {
  const highlighted = Prism.highlight(
    code,
    Prism.languages[lang] || Prism.languages.javascript,
    lang
  );

  return (
    <div className="code-window">
      <div className="code-header">
        <div className="code-dots">
          <span style={{ background: '#ef4444' }} />
          <span style={{ background: '#f59e0b' }} />
          <span style={{ background: '#10b981' }} />
        </div>
        <span className="text-xs text-muted mono">{title}</span>
        <span className="badge-pill badge-cyan">{lang.toUpperCase()}</span>
      </div>
      <pre className="code-pre">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}
