import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TIMSORT_DEFAULT_ARRAY,
  TIMSORT_SPEED_MAP,
  TIMSORT_PHASE_META,
  generateTimsortFrames,
  generateRandomTimsortArray,
} from '../timsortEngine';

const bentoItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const STAGES = [
  { key: 'init', label: '1. Khởi tạo' },
  { key: 'runs', label: '2. Tạo Runs' },
  { key: 'merge', label: '3. Trộn Runs' },
  { key: 'done', label: '4. Hoàn tất' },
];

export default function TimsortSimulator() {
  const [sourceArray, setSourceArray] = useState(TIMSORT_DEFAULT_ARRAY);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedLevel, setSpeedLevel] = useState(3);
  const firstTickRef = useRef(true);

  const frames = useMemo(() => generateTimsortFrames(sourceArray), [sourceArray]);
  const frame = frames[stepIdx] || frames[0];
  const phaseInfo = TIMSORT_PHASE_META[frame.phase] || TIMSORT_PHASE_META.init;
  const speedInfo = TIMSORT_SPEED_MAP[speedLevel] || TIMSORT_SPEED_MAP[3];

  useEffect(() => {
    if (!isPlaying) {
      firstTickRef.current = true;
      return undefined;
    }
    if (stepIdx >= frames.length - 1) {
      setIsPlaying(false);
      return undefined;
    }
    const delay = firstTickRef.current ? 120 : speedInfo.delay;
    firstTickRef.current = false;
    const timer = setTimeout(() => {
      setStepIdx((prev) => Math.min(frames.length - 1, prev + 1));
    }, delay);
    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, frames.length, speedInfo.delay]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        if (isPlaying) {
          setIsPlaying(false);
        } else {
          if (stepIdx >= frames.length - 1) setStepIdx(0);
          setIsPlaying(true);
        }
      } else if (e.key === ',' || e.key === '[') {
        e.preventDefault();
        setIsPlaying(false);
        setStepIdx((s) => Math.max(0, s - 1));
      } else if (e.key === '.' || e.key === ']') {
        e.preventDefault();
        setIsPlaying(false);
        setStepIdx((s) => Math.min(frames.length - 1, s + 1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPlaying, stepIdx, frames.length]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    if (stepIdx >= frames.length - 1) {
      setStepIdx(0);
    }
    setIsPlaying(true);
  };

  const loadNewArray = (nextArr) => {
    setIsPlaying(false);
    setSourceArray(nextArr);
    setStepIdx(0);
  };

  const maxVal = Math.max(...frame.array, 1);
  const currentStageIdx = STAGES.findIndex((s) => s.key === frame.phase);

  return (
    <div className="bento-grid flex-1 min-h-0">
      <motion.div variants={bentoItemVariants} className="tim-card col-12">
        <div className="tim-top-row">
          <div className="tim-title-group">
            <span className={`tim-phase-badge ${phaseInfo.badgeClass}`}>{phaseInfo.text}</span>
            <h3 className="tim-step-title">{frame.title}</h3>
          </div>
          <div className="tim-controls">
            <button type="button" className="tim-btn-play" onClick={togglePlay}>
              {isPlaying ? (
                <>
                  <span>⏸</span>
                  <span>Tạm dừng</span>
                </>
              ) : stepIdx >= frames.length - 1 && frames.length > 1 ? (
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
            <button
              type="button"
              className="tim-btn"
              disabled={stepIdx === 0}
              onClick={() => {
                setIsPlaying(false);
                setStepIdx((s) => Math.max(0, s - 1));
              }}
            >
              <span>⏮</span>
              <span>Quay lại</span>
            </button>
            <button
              type="button"
              className="tim-btn"
              disabled={stepIdx >= frames.length - 1}
              onClick={() => {
                setIsPlaying(false);
                setStepIdx((s) => Math.min(frames.length - 1, s + 1));
              }}
            >
              <span>Bước tiếp</span>
              <span>⏭</span>
            </button>
            <button type="button" className="tim-btn" onClick={() => loadNewArray([...TIMSORT_DEFAULT_ARRAY])}>
              <span>↺</span>
              <span>Đặt lại</span>
            </button>
            <button type="button" className="tim-btn" onClick={() => loadNewArray(generateRandomTimsortArray())}>
              <span>🎲</span>
              <span>Mảng ngẫu nhiên</span>
            </button>
          </div>
        </div>

        <div className="tim-meta-row">
          <div className="tim-stepper" aria-label="Tiến độ giai đoạn">
            {STAGES.map((stage, idx) => (
              <React.Fragment key={stage.key}>
                <div
                  className={`tim-stage-pill ${
                    idx === currentStageIdx ? 'is-active' : idx < currentStageIdx ? 'is-done' : ''
                  }`}
                >
                  {stage.label}
                </div>
                {idx < STAGES.length - 1 && <span className="tim-stage-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>

          <div className="tim-metrics-group">
            <div className="tim-speed-box">
              <span>Chậm</span>
              <input
                className="tim-speed-slider"
                type="range"
                min="1"
                max="5"
                step="1"
                value={speedLevel}
                aria-label="Tốc độ mô phỏng"
                onChange={(e) => setSpeedLevel(Number(e.target.value))}
              />
              <span>Nhanh</span>
              <span className="tim-speed-label">{speedInfo.label}</span>
            </div>

            <div className="tim-stat-pill">
              <span>So sánh:</span>
              <span className="tim-stat-val tim-stat-cmp">{frame.comparisons}</span>
            </div>
            <div className="tim-stat-pill">
              <span>Ghi/Dịch:</span>
              <span className="tim-stat-val tim-stat-writes">{frame.writes}</span>
            </div>
            <div className="tim-stat-pill">
              <span>Bước:</span>
              <span className="tim-stat-val tim-stat-step">
                {stepIdx} / {frames.length - 1}
              </span>
            </div>
          </div>
        </div>

        <div className="tim-desc-box">
          <p className="tim-desc-text">{frame.description}</p>
        </div>

        <section className="tim-stage-box">
          <div className="tim-bars-grid" aria-label="Biểu đồ cột các phần tử mảng">
            {frame.array.map((val, idx) => {
              const hlKey = frame.highlights[idx] || 'default';
              const isActive = frame.activeIndices.includes(idx);
              const heightPct = Math.round(14 + (val / maxVal) * 86);
              return (
                <div key={idx} className="tim-bar-slot">
                  <span className={`tim-bar-val val-${hlKey}`}>{val}</span>
                  <div className="tim-bar-track">
                    <div
                      className={`tim-bar-col bar-${hlKey} ${isActive ? 'is-active' : ''}`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className={`tim-bar-idx ${isActive ? 'is-active' : ''}`}>[{idx}]</span>
                </div>
              );
            })}
          </div>

          <div className="tim-runs-wrap">
            <div className="tim-runs-grid" aria-label="Nhãn phân nhóm các Run">
              {!frame.runs || frame.runs.length === 0 ? (
                <div className="tim-runs-placeholder">
                  Chưa phân chia Run — thuật toán sẽ tự động tách mảng theo minrun = 4
                </div>
              ) : (
                frame.runs.map((run, rIdx) => {
                  const cls = run.active
                    ? 'run-active'
                    : run.label?.startsWith('Merged')
                      ? 'run-merged'
                      : '';
                  return (
                    <div
                      key={`${run.start}-${run.len}-${rIdx}`}
                      className={`tim-run-chip ${cls}`}
                      style={{ gridColumn: `${run.start + 1} / span ${run.len}` }}
                      title={run.label}
                    >
                      {run.label}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <footer className="tim-footer">
          <div className="tim-legend">
            <div className="tim-legend-item">
              <span className="tim-legend-swatch swatch-default" />
              <span>Mặc định</span>
            </div>
            <div className="tim-legend-item">
              <span className="tim-legend-swatch swatch-compare" />
              <span>Xét Run / So sánh</span>
            </div>
            <div className="tim-legend-item">
              <span className="tim-legend-swatch swatch-insert" />
              <span>Chèn / Dịch (Insertion Sort)</span>
            </div>
            <div className="tim-legend-item">
              <span className="tim-legend-swatch swatch-merge" />
              <span>Đang trộn (Merge)</span>
            </div>
            <div className="tim-legend-item">
              <span className="tim-legend-swatch swatch-sorted" />
              <span>Đã hoàn thành / Đã sắp xếp</span>
            </div>
          </div>
          <div className="tim-kbd-hint">
            Phím tắt mô phỏng: <kbd>P</kbd> Chạy/Dừng · <kbd>[</kbd> <kbd>]</kbd> Chuyển bước
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
