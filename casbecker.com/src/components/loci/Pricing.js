'use client';

import { useLanguage } from './LanguageContext';

export default function Pricing() {
  const { t } = useLanguage();
  
  const perks = [
    { emoji: '🚀', label: t.pricing.perks.early },
    { emoji: '🗳️', label: t.pricing.perks.vote },
    { emoji: '⭐', label: t.pricing.perks.credits },
    { emoji: '💬', label: t.pricing.perks.feedback },
  ];

  return (
    <section className="px-4 py-16 sm:py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-100/30 to-transparent" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">💰</div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-800">
            {t.pricing.title}
          </h2>
        </div>
        
        {/* Pricing card */}
        <div className="relative backdrop-blur-xl bg-white/70 border border-white/80 rounded-[2rem] p-8 sm:p-12 shadow-xl shadow-slate-900/5 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-orange-200/40 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
          
          <div className="relative z-10">
            {/* Price display */}
            <div className="text-center mb-8">
              <div className="inline-flex items-baseline gap-1 mb-2">
                <span className="text-7xl sm:text-8xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-500 to-orange-500 bg-clip-text text-transparent">
                  €19
                </span>
                <span className="text-slate-400 text-2xl font-medium">{t.pricing.perMonth}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-orange-100 border border-orange-200">
                <span>🌟</span>
                <span className="text-orange-600 text-sm font-medium">{t.pricing.foundingPrice}</span>
              </div>
            </div>
            
            {/* Comparison */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200">
                <span>❌</span>
                <span className="text-red-500 text-sm line-through">{t.pricing.comparison.old}</span>
              </div>
              <span className="text-2xl">→</span>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
                <span>✅</span>
                <span className="text-emerald-600 text-sm font-bold">{t.pricing.comparison.new}</span>
              </div>
            </div>
            
            {/* Built for humans */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                `🌿 ${t.pricing.badges.energy}`,
                `🔐 ${t.pricing.badges.privacy}`,
                `🤝 ${t.pricing.badges.community}`
              ].map((item) => (
                <span key={item} className="px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-sm">
                  {item}
                </span>
              ))}
            </div>
            
            {/* Early stage note */}
            <div className="backdrop-blur-md bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8 text-center">
              <p className="text-slate-600 text-sm flex items-center justify-center gap-2">
                <span>🏗️</span>
                <span>{t.pricing.earlyStage}</span>
                <span>🎢</span>
              </p>
            </div>
            
            {/* Founding member perks */}
            <div className="border-t border-slate-200 pt-8">
              <h3 className="text-center text-slate-800 font-bold text-lg mb-6 flex items-center justify-center gap-2">
                <span>👑</span>
                <span>{t.pricing.perksTitle}</span>
              </h3>
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                {perks.map((perk) => (
                  <div 
                    key={perk.label} 
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                  >
                    <span className="text-xl">{perk.emoji}</span>
                    <span className="text-slate-600 text-sm">{perk.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
