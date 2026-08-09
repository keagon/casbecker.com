"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate } from "motion";

const projects = [
  {
    title: "Dinner Plants",
    url: "https://dinnerplants.nl",
    image: "/portfolio/dinnerplants.jpg",
    tagline: "Plant-based catering & events",
  },
  {
    title: "DeSalon Utrecht",
    url: "https://desalonutrecht.com",
    image: "/portfolio/desalonutrecht.jpg",
    tagline: "Creative workspace & event venue",
  },
  {
    title: "Nakama",
    url: "https://nakamaspel.nl",
    image: "/portfolio/nakamaspel.jpg",
    tagline: "A card game that brings people closer",
  },
  {
    title: "Rebuilding Education",
    url: "https://rebuilding.education",
    image: "/portfolio/rebuilding-education.jpg",
    tagline: "Rethinking learning from the ground up",
  },
  {
    title: "Hildebolt",
    url: "https://hildebolt.nl",
    image: "/portfolio/hildebolt.jpg",
    tagline: "Craft & design studio",
  },
];

const AUTOPLAY_MS = 5000;
const CLICK_DRAG_TOLERANCE = 10;

function mod(n, m) {
  return ((n % m) + m) % m;
}

function BrowserChrome({ url }) {
  const displayUrl = url.replace(/^https?:\/\//, "");
  return (
    <div className="portfolio-card__chrome" aria-hidden="true">
      <div className="portfolio-card__dots">
        <span />
        <span />
        <span />
      </div>
      <div className="portfolio-card__url">
        <span className="material-symbols-rounded portfolio-card__lock">lock</span>
        {displayUrl}
      </div>
    </div>
  );
}

function PortfolioCard({ project, isActive }) {
  return (
    <article className={`portfolio-card ${isActive ? "portfolio-card--active" : ""}`}>
      <div className="portfolio-card__glow" aria-hidden="true" />
      <div className="portfolio-card__panel">
        <BrowserChrome url={project.url} />
        <div className="portfolio-card__image">
          <img src={project.image} alt={`${project.title} website preview`} loading="lazy" draggable="false" />
          <div className="portfolio-card__visit" aria-hidden="true">
            <span className="material-symbols-rounded">open_in_new</span>
            Visit site
          </div>
        </div>
        <div className="portfolio-card__content">
          <h3 className="portfolio-card__title">{project.title}</h3>
          <p className="portfolio-card__tagline">{project.tagline}</p>
        </div>
      </div>
    </article>
  );
}

export default function PortfolioSection() {
  const count = projects.length;

  // Fractional position drives the whole layout (index + in-flight drag/flick)
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const stageRef = useRef(null);
  const posRef = useRef(0);
  const drag = useRef({ active: false, startX: 0, lastX: 0, lastT: 0, velocity: 0, moved: 0 });
  const animRef = useRef(null);
  const autoplayRef = useRef(null);
  const [stageW, setStageW] = useState(1200);

  // Track stage width so stack spacing uses the full desktop width
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setStageW(el.offsetWidth || 1200);
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const setPos = useCallback((v) => {
    posRef.current = v;
    setPosition(v);
  }, []);

  const activeIndex = mod(Math.round(posRef.current), count);

  const stopAnim = () => {
    animRef.current?.stop();
    animRef.current = null;
  };

  // Spring-settle the fractional position to an integer index
  const settleTo = useCallback(
    (target, velocity = 0) => {
      stopAnim();
      const from = posRef.current;
      animRef.current = animate(from, target, {
        type: "spring",
        stiffness: 260,
        damping: 30,
        velocity,
        onUpdate: (v) => setPos(v),
        onComplete: () => setPos(mod(target, count)),
      });
    },
    [count, setPos]
  );

  const goTo = useCallback(
    (i) => {
      // shortest wrapped path from current position to target index
      const current = posRef.current;
      const base = Math.round(current);
      let delta = mod(i - base, count);
      if (delta > count / 2) delta -= count;
      settleTo(base + delta);
    },
    [count, settleTo]
  );

  const step = useCallback(
    (dir) => {
      settleTo(Math.round(posRef.current) + dir);
    },
    [settleTo]
  );

  const next = useCallback(() => step(1), [step]);
  const prev = useCallback(() => step(-1), [step]);

  // Autoplay
  useEffect(() => {
    if (paused || isDragging) return;
    autoplayRef.current = setInterval(() => step(1), AUTOPLAY_MS);
    return () => clearInterval(autoplayRef.current);
  }, [paused, isDragging, step]);

  // Keyboard — only while the section is hovered/focused so we don't steal global keys
  useEffect(() => {
    if (!hovered) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hovered, next, prev]);

  // Wheel / trackpad scrub
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let acc = 0;
    let raf = null;
    const onWheel = (e) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!delta) return;
      e.preventDefault();
      stopAnim();
      acc += delta;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          const w = el.offsetWidth || 600;
          setPos(posRef.current + acc / (w * 0.6));
          acc = 0;
          raf = null;
        });
      }
    };
    const onWheelEnd = () => {
      settleTo(Math.round(posRef.current));
    };
    let endTimer;
    const wrapped = (e) => {
      onWheel(e);
      clearTimeout(endTimer);
      endTimer = setTimeout(onWheelEnd, 140);
    };
    el.addEventListener("wheel", wrapped, { passive: false });
    return () => {
      el.removeEventListener("wheel", wrapped);
      clearTimeout(endTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [setPos, settleTo]);

  // Pointer drag with velocity tracking
  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    stopAnim();
    const x = e.clientX;
    drag.current = { active: true, startX: x, lastX: x, lastT: performance.now(), velocity: 0, moved: 0 };
    setIsDragging(true);
    stageRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.active) return;
    const x = e.clientX;
    const now = performance.now();
    const dt = Math.max(now - d.lastT, 1);
    const dx = x - d.lastX;

    // velocity (px/s), lightly smoothed
    d.velocity = d.velocity * 0.7 + ((dx / dt) * 1000) * 0.3;
    d.lastX = x;
    d.lastT = now;
    d.moved = x - d.startX;

    // fractional tracking: incremental pixel delta -> slide fraction
    const w = stageRef.current?.offsetWidth || 600;
    setPos(posRef.current - dx / (w * 0.6));
  };

  const endDrag = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    setIsDragging(false);

    const w = stageRef.current?.offsetWidth || 600;
    const current = posRef.current;
    const velocitySlides = d.velocity / (w * 0.6); // slides/s

    // Flick: velocity carries 1–2 slides; otherwise nearest
    let target = Math.round(current - velocitySlides * 0.18);
    settleTo(target, -velocitySlides);
  };

  const onCardClick = (i) => {
    if (Math.abs(drag.current.moved) > CLICK_DRAG_TOLERANCE) return;
    if (i === activeIndex) {
      window.open(projects[i].url, "_blank", "noopener,noreferrer");
    } else {
      goTo(i);
    }
  };

  // Idle micro-float on the active card
  const [float, setFloat] = useState(0);
  useEffect(() => {
    let raf;
    let t = 0;
    const loop = () => {
      t += 0.008;
      setFloat(Math.sin(t) * 1);
      raf = requestAnimationFrame(loop);
    };
    if (!isDragging) raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isDragging]);

  // Responsive stack step — spread further on wide screens
  const stepX = Math.min(260, Math.max(120, stageW * 0.15));

  return (
    <section id="portfolio" className="portfolio-section py-12 sm:py-20 lg:py-28 relative overflow-hidden">
      <div className="container relative z-10">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="section-title text-text-50 animate-slide-up">Portfolio</h2>
          <p className="text-text-100 mt-6 max-w-xl mx-auto text-pretty animate-slide-up delay-100">
            Some of the websites I designed and built.
          </p>
        </div>
      </div>

      {/* Full-bleed stage — uses more desktop width than the text container */}
      <div className="portfolio-stage-wrap relative z-10">
        <div
          ref={stageRef}
          className={`portfolio-stage animate-scale-up delay-200 ${isDragging ? "portfolio-stage--dragging" : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onMouseEnter={() => {
            setPaused(true);
            setHovered(true);
          }}
          onMouseLeave={() => {
            setPaused(false);
            setHovered(false);
          }}
          role="region"
          aria-label="Website portfolio carousel"
          aria-roledescription="carousel"
        >
          <div className="portfolio-track">
            {projects.map((project, i) => {
              // signed fractional offset from the active position, wrapped to [-count/2, count/2]
              let offset = i - position;
              offset = offset - Math.round(offset / count) * count;
              const abs = Math.abs(offset);
              const isActive = Math.round(offset) === 0 && abs < 0.5;

              const drift = isActive ? float : 0;

              // Stacked coverflow: overlapping sides, deep Z, angled toward center.
              const t = Math.min(abs, 2); // 0 center, 1 near, 2 far
              const x = offset * stepX;
              const z = -t * 140;
              const rotY = offset * -36;
              const scale = 1 - t * 0.1;
              const opacity = 1 - Math.min(t * 0.16, 0.35); // floor ~0.65 — never disappears

              const style = {
                transform: `
                  translate(-50%, -50%)
                  translateX(${x}px)
                  translateZ(${z}px)
                  translateY(${drift * 5}px)
                  rotateY(${rotY}deg)
                  scale(${scale})
                `,
                opacity,
                zIndex: 30 - Math.round(abs * 8),
                pointerEvents: abs > 1.5 ? "none" : "auto",
              };

              return (
                <div
                  key={project.url}
                  className="portfolio-slide"
                  style={style}
                  onClick={() => onCardClick(i)}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${project.title} (${i + 1} of ${count})`}
                  aria-hidden={!isActive && abs > 1}
                >
                  <PortfolioCard project={project} isActive={isActive} />
                </div>
              );
            })}
          </div>

          {/* Edge fades */}
          <div className="portfolio-fade portfolio-fade--left" aria-hidden="true" />
          <div className="portfolio-fade portfolio-fade--right" aria-hidden="true" />
        </div>
      </div>

      <div className="container relative z-10">
        {/* Controls below the drag surface so they never fight pointer capture */}
        <div className="portfolio-controls">
          <button
            type="button"
            className="portfolio-arrow"
            onClick={prev}
            aria-label="Previous website"
          >
            <span className="material-symbols-rounded">chevron_left</span>
          </button>

          <div className="portfolio-indicators" role="tablist" aria-label="Choose website">
            {projects.map((project, i) => (
              <button
                key={project.url}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={project.title}
                className={`portfolio-dot ${i === activeIndex ? "portfolio-dot--active" : ""}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          <span className="portfolio-counter" aria-hidden="true">
            {String(activeIndex + 1).padStart(2, "0")}
            <span className="portfolio-counter__sep">/</span>
            {String(count).padStart(2, "0")}
          </span>

          <button
            type="button"
            className="portfolio-arrow"
            onClick={next}
            aria-label="Next website"
          >
            <span className="material-symbols-rounded">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
}
