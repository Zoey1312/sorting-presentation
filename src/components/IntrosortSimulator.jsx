import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { INTROSORT_SCENARIOS } from '../data/slidesData';

export default function IntrosortSimulator() {
  const [tab, setTab] = useState('standard');
  const [stepIdx, setStepIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const scenario = INTROSORT_SCENARIOS[tab];
  const current = scenario.steps[stepIdx] || scenario.steps[0];

  useEffect(() => {
    setStepIdx(0);
    setAutoPlay(false);
  }, [tab]);

  useEffect(() => {
    if (!autoPlay) return undefined;
    if (stepIdx >= scenario.steps.length - 1) {
      setAutoPlay(false);
      return undefined;
    }
    const timer = setTimeout(() => setStepIdx((s) => s + 1), 1600);
    return () => clearTimeout(timer);
  }, [autoPlay, stepIdx, scenario.steps.length]);

  const roleClass = (role) => {
    if (role === 'pivot') return 'cell-pivot';
    if (role === 'insertion') return 'cell-emerald';
    if (role === 'heapsort') return 'cell-amber';
    if (role === 'active') return 'cell-violet';
    if (role === 'done') return 'cell-done';
    return 'cell-cyan';
  };

  return (
    <div className="glass-panel card-pad flex flex-col gap-3">
      <div className="sim-toolbar">
        <div className="flex-row gap-2">
          <button
            type="button"
            className={`tab-btn ${tab === 'standard' ? 'active' : ''}`}
            onClick={() => setTab('standard')}
          >
            {INTROSORT_SCENARIOS.standard.label}
          </button>
          <button
            type="button"
            className={`tab-btn ${tab === 'heapsortFallback' ? 'active' : ''}`}
            onClick={() => setTab('heapsortFallback')}
          >
            {INTROSORT_SCENARIOS.heapsortFallback.label}
          </button>
        </div>
        <div className="flex-row gap-2">
          <button
            type="button"
            className="sim-btn"
            disabled={stepIdx === 0}
            onClick={() => setStepIdx((s) => Math.max(0, s - 1))}
          >
            <SkipBack size={14} /> Quay lại
          </button>
          <button
            type="button"
            className="sim-btn primary"
            disabled={stepIdx === scenario.steps.length - 1}
            onClick={() => setStepIdx((s) => Math.min(scenario.steps.length - 1, s + 1))}
          >
            Bước tiếp <SkipForward size={14} />
          </button>
          <button type="button" className="sim-btn" onClick={() => setAutoPlay((v) => !v)}>
            {autoPlay ? <Pause size={14} /> : <Play size={14} />}
            {autoPlay ? 'Tạm dừng' : 'Tự động'}
          </button>
        </div>
      </div>

      <p className="text-sm text-muted">{scenario.subtitle}</p>

      <div className="array-strip">
        {current.segments.map((seg, i) => (
          <div key={i} className="run-group">
            <span className="run-group-label">{seg.label}</span>
            <div className="cells-row">
              {seg.values.map((v, j) => (
                <div key={`${i}-${j}`} className={`array-cell ${roleClass(seg.role)}`}>
                  {v}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Bước</th>
            <th>Đoạn (Size)</th>
            <th>Depth</th>
            <th>Thuật toán</th>
            <th>Pivot &amp; Kết quả xử lý</th>
          </tr>
        </thead>
        <tbody>
          {scenario.steps.map((row, idx) => (
            <tr
              key={row.step}
              className={idx === stepIdx ? 'row-highlight' : ''}
              style={{ cursor: 'pointer' }}
              onClick={() => setStepIdx(idx)}
            >
              <td className="font-bold">{row.step}</td>
              <td className="mono">{row.range}</td>
              <td className="mono">{row.depth}</td>
              <td>{row.algo}</td>
              <td>{row.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
