import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { TIMSORT_SIM_STEPS } from '../data/slidesData';

export default function TimsortSimulator() {
  const [stepIdx, setStepIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    if (!autoPlay) return undefined;
    if (stepIdx >= TIMSORT_SIM_STEPS.length - 1) {
      setAutoPlay(false);
      return undefined;
    }
    const timer = setTimeout(() => setStepIdx((s) => s + 1), 1600);
    return () => clearTimeout(timer);
  }, [autoPlay, stepIdx]);

  const current = TIMSORT_SIM_STEPS[stepIdx];
  const toneClass = (tone) => {
    if (tone === 'emerald') return 'cell-emerald';
    if (tone === 'cyan') return 'cell-cyan';
    if (tone === 'warn') return 'cell-warn';
    if (tone === 'teal') return 'cell-cyan';
    if (tone === 'done') return 'cell-done';
    return '';
  };

  return (
    <div className="glass-panel card-pad flex flex-col gap-3">
      <div className="sim-toolbar">
        <div className="flex-row gap-2">
          <span className="badge-pill badge-emerald">{current.badge}</span>
          <strong>{current.title}</strong>
        </div>
        <div className="flex-row gap-2">
          <button
            type="button"
            className="sim-btn"
            disabled={stepIdx === 0}
            onClick={() => {
              setAutoPlay(false);
              setStepIdx((s) => Math.max(0, s - 1));
            }}
          >
            <SkipBack size={14} /> Quay lại
          </button>
          <button
            type="button"
            className="sim-btn primary"
            disabled={stepIdx === TIMSORT_SIM_STEPS.length - 1}
            onClick={() => {
              setAutoPlay(false);
              setStepIdx((s) => Math.min(TIMSORT_SIM_STEPS.length - 1, s + 1));
            }}
          >
            Bước tiếp <SkipForward size={14} />
          </button>
          <button type="button" className="sim-btn" onClick={() => setAutoPlay((v) => !v)}>
            {autoPlay ? <Pause size={14} /> : <Play size={14} />}
            {autoPlay ? 'Tạm dừng' : 'Tự động chạy'}
          </button>
          <button
            type="button"
            className="sim-btn"
            onClick={() => {
              setAutoPlay(false);
              setStepIdx(0);
            }}
          >
            <RotateCcw size={14} /> Đặt lại
          </button>
        </div>
      </div>

      <p className="card-text">{current.description}</p>

      <div className="array-strip">
        {current.groups.map((grp, idx) => (
          <div key={idx} className="run-group">
            <span className="run-group-label">{grp.label}</span>
            <div className="cells-row">
              {grp.items.map((val, cIdx) => (
                <div key={`${idx}-${cIdx}`} className={`array-cell ${toneClass(grp.tone)}`}>
                  {val}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel-sm card-pad text-sm" style={{ padding: '10px 14px' }}>
        {current.highlightText}
      </div>
    </div>
  );
}
