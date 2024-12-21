'use client';

import { useEffect, useState } from 'react';

export default function TypingAnimation({ children, className = '', delay = 150 }) {
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const fullText = typeof children === 'string' ? children : '';

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
    }
  }, [currentIndex, fullText, delay]);

  return (
    <span className={className}>
      {text}
      {!isTypingComplete && (
        <span className="border-r-2 border-text-50 animate-[blink_1s_infinite]" />
      )}
    </span>
  );
} 