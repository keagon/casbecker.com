'use client';

export default function BorderBeam({ duration = 4, ...props }) {
  return (
    <div
      style={{
        '--duration': duration,
      }}
      className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      {...props}
    >
      <div
        style={{
          offsetPath: 'path("M 0 0, L 100% 0, L 100% 100%, L 0 100%, L 0 0")',
        }}
        className="absolute h-2 w-2 animate-border-beam"
      >
        <div className="absolute inset-0 rounded-full blur-[2px] bg-gradient-to-r from-accent-400 via-primary-400 to-accent-400" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-400 via-primary-400 to-accent-400" />
      </div>
    </div>
  );
} 