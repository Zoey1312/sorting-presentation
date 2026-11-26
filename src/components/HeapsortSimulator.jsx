import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  HEAPSORT_SAMPLE_ARRAY,
  formatHeapArrayDivider,
  generateHeapSortFrames,
  generateRandomHeapArray7,
} from '../heapsortEngine';

const bentoItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HeapsortSimulator() {
  const [rawArray, setRawArray] = useState(HEAPSORT_SAMPLE_ARRAY);
  const [isSample, setIsSample] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [hoveredId, setHoveredId] = useState(null);

  const frames = useMemo(() => generateHeapSortFrames(rawArray), [rawArray]);
  const frame = frames[currentStep] || frames[0];
  const maxStep = frames.length - 1;

  const treeStageRef = useRef(null);
  const arrayTrackRef = useRef(null);
  const timelineRowRef = useRef(null);
  const prevPosRef = useRef(new Map());
  const firstTickRef = useRef(true);

  const [treeDims, setTreeDims] = useState({ w: 440, h: 280 });
  const [trackWidth, setTrackWidth] = useState(460);
  const [movedIds, setMovedIds] = useState(new Map());

  useEffect(() => {
    const animMs = Math.round(620 / speed);
    document.documentElement.style.setProperty('--heap-anim-ms', `${animMs}ms`);
  }, [speed]);

  const measureDims = useCallback(() => {
    if (treeStageRef.current) {
      setTreeDims({
        w: treeStageRef.current.clientWidth || 440,
        h: treeStageRef.current.clientHeight || 280,
      });
    }
    if (arrayTrackRef.current) {
      setTrackWidth(arrayTrackRef.current.clientWidth || 460);
    }
  }, []);

  useLayoutEffect(() => {
    measureDims();
  }, [measureDims, rawArray]);

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => measureDims());
    if (treeStageRef.current) ro.observe(treeStageRef.current);
    if (arrayTrackRef.current) ro.observe(arrayTrackRef.current);
    return () => ro.disconnect();
  }, [measureDims]);

  useEffect(() => {
    const nextMoved = new Map();
    frame.items.forEach((item, idx) => {
      const prev = prevPosRef.current.get(item.id);
      if (prev !== undefined && prev !== idx) {
        nextMoved.set(item.id, idx < prev ? 'up' : 'down');
      }
      prevPosRef.current.set(item.id, idx);
    });
    setMovedIds(nextMoved);
  }, [frame]);

  useEffect(() => {
    if (!isPlaying) {
      firstTickRef.current = true;
      return undefined;
    }
    if (currentStep >= maxStep) {
      setIsPlaying(false);
      return undefined;
    }
    const delay = firstTickRef.current ? 150 : Math.round(1350 / speed);
    firstTickRef.current = false;
    const timer = setTimeout(() => {
      setCurrentStep((s) => Math.min(maxStep, s + 1));
    }, delay);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, maxStep, speed]);

  const jumpToStep = useCallback(
    (idx) => {
      setIsPlaying(false);
      setCurrentStep(Math.max(0, Math.min(idx, maxStep)));
    },
    [maxStep]
  );

  const loadArray = useCallback((nextArr, sampleFlag) => {
    setIsPlaying(false);
    setHoveredId(null);
    prevPosRef.current.clear();
    nextArr.forEach((_, idx) => prevPosRef.current.set(idx, idx));
    setRawArray([...nextArr]);
    setIsSample(sampleFlag);
    setCurrentStep(0);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        if (isPlaying) setIsPlaying(false);
        else {
          if (currentStep >= maxStep) setCurrentStep(0);
          setIsPlaying(true);
        }
      } else if (e.key === ',' || e.key === '[') {
        e.preventDefault();
        jumpToStep(currentStep - 1);
      } else if (e.key === '.' || e.key === ']') {
        e.preventDefault();
        jumpToStep(currentStep + 1);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        jumpToStep(0);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPlaying, currentStep, maxStep, jumpToStep]);

  const n = frame.items.length;
  const levels = Math.floor(Math.log2(n)) + 1;
  const padTop = 40;
  const padBottom = 46;
  const usableH = Math.max(110, treeDims.h - padTop - padBottom);
  const levelGap = levels > 1 ? usableH / (levels - 1) : 0;
  const padX = Math.min(42, treeDims.w * 0.09);
  const usableW = Math.max(160, treeDims.w - padX * 2);

  const treeCoords = Array.from({ length: n }, (_, idx) => {
    const level = Math.floor(Math.log2(idx + 1));
    const posInLevel = idx - (Math.pow(2, level) - 1);
    const maxInLevel = Math.pow(2, level);
    return {
      x: padX + ((posInLevel + 0.5) / maxInLevel) * usableW,
      y: padTop + level * levelGap,
    };
  });

  const gap = n <= 4 ? 14 : 10;
  const slotW = (trackWidth - gap * (n - 1)) / n;

  const compareRoleMap = new Map();
  if (frame.comparing) {
    compareRoleMap.set(frame.comparing.parent, `Cha i=${frame.comparing.parent}`);
    frame.comparing.children.forEach((c) => compareRoleMap.set(c.idx, c.formula));
  }
  const swapSet = new Set(frame.swapping || []);
  const pad = 6;
  const sortedCount = n - frame.heapSize;

  return (
    <motion.div variants={bentoItemVariants} className="heap-shell">
      <section className="heap-controls-bar">
        <div className="heap-ctrl-group">
          <button type="button" className="heap-btn" disabled={currentStep === 0} onClick={() => jumpToStep(currentStep - 1)}>
            <span>⏮</span><span>Quay lại</span>
          </button>
          <button type="button" className="heap-btn-next" disabled={currentStep >= maxStep} onClick={() => jumpToStep(currentStep + 1)}>
            <span>Bước tiếp</span><span>⏭</span>
          </button>
          <button
            type="button"
            className="heap-btn-auto"
            onClick={() => {
              if (isPlaying) setIsPlaying(false);
              else {
                if (currentStep >= maxStep) setCurrentStep(0);
                setIsPlaying(true);
              }
            }}
          >
            {isPlaying ? (
              <><span>⏸</span><span>Tạm dừng</span></>
            ) : currentStep >= maxStep && maxStep > 0 ? (
              <><span>↻</span><span>Chạy lại</span></>
            ) : (
              <><span>▶</span><span>Tự động chạy</span></>
            )}
          </button>
          <button type="button" className="heap-btn" onClick={() => jumpToStep(0)}>
            <span>↺</span><span>Đặt lại</span>
          </button>
        </div>

        <div className="heap-ctrl-group">
          <button
            type="button"
            className={`heap-btn-mode ${isSample ? 'is-active' : ''}`}
            onClick={() => loadArray(HEAPSORT_SAMPLE_ARRAY, true)}
          >
            <span>📌</span><span>Mảng mẫu [4, 10, 3, 5]</span>
          </button>
          <button
            type="button"
            className={`heap-btn-mode ${!isSample ? 'is-active' : ''}`}
            onClick={() => loadArray(generateRandomHeapArray7(), false)}
          >
            <span>🎲</span><span>Ngẫu nhiên (7 phần tử)</span>
          </button>
          <div className="heap-speed-box">
            <span>Tốc độ</span>
            <input
              className="heap-speed-slider"
              type="range"
              min="0.5"
              max="2.5"
              step="0.25"
              value={speed}
              aria-label="Tốc độ mô phỏng"
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
            <span className="heap-speed-label">{speed.toFixed(speed % 1 === 0 ? 1 : 2)}x</span>
          </div>
        </div>
      </section>

      <main className="heap-main-grid">
        <section className="heap-tree-card">
          <div className="heap-card-header">
            <h3 className="heap-card-title">Sơ đồ Cây nhị phân "co lại"</h3>
            <span
              className={`heap-size-badge ${
                frame.heapSize === 0 ? 'is-done' : frame.heapSize < n ? 'is-shrinking' : 'is-full'
              }`}
            >
              Kích thước Heap: {frame.heapSize} / {n}
            </span>
          </div>

          <div ref={treeStageRef} className="heap-tree-stage" aria-label="Sơ đồ Cây nhị phân Heap co lại">
            <svg id="heap-tree-svg" viewBox={`0 0 ${treeDims.w} ${treeDims.h}`} xmlns="http://www.w3.org/2000/svg">
              {Array.from({ length: Math.max(0, n - 1) }, (_, idx) => {
                const child = idx + 1;
                const parent = Math.floor((child - 1) / 2);
                const p = treeCoords[parent];
                const c = treeCoords[child];
                const isChildLocked = child >= frame.heapSize;
                const isCompareEdge =
                  frame.comparing &&
                  frame.comparing.parent === parent &&
                  frame.comparing.children.some((ch) => ch.idx === child);
                const isSwapEdge = swapSet.has(parent) && swapSet.has(child);

                return (
                  <line
                    key={`${parent}-${child}`}
                    x1={p.x}
                    y1={p.y}
                    x2={c.x}
                    y2={c.y}
                    stroke={isChildLocked ? '#ec4899' : isSwapEdge ? '#ea580c' : isCompareEdge ? '#7c3aed' : '#fb923c'}
                    strokeWidth={isChildLocked ? 1.6 : isSwapEdge ? 3.6 : isCompareEdge ? 3.5 : 2.3}
                    strokeDasharray={isChildLocked ? '5 5' : undefined}
                    opacity={isChildLocked ? 0.26 : isSwapEdge || isCompareEdge ? 1 : 0.78}
                    strokeLinecap="round"
                    className="heap-tree-edge"
                  />
                );
              })}
            </svg>

            <div className="heap-slots-layer">
              {treeCoords.map((coord, idx) => {
                const isLocked = idx >= frame.heapSize;
                const isActive = compareRoleMap.has(idx) || swapSet.has(idx);
                return (
                  <div
                    key={idx}
                    className={`heap-slot-label ${isLocked ? 'is-locked' : isActive ? 'is-active' : ''}`}
                    style={{ left: `${coord.x}px`, top: `${coord.y + 29}px` }}
                  >
                    arr[{idx}]
                  </div>
                );
              })}
            </div>

            <div className="heap-nodes-layer">
              {frame.items.map((item, idx) => {
                const coord = treeCoords[idx];
                const isLocked = idx >= frame.heapSize;
                const isSwapping = swapSet.has(idx);
                const isComparing = compareRoleMap.has(idx);
                const isJustLocked = frame.justLocked === idx;
                const moveDir = movedIds.get(item.id);
                const isHovered = hoveredId === item.id;

                return (
                  <div
                    key={item.id}
                    className="heap-node-outer"
                    style={{
                      transform: `translate3d(${coord.x}px, ${coord.y}px, 0)`,
                      zIndex: moveDir ? (moveDir === 'up' ? 35 : 30) : isSwapping ? 25 : 20,
                    }}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div
                      className="heap-node-scale"
                      style={{
                        transform: isLocked ? 'scale(0.82)' : 'scale(1)',
                        opacity: isLocked ? (isJustLocked ? 0.96 : 0.72) : 1,
                        filter: isLocked ? (isJustLocked ? 'brightness(1.05)' : 'brightness(0.85)') : 'brightness(1)',
                      }}
                    >
                      <div
                        className={`heap-node-inner ${
                          moveDir === 'up' ? 'heap-arc-up' : moveDir === 'down' ? 'heap-arc-down' : ''
                        } ${isHovered ? 'heap-hover-node' : ''}`}
                        style={{
                          backgroundColor: isLocked
                            ? '#fce7f3'
                            : isSwapping
                              ? '#ea580c'
                              : isComparing
                                ? '#f3e8ff'
                                : '#fff7ed',
                          borderColor: isLocked
                            ? '#db2777'
                            : isSwapping
                              ? '#c2410c'
                              : isComparing
                                ? '#7c3aed'
                                : '#f97316',
                          color: isLocked ? '#831843' : isSwapping ? '#ffffff' : isComparing ? '#4c1d95' : '#9a3412',
                          boxShadow: isLocked
                            ? isJustLocked
                              ? '0 0 18px rgba(219, 39, 119, 0.38)'
                              : '0 4px 10px rgba(219, 39, 119, 0.16)'
                            : isSwapping
                              ? '0 6px 18px rgba(234, 88, 12, 0.42)'
                              : isComparing
                                ? '0 6px 16px rgba(124, 58, 237, 0.28)'
                                : '0 4px 10px rgba(249, 115, 22, 0.14)',
                        }}
                      >
                        <span>{item.val}</span>
                        <span
                          className="heap-node-lock"
                          style={{ opacity: isLocked ? 1 : 0, transform: isLocked ? 'scale(1)' : 'scale(0.5)' }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="heap-tree-legend">
            <div className="heap-legend-dots">
              <span className="heap-legend-item"><span className="heap-legend-dot" style={{ background: '#f97316' }} />Heap</span>
              <span className="heap-legend-item"><span className="heap-legend-dot" style={{ background: '#7c3aed' }} />So sánh</span>
              <span className="heap-legend-item"><span className="heap-legend-dot" style={{ background: '#ea580c' }} />Hoán đổi</span>
              <span className="heap-legend-item"><span className="heap-legend-dot" style={{ background: '#db2777' }} />Đã khóa</span>
            </div>
            <span style={{ fontSize: '0.65rem', color: '#8b7b9b' }}>Di chuột vào nút để soi mảng</span>
          </div>
        </section>

        <section className="heap-right-col">
          <div className="heap-array-card">
            <div className="heap-card-header">
              <h3 className="heap-card-title">Mảng 1 chiều &amp; Vách ngăn động</h3>
              <span className="heap-summary-chip">[{formatHeapArrayDivider(frame.items, frame.heapSize)}]</span>
            </div>

            <div className="heap-array-stage">
              <div className="heap-region-labels">
                <span style={{ color: '#ea580c', opacity: frame.heapSize > 0 ? 1 : 0.25, transition: 'opacity 0.3s ease' }}>
                  ◀ VÙNG HEAP
                </span>
                <span style={{ color: '#db2777', opacity: sortedCount > 0 ? 1 : 0.45, transition: 'opacity 0.3s ease' }}>
                  VÙNG ĐÃ XẾP ▶
                </span>
              </div>

              <div className="heap-arcs-wrap">
                <svg id="heap-arcs-svg" viewBox={`0 0 ${trackWidth} 40`} xmlns="http://www.w3.org/2000/svg">
                  {frame.comparing &&
                    frame.comparing.children.map((child, cIdx) => {
                      const pX = frame.comparing.parent * (slotW + gap) + slotW / 2;
                      const cX = child.idx * (slotW + gap) + slotW / 2;
                      const midX = (pX + cX) / 2;
                      const peakY = cIdx === 0 ? 16 : 4;
                      return (
                        <g key={child.idx}>
                          <path
                            d={`M ${pX} 38 Q ${midX} ${peakY}, ${cX} 38`}
                            fill="none"
                            stroke="#7c3aed"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <circle cx={pX} cy={38} r="2.6" fill="#7c3aed" />
                          <circle cx={cX} cy={38} r="2.6" fill="#7c3aed" />
                          <text
                            x={midX + (cIdx === 1 ? 16 : -6)}
                            y={peakY + 8}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="700"
                            fontFamily="JetBrains Mono, monospace"
                            fill="#6d28d9"
                          >
                            {child.formula}
                          </text>
                        </g>
                      );
                    })}
                  {!frame.comparing && frame.swapping && frame.swapping.length === 2 && (
                    <g>
                      {(() => {
                        const xA = frame.swapping[0] * (slotW + gap) + slotW / 2;
                        const xB = frame.swapping[1] * (slotW + gap) + slotW / 2;
                        const midX = (xA + xB) / 2;
                        return (
                          <>
                            <path d={`M ${xA} 38 Q ${midX} 5, ${xB} 38`} fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" />
                            <text x={midX} y={13} textAnchor="middle" fontSize="10" fontWeight="700" fill="#c2410c">
                              ⇄ Hoán đổi
                            </text>
                          </>
                        );
                      })()}
                    </g>
                  )}
                </svg>
              </div>

              <div ref={arrayTrackRef} className="heap-array-track">
                <div
                  className="heap-region-backdrop is-heap"
                  style={
                    frame.heapSize > 0
                      ? {
                          transform: `translate3d(${-pad}px, 0, 0)`,
                          width: `${frame.heapSize * slotW + (frame.heapSize - 1) * gap + pad * 2}px`,
                          opacity: 1,
                        }
                      : { width: '0px', opacity: 0 }
                  }
                />
                <div
                  className="heap-region-backdrop is-sorted"
                  style={
                    sortedCount > 0
                      ? {
                          transform: `translate3d(${frame.heapSize * (slotW + gap) - pad}px, 0, 0)`,
                          width: `${sortedCount * slotW + (sortedCount - 1) * gap + pad * 2}px`,
                          opacity: 1,
                        }
                      : { transform: `translate3d(${trackWidth}px, 0, 0)`, width: '0px', opacity: 0 }
                  }
                />
                <div
                  id="heap-divider"
                  style={
                    frame.heapSize > 0 && frame.heapSize < n
                      ? { transform: `translate3d(${frame.heapSize * (slotW + gap) - gap / 2 - 1.5}px, 0, 0)`, opacity: 1 }
                      : { transform: `translate3d(${frame.heapSize === 0 ? -4 : trackWidth + 4}px, 0, 0)`, opacity: 0 }
                  }
                >
                  <div className="heap-divider-line" />
                  <span className="heap-divider-tag">|</span>
                </div>

                <div className="heap-tiles-layer">
                  {frame.items.map((item, idx) => {
                    const isLocked = idx >= frame.heapSize;
                    const isSwapping = swapSet.has(idx);
                    const isComparing = compareRoleMap.has(idx);
                    const isJustLocked = frame.justLocked === idx;
                    const moveDir = movedIds.get(item.id);
                    const isHovered = hoveredId === item.id;

                    let roleText = '';
                    let roleVariant = '';
                    if (isLocked && isJustLocked) {
                      roleText = 'Khóa';
                      roleVariant = 'role-lock';
                    } else if (isSwapping) {
                      roleText = idx === 0 ? 'Gốc' : 'Đổi';
                      roleVariant = 'role-swap';
                    } else if (isComparing) {
                      roleText = compareRoleMap.get(idx);
                      roleVariant = 'role-cmp';
                    } else if (!isLocked && idx === 0 && frame.heapSize > 0) {
                      roleText = 'Gốc';
                      roleVariant = 'role-root';
                    }

                    return (
                      <div
                        key={item.id}
                        className="heap-tile-outer"
                        style={{
                          width: `${slotW}px`,
                          transform: `translate3d(${idx * (slotW + gap)}px, 0, 0)`,
                          zIndex: moveDir ? (moveDir === 'up' ? 35 : 30) : isSwapping ? 25 : 15,
                        }}
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        <div
                          className={`heap-tile-inner ${
                            moveDir === 'up' ? 'heap-tile-hop-high' : moveDir === 'down' ? 'heap-tile-hop-low' : ''
                          } ${isHovered ? 'heap-hover-tile' : ''}`}
                          style={{
                            backgroundColor: isLocked
                              ? '#fce7f3'
                              : isSwapping
                                ? '#ea580c'
                                : isComparing
                                  ? '#f3e8ff'
                                  : '#fff7ed',
                            borderColor: isLocked
                              ? '#db2777'
                              : isSwapping
                                ? '#c2410c'
                                : isComparing
                                  ? '#7c3aed'
                                  : '#f97316',
                            color: isLocked ? '#831843' : isSwapping ? '#ffffff' : isComparing ? '#4c1d95' : '#9a3412',
                            boxShadow: isLocked
                              ? isJustLocked
                                ? '0 6px 18px rgba(219, 39, 119, 0.34)'
                                : '0 3px 8px rgba(219, 39, 119, 0.14)'
                              : isSwapping
                                ? '0 6px 18px rgba(234, 88, 12, 0.36)'
                                : isComparing
                                  ? '0 6px 16px rgba(124, 58, 237, 0.25)'
                                  : '0 3px 8px rgba(249, 115, 22, 0.12)',
                          }}
                        >
                          <span className={`heap-tile-role ${roleText ? `is-visible ${roleVariant}` : ''}`}>{roleText}</span>
                          <span className="heap-tile-val" style={{ fontSize: n <= 4 ? '1.35rem' : '1.12rem' }}>
                            {item.val}
                          </span>
                          <span className="heap-tile-lock" style={{ opacity: isLocked ? 1 : 0 }}>🔒</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                className="heap-index-row"
                style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, gap: `${gap}px` }}
              >
                {Array.from({ length: n }, (_, idx) => {
                  const isLocked = idx >= frame.heapSize;
                  const isActive = compareRoleMap.has(idx) || swapSet.has(idx);
                  return (
                    <div key={idx} className={`heap-index-cell ${isLocked ? 'is-locked' : isActive ? 'is-active' : ''}`}>
                      [{idx}]
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={`heap-explain-card border-${frame.actionType}`}>
            <div className="heap-explain-top">
              <div className="heap-explain-badges">
                <span className={`heap-phase-badge heap-phase-${frame.phase}`}>{frame.phaseLabel}</span>
                <span className="heap-step-pill">Bước {currentStep} / {maxStep}</span>
                <span className={`heap-action-badge heap-action-${frame.actionType}`}>{frame.actionLabel}</span>
              </div>
              <div className="heap-stats-group">
                <div className="heap-stat-pill">
                  <span>So sánh:</span>
                  <span className="font-bold" style={{ color: '#7c3aed', fontVariantNumeric: 'tabular-nums' }}>
                    {frame.comparisons}
                  </span>
                </div>
                <div className="heap-stat-pill">
                  <span>Hoán đổi:</span>
                  <span className="font-bold" style={{ color: '#ea580c', fontVariantNumeric: 'tabular-nums' }}>
                    {frame.swaps}
                  </span>
                </div>
              </div>
            </div>

            <div className="heap-desc-box">
              <p key={`${rawArray.join('-')}-${currentStep}`} className="heap-desc-text heap-text-reveal">
                {frame.description}
              </p>
            </div>
          </div>
        </section>
      </main>

      <section className="heap-timeline-bar">
        <div className="heap-timeline-header">
          <div className="heap-timeline-meta">
            <span className="font-bold" style={{ color: '#1f1630' }}>Thanh tiến độ 2 Pha</span>
            <span className="heap-legend-item" style={{ color: '#c2410c', fontSize: '0.7rem' }}>
              <span className="heap-legend-dot" style={{ background: '#ea580c', width: 7, height: 7 }} />Pha 1: Build Max-Heap
            </span>
            <span className="heap-legend-item" style={{ color: '#be185d', fontSize: '0.7rem' }}>
              <span className="heap-legend-dot" style={{ background: '#db2777', width: 7, height: 7 }} />Pha 2: Rút gốc &amp; Vun lại
            </span>
          </div>
          <div className="heap-kbd-hint">
            Phím tắt mô phỏng: <kbd>P</kbd> Chạy/Dừng · <kbd>[</kbd> <kbd>]</kbd> Lùi/Tiến · <kbd>R</kbd> Đặt lại
          </div>
        </div>

        <div ref={timelineRowRef} className="heap-timeline-row">
          {frames.map((f, idx) => {
            const prevPhase = idx > 0 ? frames[idx - 1].phase : null;
            const showSep1 = f.phase === 'build' && prevPhase !== 'build';
            const showSep2 = f.phase === 'extract' && prevPhase !== 'extract';
            const isCurrent = idx === currentStep;
            const pillClass = isCurrent
              ? f.phase === 'done' || f.actionType === 'lock'
                ? 'is-current-emerald'
                : f.phase === 'extract'
                  ? 'is-current-orange'
                  : 'is-current-amber'
              : idx < currentStep
                ? 'is-past'
                : '';

            return (
              <React.Fragment key={idx}>
                {showSep1 && <span className="heap-timeline-sep" style={{ color: '#c2410c' }}>Pha 1</span>}
                {showSep2 && <span className="heap-timeline-sep" style={{ color: '#be185d' }}>Pha 2</span>}
                <button type="button" className={`heap-timeline-pill ${pillClass}`} onClick={() => jumpToStep(idx)}>
                  {idx}. {f.pillLabel}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}
