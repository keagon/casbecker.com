'use client';

import { useRef, useEffect } from 'react';

export default function LiquidGlass({
  as: Tag = 'div',
  className = '',
  lift = false,
  animateHeight = false,
  children,
}) {
  const ref = useRef(null);
  const bodyRef = useRef(null);

  const onPointerMove = (event) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty('--gy', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  const onPointerLeave = () => {
    ref.current?.style.removeProperty('--gx');
    ref.current?.style.removeProperty('--gy');
  };

  useEffect(() => {
    if (!animateHeight) return;
    const root = ref.current;
    const body = bodyRef.current;
    if (!root || !body) return;

    const ro = new ResizeObserver(() => {
      root.style.height = `${body.offsetHeight}px`;
    });
    ro.observe(body);
    return () => ro.disconnect();
  }, [animateHeight]);

  const classes = ['liquid-glass-root', lift ? 'liquid-glass-root--lift' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      ref={ref}
      className={classes}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div ref={bodyRef} className="liquid-glass__body">{children}</div>
      <div className="liquid-glass__border" aria-hidden="true" />
      <div className="liquid-glass__glint" aria-hidden="true" />
    </Tag>
  );
}
