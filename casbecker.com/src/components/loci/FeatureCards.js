'use client';

import { useLanguage } from './LanguageContext';

export default function FeatureCards() {
  const { t } = useLanguage();
  
  const features = [
    {
      ...t.features.items.chat,
      emoji: '💬',
      gradient: 'from-emerald-50 to-teal-50',
      border: 'hover:border-emerald-300',
    },
    {
      ...t.features.items.shape,
      emoji: '🗳️',
      gradient: 'from-orange-50 to-amber-50',
      border: 'hover:border-orange-300',
    },
    {
      ...t.features.items.search,
      emoji: '🔍',
      gradient: 'from-emerald-50 to-cyan-50',
      border: 'hover:border-emerald-400',
    },
    {
      ...t.features.items.canvas,
      emoji: '📝',
      gradient: 'from-orange-50 to-yellow-50',
      border: 'hover:border-orange-400',
    },
    {
      ...t.features.items.multimodal,
      emoji: '👁️',
      gradient: 'from-emerald-50 to-orange-50',
      border: 'hover:border-emerald-300',
    },
  ];

  return (
    <section id="features" className="px-4 py-16 sm:py-24 relative">
      {/* Background elements - contained to prevent overflow issues */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🎁</div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
            {t.features.title}
          </h2>
          
          {/* Reality check */}
          <div className="max-w-2xl mx-auto backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl p-5 mb-8 shadow-lg">
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <span>{t.features.realityCheck}</span>
            </p>
          </div>
        </div>
        
        {/* Feature cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative backdrop-blur-xl bg-white/70 border border-slate-200 rounded-3xl p-6 
                         ${feature.border}
                         hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-900/10
                         transition-all duration-300`}
            >
              {/* Gradient background on hover - clipped independently */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
              
              <div className="relative z-10">
                <span className="text-5xl mb-4 inline-block origin-center group-hover:scale-110 transition-transform duration-300">
                  {feature.emoji}
                </span>
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm group-hover:text-slate-600 transition-colors">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* No-bloat banner */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 backdrop-blur-md bg-gradient-to-r from-emerald-50 to-orange-50 border border-slate-200 rounded-full px-6 py-3 shadow-lg">
            <span className="text-2xl">🚫</span>
            <p className="text-slate-700 text-sm sm:text-base font-medium">
              {t.features.noBloat} <span className="text-orange-600 font-bold">{t.features.youDecide}</span>
            </p>
            <span className="text-2xl">✅</span>
          </div>
        </div>
      </div>
    </section>
  );
}
