import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { HEAPSORT_SIM_STEPS } from '../data/slidesData';

const NODE_POS = [
  { x: 160, y: 34 },
  { x: 92, y: 102 },
  { x: 228, y: 102 },
  { x: 54, y: 170 },
];

export default function HeapsortSimulator() {
  const [stepIdx, setStepIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    if (!autoPlay) return undefined;
    if (stepIdx >= HEAPSORT_SIM_STEPS.length - 1) {
      setAutoPlay(false);
      return undefined;
    }
    const timer = setTimeout(() => setStepIdx((s) => s + 1), 1700);
    return () => clearTimeout(timer);
  }, [autoPlay, stepIdx]);

  const cur = HEAPSORT_SIM_STEPS[stepIdx];

  return (
    <div className="glass-panel card-pad flex flex-col gap-3">
      <div className="sim-toolbar">
        <div className="flex-row gap-2">
          <span className="badge-pill badge-amber">{cur.phase}</span>
          <span className="text-sm font-bold">{cur.action}</span>
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
            disabled={stepIdx === HEAPSORT_SIM_STEPS.length - 1}
            onClick={() => setStepIdx((s) => Math.min(HEAPSORT_SIM_STEPS.length - 1, s + 1))}
          >
            Bước tiếp <SkipForward size={14} />
          </button>
          <button type="button" className="sim-btn" onClick={() => setAutoPlay((v) => !v)}>
            {autoPlay ? <Pause size={14} /> : <Play size={14} />}
            {autoPlay ? 'Tạm dừng' : 'Tự động'}
          </button>
          <button
            type="button"
            className="sim-btn"
            onClick={() => {
              setAutoPlay(false);
              setStepIdx(0);
            }}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      <div className="grid-2-weighted">
        <div className="glass-panel-sm card-pad">
          <div className="card-title">Sơ đồ Cây nhị phân (Binary Heap)</div>
          <svg viewBox="0 0 320 205" style={{ width: '100%', maxHeight: '190px' }}>
            {[
              [0, 1],
              [0, 2],
              [1, 3],
            ].map(([p, c]) => {
              const locked = c >= cur.heapSize && cur.heapSize > 0;
              return (
                <line
                  key={`${p}-${c}`}
                  x1={NODE_POS[p].x}
                  y1={NODE_POS[p].y}
                  x2={NODE_POS[c].x}
                  y2={NODE_POS[c].y}
                  stroke={locked ? 'rgba(16,185,129,0.35)' : 'rgba(251,146,60,0.55)'}
                  strokeWidth="2.5"
                  strokeDasharray={locked ? '4 4' : undefined}
                />
              );
            })}
            {cur.array.map((val, idx) => {
              const pos = NODE_POS[idx];
              const isLocked = idx >= cur.heapSize || cur.heapSize === 0;
              const isSwap = cur.swapIndices.includes(idx);
              const fill = isLocked
                ? '#065f46'
                : isSwap
                ? '#b45309'
                : '#1e293b';
              const stroke = isLocked
                ? '#34d399'
                : isSwap
                ? '#fbbf24'
                : '#fb923c';
              return (
                <g key={idx}>
                  <circle cx={pos.x} cy={pos.y} r="22" fill={fill} stroke={stroke} strokeWidth="2.5" />
                  <text x={pos.x} y={pos.y + 5} textAnchor="middle" fill="#f8fafc" fontWeight="700" fontSize="14">
                    {val}
                  </text>
                  <text x={pos.x} y={pos.y + 34} textAnchor="middle" fill="#94a3b8" fontSize="10">
                    arr[{idx}]
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="glass-panel-sm card-pad flex flex-col gap-3">
          <div className="card-title">Mảng 1 chiều &amp; Bảng Trace Giai đoạn 2</div>
          <div className="cells-row">
            {cur.array.map((val, idx) => {
              const isLocked = idx >= cur.heapSize || cur.heapSize === 0;
              const isSwap = cur.swapIndices.includes(idx);
              return (
                <div
                  key={idx}
                  className={`array-cell ${isLocked ? 'cell-done' : isSwap ? 'cell-amber' : ''}`}
                >
                  <span>{val}</span>
                  <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>[{idx}]</span>
                </div>
              );
            })}
          </div>
          <p className="card-text">{cur.note}</p>
        </div>
      </div>
    </div>
  );
}
