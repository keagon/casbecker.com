'use client';

import { useRef } from 'react';

export default function LiquidGlass({
  as: Tag = 'div',
  className = '',
  lift = false,
  children,
}) {
  const ref = useRef(null);

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
      <div className="liquid-glass" aria-hidden="true">
        <div className="liquid-glass__center" />
        <div className="liquid-glass__rim" />
        <div className="liquid-glass__sheen" />
      </div>
      <div className="liquid-glass__body">{children}</div>
      <div className="liquid-glass__specular" aria-hidden="true" />
      <div className="liquid-glass__edge" aria-hidden="true" />
    </Tag>
  );
}
