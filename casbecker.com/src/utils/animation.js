import { ANIMATION_DURATION } from '@/constants/theme';

export function withDelayedUnmount(Component, delay = ANIMATION_DURATION.normal) {
  return function DelayedUnmount({ isClosing, onClose, ...props }) {
    if (!props.isOpen) return null;

    return (
      <Component
        {...props}
        isClosing={isClosing}
        onClose={() => {
          if (isClosing) return;
          onClose();
        }}
      />
    );
  };
}

export function interpolateColor(color1, color2, progress) {
  const [r1, g1, b1] = color1.split(',').map(Number);
  const [r2, g2, b2] = color2.split(',').map(Number);
  
  const r = Math.round(r1 + (r2 - r1) * progress);
  const g = Math.round(g1 + (g2 - g1) * progress);
  const b = Math.round(b1 + (b2 - b1) * progress);
  
  return `${r}, ${g}, ${b}`;
}

export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
} 