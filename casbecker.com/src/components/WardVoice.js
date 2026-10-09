'use client';

import { useEffect, useRef, useState } from 'react';

export default function WardVoice({ ward }) {
  const audioRef = useRef(null);
  const [state, setState] = useState('idle');
  const [hintCount, setHintCount] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);

  const hints = ward.hints || [];
  const hintDone = hints.length > 0 && hintLevel >= hints.length;

  const play = () => {
    const a = audioRef.current;
    if (!a) return;
    try { a.currentTime = 0; } catch (e) { /* ignore */ }
    const p = a.play();
    if (p && typeof p.then === 'function') {
      p.then(() => setState('playing')).catch(() => setState('missing'));
    } else {
      setState('playing');
    }
  };

  useEffect(() => {
    if (hintCount === null) return undefined;
    if (hintCount <= 0) {
      setHintLevel((l) => Math.min(l + 1, hints.length));
      setHintCount(null);
      return undefined;
    }
    const t = setTimeout(() => setHintCount((c) => (c === null ? null : c - 1)), 1000);
    return () => clearTimeout(t);
  }, [hintCount, hints.length]);

  const label =
    state === 'playing' ? 'The Ward is speaking…'
      : state === 'ended' ? 'Play again'
        : 'Wake the Ward';

  return (
    <main className="wv" style={{ '--accent': ward.accent || '#ff8a3d' }}>
      <div className="wv-glow" />
      <div className="wv-vignette" />
      <div className="wv-grain" />

      <header className="wv-brand">
        <span className="wv-brand-mark">✦</span>
        <span>The Manor of the Passion Vulture</span>
      </header>

      <section className="wv-console">
        <p className="wv-kicker">A sleeping Ward</p>
        <h1 className="wv-title">{ward.name}</h1>
        <p className="wv-sub">{ward.blurb}</p>

        <button type="button" className="wv-play" onClick={play}>
          {label}
        </button>

        {state === 'missing' && (
          <p className="wv-warn">
            The Ward’s voice is missing. Add <code>{ward.audio}</code> to the site.
          </p>
        )}

        <details className="wv-words">
          <summary>Cannot hear the Ward? Read its words.</summary>
          <div className="wv-riddle">
            <p className="wv-riddle-title">{ward.riddleTitle}</p>
            {ward.riddle.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </details>

        {hints.length > 0 && (
          <div className="wv-hintzone">
            <button
              type="button"
              className="wv-hintbtn"
              disabled={hintCount !== null || hintDone}
              onClick={() => setHintCount(10)}
            >
              {hintDone ? 'The Ward has told you all it will' : 'Ask the Ward for a hint'}
            </button>
            {hintLevel > 0 && (
              <div className="wv-hintbox">
                {hints.slice(0, hintLevel).map((h, i) => (
                  <p key={i}>{h}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {hintCount !== null && (
        <div className="wv-confirm" role="dialog" aria-modal="true" aria-label="Confirm hint">
          <div className="wv-confirm-box">
            <p className="wv-confirm-kicker">The Ward hesitates…</p>
            <p className="wv-confirm-text">A hint will be given when the count ends.</p>
            <p className="wv-confirm-count">{hintCount}</p>
            <button type="button" className="wv-confirm-btn" onClick={() => setHintCount(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        src={ward.audio}
        preload="auto"
        onEnded={() => setState('ended')}
      />

      <style jsx>{`
        .wv {
          position: fixed;
          inset: 0;
          background: #070509;
          color: #ecdcae;
          font-family: Georgia, 'Times New Roman', serif;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
        }
        .wv-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(55% 42% at 50% 60%, var(--accent), transparent 70%);
          opacity: 0.16;
          mix-blend-mode: screen;
        }
        .wv-vignette {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(120% 100% at 50% 45%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.88) 100%);
        }
        .wv-grain {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.05;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .wv-brand {
          position: absolute; top: max(18px, env(safe-area-inset-top)); left: 0; right: 0;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #b7955a;
          pointer-events: none;
        }
        .wv-brand-mark { color: #e9c96b; }
        .wv-console {
          position: absolute; left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          width: min(92vw, 520px);
          max-height: calc(100dvh - 96px);
          overflow-y: auto;
          padding: 30px 26px 24px;
          border-radius: 20px;
          background: linear-gradient(180deg, rgba(26,19,13,0.86), rgba(10,8,13,0.92));
          border: 1px solid rgba(233,201,107,0.18);
          box-shadow: 0 30px 90px rgba(0,0,0,0.66), inset 0 1px 0 rgba(255,255,255,0.05);
          backdrop-filter: blur(12px) saturate(120%);
          -webkit-backdrop-filter: blur(12px) saturate(120%);
          text-align: center;
        }
        .wv-kicker {
          margin: 0 0 6px; font-size: 10.5px; letter-spacing: 4px; text-transform: uppercase; color: #b7955a;
        }
        .wv-title { margin: 0; font-size: clamp(26px, 7vw, 34px); color: #f2d98f; letter-spacing: 1px; font-weight: 500; }
        .wv-sub { margin: 8px 0 22px; font-size: 13.5px; line-height: 1.5; color: #b6a67e; }
        .wv-play {
          padding: 15px 34px;
          border: 1px solid rgba(233,201,107,0.5);
          border-radius: 999px;
          cursor: pointer;
          font-family: inherit;
          font-size: 15px;
          letter-spacing: 1px;
          color: #201404;
          font-weight: 600;
          background: linear-gradient(180deg, #ffe19a, #e8bb52);
          box-shadow: 0 10px 30px rgba(232,187,82,0.28), 0 0 34px rgba(255,176,70,0.18);
          transition: transform .12s, box-shadow .2s;
        }
        .wv-play:active { transform: scale(0.97); }
        .wv-warn { margin: 14px 0 0; font-size: 12px; color: #c98a5a; line-height: 1.5; }
        .wv-warn code { color: #e0a97a; }
        .wv-words { margin-top: 22px; text-align: left; }
        .wv-words summary {
          cursor: pointer; list-style: none; text-align: center;
          font-size: 12px; letter-spacing: 1px; color: #b7955a;
          text-decoration: underline; text-underline-offset: 3px;
        }
        .wv-words summary::-webkit-details-marker { display: none; }
        .wv-riddle {
          margin-top: 12px; padding: 14px 16px; border-radius: 12px;
          border: 1px dashed rgba(233,201,107,0.28);
          background: rgba(6,5,9,0.5);
          font-size: 13.5px; line-height: 1.6; color: #e7d7ac; text-align: center;
        }
        .wv-riddle p { margin: 4px 0; }
        .wv-riddle-title { color: #cbb98a; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; }
        .wv-hintzone { margin-top: 16px; }
        .wv-hintbtn {
          background: none; border: none; color: #d9bf78; cursor: pointer;
          font-family: inherit; font-size: 12px; letter-spacing: 1px;
          text-decoration: underline; text-underline-offset: 3px; padding: 6px 0;
        }
        .wv-hintbtn:disabled { opacity: 0.4; cursor: default; text-decoration: none; }
        .wv-hintbox {
          margin-top: 10px; padding: 12px 14px; border-radius: 12px;
          border: 1px dashed rgba(233,201,107,0.28);
          background: rgba(6,5,9,0.5);
          font-size: 13px; line-height: 1.6; color: #e7d7ac; text-align: center;
        }
        .wv-hintbox p { margin: 4px 0; }
        .wv-confirm {
          position: absolute; inset: 0; z-index: 40;
          display: flex; align-items: center; justify-content: center;
          background: rgba(4,3,6,0.72);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
        }
        .wv-confirm-box {
          width: min(86vw, 340px);
          padding: 24px 22px 20px;
          border-radius: 18px;
          text-align: center;
          background: linear-gradient(180deg, rgba(30,22,14,0.96), rgba(12,9,14,0.98));
          border: 1px solid rgba(233,201,107,0.35);
          box-shadow: 0 24px 70px rgba(0,0,0,0.7);
          animation: wvfade .25s ease both;
        }
        .wv-confirm-kicker { margin: 0 0 6px; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #b7955a; }
        .wv-confirm-text { margin: 0 0 10px; font-size: 13px; line-height: 1.5; color: #cbb98a; }
        .wv-confirm-count { margin: 0 0 14px; font-size: 44px; line-height: 1; color: #ffe19a; }
        .wv-confirm-btn {
          padding: 9px 22px; border-radius: 999px; cursor: pointer;
          font-family: inherit; font-size: 12px; letter-spacing: 1px;
          color: #e5cf8f; background: rgba(10,8,13,0.6);
          border: 1px solid rgba(233,201,107,0.35);
        }
        .wv-confirm-btn:hover { border-color: rgba(255,210,110,0.7); }
        @keyframes wvfade { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) {
          .wv-play { transition: none; }
        }
        @media (max-width: 759px) {
          .wv-console {
            width: 100%;
            max-width: 100%;
            left: 0; right: 0; top: auto; bottom: 0;
            transform: none;
            border-radius: 22px 22px 0 0;
            padding: 26px 20px calc(22px + env(safe-area-inset-bottom));
            max-height: 86dvh;
          }
        }
      `}</style>
    </main>
  );
}
