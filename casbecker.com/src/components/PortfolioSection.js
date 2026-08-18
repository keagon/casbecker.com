"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate } from "motion";

const projects = [
  {
    title: "Dinner Plants",
    url: "https://dinnerplants.nl",
    image: "/portfolio/dinnerplants.jpg",
    tagline: "Plant-based dinners in your neighbourhood",
  },
  {
    title: "DeSalon Utrecht",
    url: "https://desalonutrecht.com",
    image: "/portfolio/desalonutrecht.jpg",
    tagline: "Creative collective & events",
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
    tagline: "Speaker, host & trauma expert",
  },
];

const AUTOPLAY_MS = 5000;
const CLICK_DRAG_TOLERANCE = 10;
const SETTLE_MS = 0.42;

function mod(n, m) {
  return ((n % m) + m) % m;
}

/** Signed distance from `position` to index `i`, wrapped into [-count/2, count/2). */
function ringOffset(i, position, count) {
  const offset = i - position;
  return offset - count * Math.floor((offset + count / 2) / count);
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

function PortfolioCard({ project }) {
  return (
    <article className="portfolio-card">
      <div className="portfolio-card__glow" aria-hidden="true" />
      <div className="portfolio-card__panel">
        <BrowserChrome url={project.url} />
        <div className="portfolio-card__image">
          <img
            src={project.image}
            alt={`${project.title} website preview`}
            loading="eager"
            decoding="async"
            draggable="false"
          />
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

  // Discrete UI only — transforms are painted straight to the DOM
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const stageRef = useRef(null);
  const slideRefs = useRef([]);
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const activeRef = useRef(0);
  const stageWRef = useRef(1200);
  const wheelingRef = useRef(false);
  const drag = useRef({ active: false, startX: 0, lastX: 0, lastT: 0, velocity: 0, moved: 0 });
  const animRef = useRef(null);

  const paint = useCallback(() => {
    const position = posRef.current;
    const stepX = Math.min(260, Math.max(120, stageWRef.current * 0.15));
    const nextActive = mod(Math.round(position), count);

    for (let i = 0; i < count; i++) {
      const el = slideRefs.current[i];
      if (!el) continue;

      const offset = ringOffset(i, position, count);
      const abs = Math.abs(offset);
      const depth = Math.min(abs, 2);
      const isActive = i === nextActive;

      el.style.transform = `translate(-50%, -50%) translateX(${offset * stepX}px) rotateY(${offset * -26}deg) scale(${1 - depth * 0.08})`;
      el.style.opacity = String(1 - Math.min(depth * 0.18, 0.4));
      // Active always wins. Others rank by distance; a left/right bit breaks ties.
      el.style.zIndex = isActive ? "50" : String(Math.round(40 - abs * 10) + (offset < 0 ? 1 : 0));
      el.style.pointerEvents = abs > 1.25 ? "none" : "auto";
      el.classList.toggle("portfolio-slide--active", isActive);
      el.setAttribute("aria-hidden", String(!isActive));
    }

    if (activeRef.current !== nextActive) {
      activeRef.current = nextActive;
      setActiveIndex(nextActive);
    }
  }, [count]);

  const setPos = useCallback(
    (v) => {
      posRef.current = v;
      paint();
    },
    [paint]
  );

  const stopAnim = () => {
    animRef.current?.stop();
    animRef.current = null;
  };

  const settleTo = useCallback(
    (target) => {
      stopAnim();
      targetRef.current = target;
      const from = posRef.current;
      if (Math.abs(from - target) < 0.001) {
        const wrapped = mod(target, count);
        targetRef.current = wrapped;
        setPos(wrapped);
        return;
      }
      animRef.current = animate(from, target, {
        duration: SETTLE_MS,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: setPos,
        onComplete: () => {
          const wrapped = mod(target, count);
          targetRef.current = wrapped;
          setPos(wrapped);
          animRef.current = null;
        },
      });
    },
    [count, setPos]
  );

  const goTo = useCallback(
    (i) => {
      const base = mod(targetRef.current, count);
      let delta = mod(i - base, count);
      if (delta > count / 2) delta -= count;
      settleTo(targetRef.current + delta);
    },
    [count, settleTo]
  );

  const step = useCallback(
    (dir) => {
      settleTo(targetRef.current + dir);
    },
    [settleTo]
  );

  const next = useCallback(() => step(1), [step]);
  const prev = useCallback(() => step(-1), [step]);

  // Measure stage + paint before paint (avoids stacked flash)
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      stageWRef.current = el.offsetWidth || 1200;
      paint();
    };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
      stopAnim();
    };
  }, [paint]);

  // Autoplay
  useEffect(() => {
    if (paused || isDragging) return;
    const id = setInterval(() => {
      if (wheelingRef.current || drag.current.active) return;
      step(1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, isDragging, step]);

  // Keyboard — only while hovered so we don't steal global keys
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
    let endTimer;

    const onWheel = (e) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!delta) return;
      e.preventDefault();
      stopAnim();
      wheelingRef.current = true;
      acc += delta;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          const w = stageWRef.current || 600;
          setPos(posRef.current + acc / (w * 0.6));
          acc = 0;
          raf = null;
        });
      }
      clearTimeout(endTimer);
      endTimer = setTimeout(() => {
        wheelingRef.current = false;
        settleTo(Math.round(posRef.current));
      }, 140);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      clearTimeout(endTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [setPos, settleTo]);

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

    d.velocity = d.velocity * 0.7 + (dx / dt) * 1000 * 0.3;
    d.lastX = x;
    d.lastT = now;
    d.moved = x - d.startX;

    const w = stageWRef.current || 600;
    setPos(posRef.current - dx / (w * 0.6));
  };

  const endDrag = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    setIsDragging(false);

    const w = stageWRef.current || 600;
    const velocitySlides = d.velocity / (w * 0.6);
    settleTo(Math.round(posRef.current - velocitySlides * 0.18));
  };

  const onCardClick = (i) => {
    if (Math.abs(drag.current.moved) > CLICK_DRAG_TOLERANCE) return;
    if (i === activeRef.current) {
      window.open(projects[i].url, "_blank", "noopener,noreferrer");
    } else {
      goTo(i);
    }
  };

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
            {projects.map((project, i) => (
              <div
                key={project.url}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                className="portfolio-slide"
                onClick={() => onCardClick(i)}
                role="group"
                aria-roledescription="slide"
                aria-label={`${project.title} (${i + 1} of ${count})`}
              >
                <PortfolioCard project={project} />
              </div>
            ))}
          </div>

          <div className="portfolio-fade portfolio-fade--left" aria-hidden="true" />
          <div className="portfolio-fade portfolio-fade--right" aria-hidden="true" />
        </div>
      </div>

      <div className="container relative z-10">
        <div className="portfolio-controls">
          <button type="button" className="portfolio-arrow" onClick={prev} aria-label="Previous website">
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

          <button type="button" className="portfolio-arrow" onClick={next} aria-label="Next website">
            <span className="material-symbols-rounded">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
}
