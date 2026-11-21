import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';
import { COMPARISON_ROWS, QA_FLASHCARDS } from '../data/slidesData';

export default function SummaryView() {
  const [flipped, setFlipped] = useState({});

  const toggle = (id) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="glass-panel card-pad">
        <table className="data-table">
          <thead>
            <tr>
              <th>Thuật toán</th>
              <th>Tốt nhất</th>
              <th>Trung bình</th>
              <th>Xấu nhất</th>
              <th>Bộ nhớ phụ</th>
              <th>Ổn định (Stable)</th>
              <th>Ứng dụng tiêu biểu</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((r) => (
              <tr key={r.name}>
                <td className="font-bold">{r.name}</td>
                <td className="mono">{r.best}</td>
                <td className="mono">{r.average}</td>
                <td className="mono">{r.worst}</td>
                <td className="mono">{r.space}</td>
                <td>{r.stable}</td>
                <td>{r.apps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flip-grid">
        {QA_FLASHCARDS.map((card) => {
          const isOpen = !!flipped[card.id];
          return (
            <div
              key={card.id}
              className={`flip-card ${isOpen ? 'flipped' : ''}`}
              onClick={() => toggle(card.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggle(card.id);
                }
              }}
            >
              <div className="flip-card-inner">
                <div className="flip-face flip-front">
                  <div>
                    <span className="badge-pill badge-violet">{card.tag}</span>
                    <p className="card-title mt-2">{card.question}</p>
                  </div>
                  <div className="flex-row gap-2 text-xs text-muted">
                    <RotateCw size={13} /> Bấm vào thẻ để lật mở đáp án
                  </div>
                </div>
                <div className="flip-face flip-back">
                  <div>
                    <span className="badge-pill badge-emerald">Đáp án chuẩn Q&amp;A</span>
                    <p className="card-text mt-2">{card.answer}</p>
                  </div>
                  <div className="mono text-xs" style={{ color: '#67e8f9' }}>
                    {card.formula}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
