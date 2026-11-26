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

const APPLE_EASE = [0.16, 1, 0.3, 1];

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
    <div className={`app-shell theme-${currentSlide.theme} h-screen w-screen overflow-hidden flex flex-col`}>
      <div className="ambient-glow" />

      <div className="top-island-wrap">
        <header className="dynamic-island">
          <div className="brand-badge">
            <span className="brand-dot" />
            <span>DSA Sorting</span>
          </div>

          <nav className="chapter-nav" aria-label="Chapters">
            {CHAPTERS.map((ch) => {
              const active = currentSlide.chapter === ch.id;
              const rangeText =
                ch.range[0] === ch.range[1] ? ch.range[0] : `${ch.range[0]}–${ch.range[1]}`;
              return (
                <button
                  key={ch.id}
                  type="button"
                  className={`chapter-btn ${active ? 'active' : ''}`}
                  onClick={() => setSlideIndex(ch.firstSlide - 1)}
                >
                  <span>{ch.label}</span>
                  <span className="chapter-range">{rangeText}</span>
                </button>
              );
            })}
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="nav-pill-btn icon-only"
              disabled={slideIndex === 0}
              onClick={goPrev}
              title="Slide trước (←)"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="slide-counter">
              {String(slideIndex + 1).padStart(2, '0')} / {totalSlides}
            </span>
            <button
              type="button"
              className="nav-pill-btn icon-only"
              disabled={slideIndex === totalSlides - 1}
              onClick={goNext}
              title="Slide tiếp (→)"
            >
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              className={`nav-pill-btn ${showNotes ? 'active' : ''}`}
              onClick={() => setShowNotes((v) => !v)}
              title="Speaker Notes (Phím S)"
            >
              <MessageSquareText size={15} />
              <span>Notes (S)</span>
            </button>
            <button
              type="button"
              className="nav-pill-btn icon-only"
              onClick={toggleFullscreen}
              title="Toàn màn hình (Phím F)"
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </div>
        </header>
      </div>

      <main className="stage-shell w-full max-w-[92vw] mx-auto px-6 py-5 flex-1 flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.section
            key={currentSlide.id}
            className="slide-canvas"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: APPLE_EASE }}
          >
            <SlideRenderer slide={currentSlide} onNextSlide={goNext} />
          </motion.section>
        </AnimatePresence>
      </main>

      {showNotes && (
        <aside className="speaker-drawer" aria-label="Speaker Notes">
          <div className="speaker-drawer-header">
            <div className="flex-row gap-2">
              <MessageSquareText size={16} />
              <strong style={{ fontSize: '0.95rem' }}>Speaker Notes — Slide {currentSlide.id}</strong>
              <span className="badge-pill badge-accent">{currentSlide.duration}</span>
            </div>
            <button type="button" className="sim-btn" onClick={() => setShowNotes(false)}>
              Đóng (S)
            </button>
          </div>
          <div className="speaker-drawer-body">{currentSlide.speakerNotes}</div>
        </aside>
      )}

      <div className="bottom-progress-track" aria-hidden="true">
        <div className="bottom-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
