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
    <div className="code-window rounded-3xl overflow-hidden flex flex-col flex-1 min-h-0">
      <div className="code-header">
        <div className="code-dots">
          <span style={{ background: '#FF5F57' }} />
          <span style={{ background: '#FEBC2E' }} />
          <span style={{ background: '#28C840' }} />
        </div>
        <span className="code-filename">{title}</span>
        <span className="badge-pill badge-accent">{lang.toUpperCase()}</span>
      </div>
      <pre className="code-pre text-sm xl:text-base font-mono leading-relaxed">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}
