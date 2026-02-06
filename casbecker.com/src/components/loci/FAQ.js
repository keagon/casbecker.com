'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

const emojis = ['🗳️', '🔐', '🌿', '⚡', '💰'];

export default function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);
  const [heights, setHeights] = useState({});
  
  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    if (openIndex !== null && contentRefs.current[openIndex]) {
      setHeights(prev => ({
        ...prev,
        [openIndex]: contentRefs.current[openIndex].scrollHeight,
      }));
    }
  }, [openIndex]);
  
  return (
    <section className="px-4 py-20 sm:py-28 relative">
      {/* Background - contained */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <div className="text-5xl mb-4">🤔</div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-800">
            {t.faq.title}
          </h2>
        </div>
        
        <div className="space-y-4">
          {t.faq.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`backdrop-blur-xl rounded-2xl border transition-all duration-300
                           ${isOpen 
                             ? 'bg-white/80 border-emerald-200 shadow-lg shadow-emerald-900/5' 
                             : 'bg-white/60 border-slate-200 hover:border-slate-300 hover:bg-white/70 hover:shadow-md'}`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="w-full px-5 sm:px-6 py-5 flex items-center justify-between text-left
                             transition-colors focus:outline-none 
                             focus:ring-2 focus:ring-emerald-200 focus:ring-inset rounded-2xl"
                >
                  <span className="flex items-center gap-3 pr-4">
                    <span className="text-2xl flex-shrink-0">{emojis[index]}</span>
                    <span className={`font-medium transition-colors duration-200 ${isOpen ? 'text-slate-900' : 'text-slate-700'}`}>
                      {item.question}
                    </span>
                  </span>
                  <span 
                    className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full
                                border transition-all duration-300
                                ${isOpen 
                                  ? 'rotate-180 bg-emerald-100 border-emerald-200 text-emerald-600' 
                                  : 'bg-slate-100 border-slate-200 text-slate-400'}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                
                <div
                  id={`faq-answer-${index}`}
                  ref={el => contentRefs.current[index] = el}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className="overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{
                    maxHeight: isOpen ? `${heights[index] || 500}px` : '0px',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="px-5 sm:px-6 pb-6 pt-1 ml-11">
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
