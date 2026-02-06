'use client';

import { useLanguage } from './LanguageContext';

export default function Hero({ spotsRemaining, totalSpots, spotsTaken }) {
  const { t } = useLanguage();
  const isFull = spotsTaken >= totalSpots;

  const values = [
    { emoji: '♻️', label: t.hero.values.renewable },
    { emoji: '🎯', label: t.hero.values.features },
    { emoji: '⚡', label: t.hero.values.conscious },
    { emoji: '🔐', label: t.hero.values.data },
    { emoji: '🗳️', label: t.hero.values.community },
    { emoji: '💻', label: t.hero.values.opensource },
    { emoji: '🏴', label: t.hero.values.independent },
    { emoji: '🤝', label: t.hero.values.human },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-16 sm:py-24">
      {/* Animated background blobs - positioned behind content */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-300/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/20 to-orange-200/20 rounded-full blur-3xl" />
      </div>
      
      {/* Floating emoji decorations - visible and not clipped */}
      <div className="hidden sm:block absolute inset-0 pointer-events-none z-20">
        <div className="absolute top-24 left-[5%] text-4xl animate-bounce opacity-80" style={{ animationDuration: '3s' }}>🌱</div>
        <div className="absolute top-40 right-[5%] text-3xl animate-bounce opacity-80" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>✨</div>
        <div className="absolute bottom-32 left-[8%] text-3xl animate-bounce opacity-80" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>🔒</div>
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Title with gradient */}
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold mb-4 tracking-tight bg-gradient-to-r from-emerald-600 via-emerald-500 to-orange-500 bg-clip-text text-transparent">
          Loci
        </h1>
        
        {/* Tagline */}
        <p className="text-xl sm:text-2xl md:text-3xl text-slate-600 font-medium mb-8 flex items-center justify-center gap-3 flex-wrap">
          <span>🌿</span>
          <span>{t.hero.tagline}</span>
          <span>⚡</span>
          <span>{t.hero.taglinePart2}</span>
          <span>🌍</span>
        </p>
        
        {/* Hero glass card */}
        <div className="relative backdrop-blur-xl bg-white/60 border border-white/80 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl shadow-emerald-900/5">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-100/50 via-transparent to-orange-100/50" />
          
          <div className="relative z-10 text-left">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-4xl">✊</span>
              <p className="text-slate-700 leading-relaxed text-lg">
                {t.hero.openingText}
              </p>
            </div>
            
            {/* Visual value props */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
              {values.map((item, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 border border-slate-200/80 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all cursor-default"
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-xs sm:text-sm text-slate-600">{item.label}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
                <span>🚀</span>
                <span>{t.hero.thirtyPeople} <span className="text-orange-500">{t.hero.thirtyPeopleCount}</span> {t.hero.thirtyPeopleEnd}</span>
                <span>🚀</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Movement line */}
        <div className="backdrop-blur-md bg-orange-100/60 border border-orange-200/80 rounded-2xl px-6 py-4 mb-10 inline-block shadow-lg shadow-orange-900/5">
          <p className="text-slate-700 text-sm sm:text-base max-w-2xl leading-relaxed">
            💫 {t.hero.movementLine} <span className="text-orange-600 font-semibold">{t.hero.movementUs}</span> {t.hero.movementAnd} <span className="text-emerald-600 font-semibold">{t.hero.movementWorld}</span> {t.hero.movementAgain}
          </p>
        </div>
        
        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#signup"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg
                       bg-gradient-to-r from-emerald-500 to-emerald-400 text-white 
                       hover:from-emerald-400 hover:to-emerald-300 hover:-translate-y-1 hover:scale-105
                       active:scale-100
                       shadow-lg shadow-emerald-500/30
                       hover:shadow-xl hover:shadow-emerald-500/40
                       transition-all duration-300"
          >
            <span>{isFull ? `📝 ${t.hero.ctaWaitlist}` : `🎉 ${t.hero.ctaJoin}`}</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-medium text-lg
                       backdrop-blur-md bg-white/70 text-slate-700 border border-slate-200
                       hover:bg-white hover:border-orange-300 hover:-translate-y-1
                       active:scale-[0.98]
                       shadow-lg shadow-slate-900/5
                       transition-all duration-300"
          >
            <span>✨</span>
            <span>{t.hero.ctaFeatures}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
