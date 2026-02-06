'use client';

import Image from 'next/image';
import { useLanguage } from './LanguageContext';

export default function AboutCas() {
  const { t } = useLanguage();
  
  return (
    <section id="about" className="px-4 py-16 sm:py-24 relative">
      {/* Background accent - contained */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">👋</div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-800">
            {t.about.title}
          </h2>
        </div>
        
        <div className="backdrop-blur-xl bg-white/70 border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 overflow-hidden relative">
          {/* Decorative gradient - properly positioned */}
          <div className="absolute inset-0 overflow-visible pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/40 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />
          </div>
          
          <div className="relative z-10">
            {/* Avatar + info */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-lg border-4 border-white ring-2 ring-emerald-100">
                <Image
                  src="/cas-portrait.JPG"
                  alt="Cas Becker"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 112px, 128px"
                  priority
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold text-slate-800 mb-1">Cas Becker</h3>
                <p className="text-slate-500 flex items-center justify-center sm:justify-start gap-2">
                  <span>🌍</span>
                  <span>{t.about.role}</span>
                </p>
              </div>
            </div>
            
            {/* Bio with icons */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-2xl">🎮</span>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t.about.bio1}
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-2xl">🌉</span>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t.about.bio2}
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-2xl">✨</span>
                <div className="text-slate-600 text-sm leading-relaxed">
                  <p className="mb-2">{t.about.earlierWork}</p>
                  <ul className="space-y-1">
                    <li>
                      • {t.about.salon} (
                      <a 
                        href="https://desalonutrecht.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700 underline"
                      >
                        desalonutrecht.com
                      </a>
                      )
                    </li>
                    <li>
                      • {t.about.game} (
                      <a 
                        href="https://creactie.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700 underline"
                      >
                        creactie.com
                      </a>
                      )
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Idealistic note */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-emerald-50 to-orange-50 border border-slate-200">
                <span className="text-xl">💫</span>
                <p className="text-slate-600 text-sm font-medium italic">
                  {t.about.idealistic}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
