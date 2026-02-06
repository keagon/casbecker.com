'use client';

import { useLanguage } from './LanguageContext';

export default function SpotsCounter({ spotsTaken, totalSpots }) {
  const { t } = useLanguage();
  const percentage = Math.min((spotsTaken / totalSpots) * 100, 100);
  const spotsLeft = totalSpots - spotsTaken;
  
  return (
    <section className="px-4 py-12 sm:py-16 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-100/30 to-transparent" />
      
      <div className="max-w-xl mx-auto relative">
        <div className="backdrop-blur-xl bg-white/70 border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-900/5 overflow-hidden relative">
          {/* Decorative gradient - behind content */}
          <div className="absolute inset-0 overflow-visible pointer-events-none -z-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-200/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>
          
          <div className="relative z-10">
            {/* Header with emoji */}
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎯</div>
              <p className="text-slate-500 text-sm uppercase tracking-wider font-medium">{t.counter.title}</p>
            </div>
            
            {/* Big numbers */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="text-center">
                <p className="text-6xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500">
                  {spotsTaken}
                </p>
                <p className="text-emerald-600 text-xs uppercase tracking-wider">{t.counter.taken}</p>
              </div>
              <span className="text-4xl text-slate-300 font-light">/</span>
              <div className="text-center">
                <p className="text-6xl sm:text-7xl font-bold text-slate-300">
                  {totalSpots}
                </p>
                <p className="text-slate-400 text-xs uppercase tracking-wider">{t.counter.total}</p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-200">
              <div 
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out overflow-hidden"
                style={{ width: `${percentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-emerald-400 to-orange-400" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
              </div>
              
              {/* Spot markers */}
              <div className="absolute inset-0 flex justify-between px-1">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-px h-full bg-slate-200" />
                ))}
              </div>
            </div>
            
            {/* Spots remaining badge */}
            {spotsLeft > 0 && (
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200">
                  <span className="text-lg">🔥</span>
                  <span className="text-orange-600 font-bold">{spotsLeft} {t.counter.spotsLeft}</span>
                </div>
              </div>
            )}
            
            {/* Explanation */}
            <p className="text-center text-slate-500 text-sm flex items-center justify-center gap-2">
              <span>🤏</span>
              <span>{t.counter.explanation}</span>
              <span>💚</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
