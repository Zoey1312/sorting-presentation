import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  MessageSquareText,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { CHAPTERS, SLIDES_DATA } from './data/slidesData';
import SlideRenderer from './components/SlideRenderer.jsx';

export default function App() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentSlide = SLIDES_DATA[slideIndex];
  const totalSlides = SLIDES_DATA.length;

  const goNext = useCallback(() => {
    setSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1));
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setSlideIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        goNext();
      } else if (['ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        goPrev();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setShowNotes((v) => !v);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev, toggleFullscreen]);

  const progress = ((slideIndex + 1) / totalSlides) * 100;

  return (
    <div className={`app-shell theme-${currentSlide.theme}`}>
      <div className="ambient-orb orb-1" style={{ background: 'var(--accent)' }} />
      <div className="ambient-orb orb-2" style={{ background: 'var(--accent-2)' }} />
      <div className="grid-backdrop" />

      <header className="top-nav">
        <div className="brand-badge">
          <span className="brand-dot" />
          <span>DSA Production Sorting</span>
        </div>

        <nav className="chapter-nav" aria-label="Chapters">
          {CHAPTERS.map((ch) => {
            const active = currentSlide.chapter === ch.id;
            return (
              <button
                key={ch.id}
                type="button"
                className={`chapter-btn ${active ? 'active' : ''}`}
                onClick={() => setSlideIndex(ch.firstSlide - 1)}
              >
                <span>{ch.label}</span>
                <span className="text-xs text-muted">
                  ({ch.range[0] === ch.range[1] ? ch.range[0] : `${ch.range[0]}-${ch.range[1]}`})
                </span>
              </button>
            );
          })}
        </nav>

        <div className="nav-actions">
          <span className="slide-counter">
            Slide {slideIndex + 1} / {totalSlides}
          </span>
          <button
            type="button"
            className={`icon-btn ${showNotes ? 'active' : ''}`}
            onClick={() => setShowNotes((v) => !v)}
            title="Speaker Notes (Phím S)"
          >
            <MessageSquareText size={15} />
            <span>Speaker Notes (S)</span>
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={toggleFullscreen}
            title="Toàn màn hình (Phím F)"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </header>

      <main className="stage-wrapper">
        <AnimatePresence mode="wait">
          <motion.section
            key={currentSlide.id}
            className="slide-canvas"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <SlideRenderer slide={currentSlide} />
          </motion.section>
        </AnimatePresence>
      </main>

      {showNotes && (
        <aside className="speaker-drawer" aria-label="Speaker Notes">
          <div className="speaker-drawer-header">
            <div className="flex-row gap-2">
              <MessageSquareText size={16} />
              <strong className="text-sm">Speaker Notes — Slide {currentSlide.id}</strong>
              <span className="badge-pill badge-cyan">{currentSlide.duration}</span>
            </div>
            <button type="button" className="sim-btn" onClick={() => setShowNotes(false)}>
              Đóng (S)
            </button>
          </div>
          <div className="speaker-drawer-body">{currentSlide.speakerNotes}</div>
        </aside>
      )}

      <footer className="bottom-bar">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs text-muted">
          Điều hướng: ← / → / Space / PageUp / PageDown • Bật ghi chú: Phím S
        </div>
        <div className="flex-row gap-2">
          <button type="button" className="sim-btn" disabled={slideIndex === 0} onClick={goPrev}>
            <ChevronLeft size={15} /> Trước
          </button>
          <button
            type="button"
            className="sim-btn primary"
            disabled={slideIndex === totalSlides - 1}
            onClick={goNext}
          >
            Tiếp <ChevronRight size={15} />
          </button>
        </div>
      </footer>
    </div>
  );
}
