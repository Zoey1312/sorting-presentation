import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  INTROSORT_INITIAL_ARRAY,
  INTROSORT_HEAP_VALUES,
  INTROSORT_HEAP_COORDS,
  INTROSORT_HEAP_EDGES,
  INTROSORT_TREE_SCENARIOS,
} from '../introsortEngine';

const bentoItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function IntrosortSimulator() {
  const [activeTab, setActiveTab] = useState('tab1');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  const scenario = INTROSORT_TREE_SCENARIOS[activeTab];
  const stepData = scenario.steps[currentStep] || scenario.steps[0];
  const maxStep = scenario.steps.length - 1;

  const tab1BtnRef = useRef(null);
  const tab2BtnRef = useRef(null);
  const [tabPillStyle, setTabPillStyle] = useState({ left: 0, width: 0 });

  const arrayTrackRef = useRef(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const prevIndicesRef = useRef(new Map());
  const [movedValues, setMovedValues] = useState(new Map());

  const treeCanvasRef = useRef(null);
  const depthRulerRef = useRef(null);
  const nodeRefs = useRef(new Map());
  const [edgesGeometry, setEdgesGeometry] = useState([]);
  const [activeRingStyle, setActiveRingStyle] = useState({ opacity: 0 });
  const [rulerHeight, setRulerHeight] = useState(scenario.minHeightPx);

  const firstTickRef = useRef(true);

  useEffect(() => {
    const animMs = Math.round(620 / speed);
    document.documentElement.style.setProperty('--intro-anim-ms', `${animMs}ms`);
  }, [speed]);

  const measureGeometry = useCallback(() => {
    const activeBtn = activeTab === 'tab1' ? tab1BtnRef.current : tab2BtnRef.current;
    if (activeBtn) {
      setTabPillStyle({ left: activeBtn.offsetLeft, width: activeBtn.offsetWidth });
    }
    if (arrayTrackRef.current) {
      setTrackWidth(arrayTrackRef.current.clientWidth);
    }
    if (depthRulerRef.current) {
      setRulerHeight(depthRulerRef.current.clientHeight || scenario.minHeightPx);
    }
    const canvasEl = treeCanvasRef.current;
    if (!canvasEl) return;
    const canvasRect = canvasEl.getBoundingClientRect();
    if (canvasRect.width === 0 || canvasRect.height === 0) return;

    const computedEdges = scenario.edges
      .map((edge) => {
        const fromEl = nodeRefs.current.get(edge.from);
        const toEl = nodeRefs.current.get(edge.to);
        if (!fromEl || !toEl) return null;
        const r1 = fromEl.getBoundingClientRect();
        const r2 = toEl.getBoundingClientRect();
        const x1 = r1.left - canvasRect.left + r1.width / 2;
        const y1 = r1.bottom - canvasRect.top;
        const x2 = r2.left - canvasRect.left + r2.width / 2;
        const y2 = r2.top - canvasRect.top;
        const midY = y1 + (y2 - y1) * 0.52;
        const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
        const labelX = (x1 + x2) / 2 + (edge.branch === 'left' ? -20 : 20);
        const labelY = (y1 + y2) / 2 - 2;
        return { edge, d, labelX, labelY };
      })
      .filter(Boolean);

    setEdgesGeometry(computedEdges);

    const activeNodeDef = scenario.nodes.find(
      (n) =>
        currentStep === n.step ||
        (n.extraStep !== undefined && currentStep === n.extraStep)
    );
    const activeNodeEl = activeNodeDef ? nodeRefs.current.get(activeNodeDef.id) : null;
    if (activeNodeEl && activeNodeDef) {
      const nodeRect = activeNodeEl.getBoundingClientRect();
      const pad = 4;
      setActiveRingStyle({
        opacity: 1,
        transform: `translate3d(${nodeRect.left - canvasRect.left - pad}px, ${nodeRect.top - canvasRect.top - pad}px, 0)`,
        width: `${nodeRect.width + pad * 2}px`,
        height: `${nodeRect.height + pad * 2}px`,
        border:
          activeNodeDef.algoType === 'heap'
            ? '2px solid #fb923c'
            : activeNodeDef.algoType === 'insertion'
              ? '2px solid #4ade80'
              : '2px solid #c084fc',
        boxShadow:
          activeNodeDef.algoType === 'heap'
            ? '0 0 22px rgba(249, 115, 22, 0.55)'
            : activeNodeDef.algoType === 'insertion'
              ? '0 0 20px rgba(34, 197, 94, 0.45)'
              : '0 0 20px rgba(168, 85, 247, 0.5)',
      });
    } else {
      setActiveRingStyle({ opacity: 0 });
    }
  }, [activeTab, currentStep, scenario]);

  useLayoutEffect(() => {
    measureGeometry();
    const timer = setTimeout(measureGeometry, Math.round(620 / speed) + 40);
    return () => clearTimeout(timer);
  }, [measureGeometry, speed]);

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => measureGeometry());
    if (treeCanvasRef.current) ro.observe(treeCanvasRef.current);
    if (arrayTrackRef.current) ro.observe(arrayTrackRef.current);
    return () => ro.disconnect();
  }, [measureGeometry]);

  useEffect(() => {
    const nextMoves = new Map();
    stepData.array.forEach((val, idx) => {
      const prev = prevIndicesRef.current.get(val);
      if (prev !== undefined && prev !== idx) {
        nextMoves.set(val, Math.abs(idx - prev));
      }
      prevIndicesRef.current.set(val, idx);
    });
    setMovedValues(nextMoves);
  }, [stepData]);

  useEffect(() => {
    if (!isPlaying) {
      firstTickRef.current = true;
      return undefined;
    }
    if (currentStep >= maxStep) {
      setIsPlaying(false);
      return undefined;
    }
    const delay = firstTickRef.current ? 160 : Math.round(1350 / speed);
    firstTickRef.current = false;
    const timer = setTimeout(() => {
      setCurrentStep((s) => Math.min(maxStep, s + 1));
    }, delay);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, maxStep, speed]);

  const jumpToStep = useCallback(
    (stepIdx) => {
      setIsPlaying(false);
      setCurrentStep(Math.max(0, Math.min(stepIdx, maxStep)));
    },
    [maxStep]
  );

  const switchTab = useCallback((tabKey) => {
    if (tabKey === activeTab) return;
    setIsPlaying(false);
    setActiveTab(tabKey);
    setCurrentStep(0);
  }, [activeTab]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        if (isPlaying) {
          setIsPlaying(false);
        } else {
          if (currentStep >= maxStep) setCurrentStep(0);
          setIsPlaying(true);
        }
      } else if (e.key === ',' || e.key === '[') {
        e.preventDefault();
        jumpToStep(currentStep - 1);
      } else if (e.key === '.' || e.key === ']') {
        e.preventDefault();
        jumpToStep(currentStep + 1);
      } else if (e.key === '1') {
        e.preventDefault();
        switchTab('tab1');
      } else if (e.key === '2') {
        e.preventDefault();
        switchTab('tab2');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPlaying, currentStep, maxStep, jumpToStep, switchTab]);

  const gap = 8;
  const slotW = trackWidth > 0 ? (trackWidth - gap * 8) / 9 : 0;
  const groupStyle = (range) => {
    if (!range || slotW <= 0) return { opacity: 0 };
    const [s, e] = range;
    return {
      opacity: 1,
      transform: `translate3d(${s * (slotW + gap) - 4}px, 0, 0)`,
      width: `${(e - s + 1) * slotW + (e - s) * gap + 8}px`,
    };
  };

  const depthRowIdx = Math.max(0, scenario.depthRows.findIndex((r) => r.depth === stepData.depth));
  const depthPct = scenario.rowCentersPct[depthRowIdx];
  const pointerY = (depthPct / 100) * rulerHeight - 7;
  const showHeap = activeTab === 'tab2' && (stepData.step === 3 || stepData.step === 4);
  const isBuildHeap = stepData.step === 3;
  const subHeapArr = stepData.array.slice(0, 6);

  return (
    <div className="bento-grid flex-1 min-h-0">
      <motion.div variants={bentoItemVariants} className="intro-card col-12">
        <div className="intro-top-bar">
          <div className="intro-tabs-wrap" role="tablist" aria-label="Chọn kịch bản Introsort">
            <div
              id="intro-tab-pill"
              className={activeTab === 'tab1' ? 'pill-tab1' : 'pill-tab2'}
              style={{
                transform: `translate3d(${tabPillStyle.left}px, 0, 0)`,
                width: `${tabPillStyle.width}px`,
              }}
            />
            <button
              ref={tab1BtnRef}
              type="button"
              role="tab"
              aria-selected={activeTab === 'tab1'}
              className={`intro-tab-btn ${activeTab === 'tab1' ? 'active-tab1' : ''}`}
              onClick={() => switchTab('tab1')}
            >
              Tab 1: Trường hợp chuẩn (threshold=3, depth=6)
            </button>
            <button
              ref={tab2BtnRef}
              type="button"
              role="tab"
              aria-selected={activeTab === 'tab2'}
              className={`intro-tab-btn ${activeTab === 'tab2' ? 'active-tab2' : ''}`}
              onClick={() => switchTab('tab2')}
            >
              Tab 2: Kích hoạt Heapsort (threshold=2, depth=1)
            </button>
          </div>

          <div className="intro-controls">
            <button
              type="button"
              className="intro-btn-play"
              onClick={() => {
                if (isPlaying) {
                  setIsPlaying(false);
                } else {
                  if (currentStep >= maxStep) setCurrentStep(0);
                  setIsPlaying(true);
                }
              }}
            >
              {isPlaying ? (
                <>
                  <span>⏸</span>
                  <span>Tạm dừng</span>
                </>
              ) : currentStep >= maxStep ? (
                <>
                  <span>↻</span>
                  <span>Chạy lại</span>
                </>
              ) : (
                <>
                  <span>▶</span>
                  <span>Tự động chạy</span>
                </>
              )}
            </button>
            <button type="button" className="intro-btn" disabled={currentStep === 0} onClick={() => jumpToStep(currentStep - 1)}>
              <span>⏮</span>
              <span>Quay lại</span>
            </button>
            <button type="button" className="intro-btn" disabled={currentStep >= maxStep} onClick={() => jumpToStep(currentStep + 1)}>
              <span>Bước tiếp</span>
              <span>⏭</span>
            </button>
            <button type="button" className="intro-btn" onClick={() => jumpToStep(0)}>
              <span>↺</span>
              <span>Đặt lại</span>
            </button>
            <div className="intro-speed-box">
              <span>Tốc độ</span>
              <input
                className="intro-speed-slider"
                type="range"
                min="0.5"
                max="2.5"
                step="0.25"
                value={speed}
                aria-label="Tốc độ mô phỏng"
                onChange={(e) => setSpeed(Number(e.target.value))}
              />
              <span className="intro-speed-label">{speed.toFixed(speed % 1 === 0 ? 1 : 2)}x</span>
            </div>
          </div>
        </div>

        <section className="intro-top-grid">
          <div className="intro-array-panel">
            <div className="intro-array-header">
              <div className="flex-row gap-2">
                <span className="intro-array-title">Mảng A[0..8]</span>
                <span className="intro-range-pill">
                  {stepData.step === 0
                    ? 'Đang xét: toàn mảng [0..8]'
                    : `Đang xét: [${stepData.range[0]}..${stepData.range[1]}] (size = ${stepData.size})`}
                </span>
              </div>
              <div className="intro-inline-key">
                <span className="intro-key-item"><span className="intro-key-dot" style={{ background: '#a855f7' }} />Nửa trái</span>
                <span className="intro-key-item"><span className="intro-key-dot" style={{ background: '#f43f5e' }} />Pivot</span>
                <span className="intro-key-item"><span className="intro-key-dot" style={{ background: '#0ea5e9' }} />Nửa phải</span>
                <span className="intro-key-item"><span className="intro-key-dot" style={{ background: '#f97316' }} />Heapsort</span>
                <span className="intro-key-item"><span className="intro-key-dot" style={{ background: '#22c55e' }} />Đã chốt ✓</span>
              </div>
            </div>

            <div className="intro-tiles-stage">
              <div ref={arrayTrackRef} className="intro-array-track">
                <div
                  className="intro-group-bar intro-group-left"
                  style={groupStyle(stepData.algoType === 'quick' ? stepData.leftRange : null)}
                >
                  <span className="intro-group-label" style={{ left: 8, color: '#d8b4fe' }}>Nửa trái</span>
                </div>
                <div
                  className="intro-group-bar intro-group-right"
                  style={groupStyle(stepData.algoType === 'quick' ? stepData.rightRange : null)}
                >
                  <span className="intro-group-label" style={{ right: 8, color: '#7dd3fc' }}>Nửa phải</span>
                </div>
                {(stepData.algoType === 'insertion' || stepData.algoType === 'heap') && (
                  <div
                    className={`intro-group-bar ${
                      stepData.algoType === 'heap' && stepData.step === 3
                        ? 'intro-group-heap'
                        : 'intro-group-insertion'
                    }`}
                    style={groupStyle(stepData.range)}
                  >
                    <span
                      className="intro-group-label"
                      style={{
                        left: 8,
                        color: stepData.algoType === 'heap' && stepData.step === 3 ? '#fdba74' : '#86efac',
                      }}
                    >
                      {stepData.algoType === 'insertion'
                        ? 'Insertion Sort'
                        : stepData.step === 4
                          ? 'Heapsort Hoàn tất'
                          : 'Max-Heap [0..5]'}
                    </span>
                  </div>
                )}

                <div className="intro-tiles-layer">
                  {INTROSORT_INITIAL_ARRAY.map((val) => {
                    const idx = stepData.array.indexOf(val);
                    const [low, high] = stepData.range;
                    const inSeg = stepData.step > 0 && idx >= low && idx <= high;
                    const isPivot = stepData.pivotIndex === idx;
                    const isLeft = stepData.leftRange && idx >= stepData.leftRange[0] && idx <= stepData.leftRange[1];
                    const isRight = stepData.rightRange && idx >= stepData.rightRange[0] && idx <= stepData.rightRange[1];
                    const isHeapBuild = stepData.step === 3 && stepData.heapRange && idx >= stepData.heapRange[0] && idx <= stepData.heapRange[1];
                    const isSorted = stepData.sortedIndices.includes(idx);
                    const dist = movedValues.get(val) || 0;

                    let tileCls = 'tile-default';
                    let tagText = '';
                    let tagColor = '';
                    if (isPivot) {
                      tileCls = 'tile-pivot';
                      tagText = `Pivot p=${idx}`;
                      tagColor = '#fda4af';
                    } else if (isHeapBuild) {
                      tileCls = idx === 0 ? 'tile-heap-max' : 'tile-heap';
                      if (idx === 0) {
                        tagText = 'Max';
                        tagColor = '#fdba74';
                      }
                    } else if (isLeft) tileCls = 'tile-left';
                    else if (isRight) tileCls = 'tile-right';
                    else if (isSorted && inSeg) tileCls = 'tile-sorted-active';
                    else if (isSorted) tileCls = 'tile-sorted';

                    return (
                      <div
                        key={val}
                        className="intro-tile-outer"
                        style={{
                          width: `${slotW}px`,
                          transform: `translate3d(${idx * (slotW + gap)}px, 0, 0)`,
                          zIndex: isPivot ? 35 : dist > 2 ? 30 : dist > 0 ? 25 : 10,
                        }}
                      >
                        <div
                          className={`intro-tile-inner ${tileCls} ${
                            dist >= 2 ? 'intro-arc-high' : dist > 0 ? 'intro-arc-low' : ''
                          }`}
                        >
                          <span
                            className={`intro-tile-tag ${tagText ? 'is-visible' : ''}`}
                            style={{ color: tagColor }}
                          >
                            {tagText}
                          </span>
                          <span className="intro-tile-check" style={{ opacity: isSorted && !isPivot ? 1 : 0 }}>
                            ✓
                          </span>
                          <span>{val}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="intro-index-row">
                {Array.from({ length: 9 }, (_, i) => (
                  <div
                    key={i}
                    className={`intro-index-cell ${
                      stepData.step > 0 && i >= stepData.range[0] && i <= stepData.range[1] ? 'is-active' : ''
                    }`}
                  >
                    [{i}]
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`intro-explain-panel box-${stepData.algoType}`}>
            <div className="intro-explain-meta">
              <div className="flex-row gap-2 flex-wrap">
                <span className="intro-step-badge">Bước {stepData.step}</span>
                <span className="intro-meta-range">[{stepData.range[0]}..{stepData.range[1]}] (size={stepData.size})</span>
                <span style={{ color: '#52525b' }}>•</span>
                <span className={`intro-meta-depth ${stepData.depth === 0 ? 'is-zero' : ''}`}>
                  depth={stepData.depth}
                </span>
              </div>
              <span className={`intro-algo-badge badge-${stepData.algoType}`}>{stepData.algo}</span>
            </div>

            <div className="intro-desc-wrap">
              <p key={`${activeTab}-${currentStep}`} className="intro-desc-text intro-fade-slide-in">
                {stepData.description}
              </p>
            </div>

            <div className="intro-explain-footer">
              <span className="mono">Trạng thái {stepData.step} / {maxStep}</span>
              <span>Bấm vào node trên cây để nhảy đến bước tương ứng</span>
            </div>
          </div>
        </section>

        <section className="intro-center-panel">
          <div className="intro-center-header">
            <div className="flex-row gap-2">
              <h3 className="intro-center-title">Cây đệ quy phân hoạch &amp; Thước đo Depth</h3>
              <span className="intro-center-sub">Độ sâu đếm ngược từ trên xuống</span>
            </div>
            <div className="intro-algo-legend">
              <span className="intro-key-item"><span className="intro-legend-dot" style={{ background: '#a855f7' }} />Quicksort</span>
              <span className="intro-key-item"><span className="intro-legend-dot" style={{ background: '#22c55e' }} />Insertion Sort</span>
              <span className="intro-key-item"><span className="intro-legend-dot" style={{ background: '#f97316' }} />Heapsort (Depth = 0)</span>
            </div>
          </div>

          <div className="intro-center-row">
            <div className="intro-tree-main">
              <div ref={depthRulerRef} className="intro-depth-ruler" aria-label="Thước đo độ sâu Depth">
                <div className="intro-depth-track">
                  <div
                    id="intro-depth-fill"
                    style={{
                      height: `${depthPct}%`,
                      background:
                        stepData.depth === 0
                          ? 'linear-gradient(180deg, #a855f7 0%, #f59e0b 55%, #ef4444 100%)'
                          : stepData.depth <= 4 && activeTab === 'tab1'
                            ? 'linear-gradient(180deg, #a855f7 0%, #f59e0b 100%)'
                            : 'linear-gradient(180deg, #a855f7 0%, #6366f1 100%)',
                    }}
                  />
                </div>
                <div
                  id="intro-depth-pointer"
                  className={stepData.depth === 0 ? 'intro-danger-ripple' : ''}
                  style={{
                    transform: `translate3d(0, ${pointerY}px, 0)`,
                    backgroundColor:
                      stepData.depth === 0
                        ? '#ef4444'
                        : stepData.depth <= 4 && activeTab === 'tab1'
                          ? '#f59e0b'
                          : '#a855f7',
                    boxShadow:
                      stepData.depth === 0
                        ? '0 0 16px rgba(239, 68, 68, 0.9)'
                        : stepData.depth <= 4 && activeTab === 'tab1'
                          ? '0 0 14px rgba(245, 158, 11, 0.8)'
                          : '0 0 14px rgba(168, 85, 247, 0.85)',
                  }}
                />
                <div className="intro-depth-ticks">
                  {scenario.depthRows.map((row, rIdx) => (
                    <div key={row.depth} className="intro-depth-tick" style={{ top: `${scenario.rowCentersPct[rIdx]}%` }}>
                      <span style={{ fontSize: 11, fontWeight: row.isDanger ? 800 : 700, color: row.isDanger ? '#fb7185' : '#d4d4d8' }}>
                        {row.label}
                      </span>
                      <span style={{ fontSize: 9, color: row.isDanger ? 'rgba(251,113,133,0.8)' : '#71717a' }}>
                        {row.sub}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div ref={treeCanvasRef} className="intro-tree-canvas" aria-label="Sơ đồ cây đệ quy Introsort">
                <div className="intro-guide-lines">
                  {scenario.depthRows.map((row, rIdx) => (
                    <div
                      key={row.depth}
                      className={`intro-guide-line ${row.isDanger ? 'is-danger' : ''}`}
                      style={{ top: `${scenario.rowCentersPct[rIdx]}%` }}
                    >
                      {row.isDanger && (
                        <span className="intro-danger-tag">
                          {row.isCompactWarning
                            ? '⚠ Depth = 0 (Kích hoạt Heapsort — Chưa chạm tới)'
                            : '⚠ Depth = 0 (Kích hoạt Heapsort nếu size > 2)'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <svg id="intro-tree-svg" xmlns="http://www.w3.org/2000/svg">
                  {edgesGeometry.map(({ edge, d, labelX, labelY }) => {
                    const isRevealed = currentStep >= edge.revealStep;
                    const strokeColor = edge.isDanger
                      ? '#f97316'
                      : edge.branch === 'left'
                        ? '#a855f7'
                        : '#38bdf8';
                    return (
                      <g key={`${edge.from}-${edge.to}`}>
                        <path d={d} fill="none" stroke="#272c3d" strokeWidth="1.4" strokeDasharray="4 4" opacity="0.55" />
                        <path
                          d={d}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          className="intro-edge-path"
                          opacity={isRevealed ? 0.95 : 0}
                        />
                        <text
                          x={labelX}
                          y={labelY}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="600"
                          fill={isRevealed ? strokeColor : '#52525b'}
                          opacity={isRevealed ? 1 : 0.4}
                          className="intro-edge-label"
                        >
                          {edge.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div id="intro-active-ring" style={activeRingStyle} />

                <div className="intro-tree-nodes">
                  {scenario.nodes.map((node) => {
                    const isReached = currentStep >= node.step;
                    const isCurrent =
                      currentStep === node.step ||
                      (node.extraStep !== undefined && currentStep === node.extraStep);
                    return (
                      <div
                        key={node.id}
                        ref={(el) => {
                          if (el) nodeRefs.current.set(node.id, el);
                          else nodeRefs.current.delete(node.id);
                        }}
                        role="button"
                        tabIndex={0}
                        className={`intro-tree-node node-${node.algoType} ${isReached ? 'is-reached' : ''} ${
                          isCurrent ? 'is-current' : ''
                        }`}
                        style={{
                          left: `${node.xPercent}%`,
                          top: `${scenario.rowCentersPct[node.rowIndex]}%`,
                        }}
                        onClick={() => {
                          if (node.extraStep !== undefined && currentStep === node.step) {
                            jumpToStep(node.extraStep);
                          } else {
                            jumpToStep(node.step);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            jumpToStep(node.step);
                          }
                        }}
                      >
                        <div className="intro-node-badge">{node.badge}</div>
                        <div className="intro-node-range">{node.rangeText}</div>
                        <div className="intro-node-detail">{node.detail}</div>
                        {node.extraStep !== undefined && (
                          <div className="intro-heap-subpills">
                            <button
                              type="button"
                              className={`intro-heap-pill pill-b3 ${currentStep === 3 ? 'is-active' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                jumpToStep(3);
                              }}
                            >
                              B3: Max-Heap
                            </button>
                            <button
                              type="button"
                              className={`intro-heap-pill pill-b4 ${currentStep === 4 ? 'is-active' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                jumpToStep(4);
                              }}
                            >
                              B4: Hoàn tất
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <aside id="intro-heap-panel" className={showHeap ? 'is-open' : ''} aria-label="Minh họa cây nhị phân Max-Heap">
              <div className="intro-heap-card">
                <div className="intro-heap-header">
                  <div>
                    <div className={`intro-heap-title ${!isBuildHeap ? 'is-done' : ''}`}>
                      {isBuildHeap ? 'Build Max-Heap [0..5]' : 'Extract-Max Hoàn tất [0..5]'}
                    </div>
                    <div className="intro-heap-sub">
                      {isBuildHeap ? 'Bước 3: Dựng cây Max-Heap (Cha ≥ Con)' : 'Bước 4: Rút dần gốc lớn nhất về cuối'}
                    </div>
                  </div>
                  <span className={`intro-heap-badge ${!isBuildHeap ? 'is-done' : ''}`}>
                    {isBuildHeap ? 'Max-Heap' : 'Đã sắp xếp ✓'}
                  </span>
                </div>

                <div className="intro-heap-stage-wrap">
                  <div className="intro-heap-stage">
                    <svg id="intro-heap-svg" viewBox="0 0 280 184" xmlns="http://www.w3.org/2000/svg">
                      {INTROSORT_HEAP_EDGES.map(([p, c], i) => (
                        <line
                          key={i}
                          x1={INTROSORT_HEAP_COORDS[p].x}
                          y1={INTROSORT_HEAP_COORDS[p].y}
                          x2={INTROSORT_HEAP_COORDS[c].x}
                          y2={INTROSORT_HEAP_COORDS[c].y}
                          stroke={isBuildHeap ? '#f97316' : '#22c55e'}
                          strokeWidth="2"
                          opacity={isBuildHeap ? 0.68 : 0.4}
                          strokeDasharray={isBuildHeap ? undefined : '4 3'}
                        />
                      ))}
                    </svg>
                    <div className="intro-heap-nodes">
                      {INTROSORT_HEAP_VALUES.map((val) => {
                        const idx = Math.max(0, subHeapArr.indexOf(val));
                        const { x, y } = INTROSORT_HEAP_COORDS[idx];
                        const isRoot = idx === 0;
                        return (
                          <div
                            key={val}
                            className="intro-heap-circle"
                            style={{
                              transform: `translate3d(${x}px, ${y}px, 0) scale(${isRoot && isBuildHeap ? 1.12 : 1})`,
                              backgroundColor: isBuildHeap ? (isRoot ? '#c2410c' : '#2a160c') : '#0f291e',
                              borderColor: isBuildHeap ? (isRoot ? '#fdba74' : '#f97316') : '#22c55e',
                              color: isBuildHeap ? '#ffffff' : '#d1fae5',
                              boxShadow: isBuildHeap
                                ? isRoot
                                  ? '0 0 18px rgba(249, 115, 22, 0.7)'
                                  : 'none'
                                : '0 0 12px rgba(34, 197, 94, 0.25)',
                            }}
                          >
                            <span>{val}</span>
                            <span className="intro-heap-idx-tag">[{idx}]</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="intro-heap-note">
                  {isBuildHeap ? (
                    <>
                      Gốc <strong style={{ color: '#fdba74' }}>15</strong> lớn nhất nằm ở đỉnh A[0]. Các nhánh con (12 ≥ 7, 4 và 13 ≥ 11) đều thỏa tính chất Max-Heap.
                    </>
                  ) : (
                    <>
                      Các nút lướt về đúng thứ tự tăng dần <strong style={{ color: '#86efac' }}>[4, 7, 11, 12, 13, 15]</strong> với độ phức tạp đảm bảo O(n log n).
                    </>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <footer className="intro-footer">
          <span>Introsort kết hợp Quicksort (nhanh trung bình) + Insertion Sort (mảng nhỏ) + Heapsort (bảo vệ tránh O(n²)).</span>
          <span>
            Phím tắt mô phỏng: <kbd>P</kbd> Chạy/Dừng · <kbd>[</kbd> <kbd>]</kbd> Chuyển bước · <kbd>1</kbd> <kbd>2</kbd> Đổi Tab
          </span>
        </footer>
      </motion.div>
    </div>
  );
}
