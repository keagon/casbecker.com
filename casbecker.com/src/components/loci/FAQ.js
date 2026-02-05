'use client';

import { useState } from 'react';
import { useLanguage } from './LanguageContext';

const emojis = ['🗳️', '🔐', '🌿', '⚡', '💰'];

export default function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);
  
  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <section className="px-4 py-16 sm:py-24 relative">
      {/* Background */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🤔</div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-800">
            {t.faq.title}
          </h2>
        </div>
        
        <div className="space-y-3">
          {t.faq.items.map((item, index) => (
            <div
              key={index}
              className="backdrop-blur-xl bg-white/70 border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all"
            >
              <button
                onClick={() => toggleItem(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                className="w-full px-6 py-5 flex items-center justify-between text-left
                           hover:bg-slate-50 transition-colors focus:outline-none 
                           focus:ring-2 focus:ring-emerald-200 focus:ring-inset"
              >
                <span className="flex items-center gap-3 pr-4">
                  <span className="text-2xl">{emojis[index]}</span>
                  <span className="text-slate-800 font-medium">{item.question}</span>
                </span>
                <span 
                  className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full
                              bg-slate-100 border border-slate-200
                              text-slate-500 transition-all duration-300
                              ${openIndex === index ? 'rotate-180 bg-emerald-100 border-emerald-200 text-emerald-600' : ''}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-out
                            ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}
              >
                <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed pl-16">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
