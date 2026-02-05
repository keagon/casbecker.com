'use client';

import { useLanguage } from './LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  
  const links = [
    { label: t.footer.home, href: '/', emoji: '🏠' },
    { label: t.footer.status, href: '#', emoji: '📊' },
    { label: t.footer.contact, href: 'mailto:casbecker@gmail.com', emoji: '📧' },
  ];

  return (
    <footer className="px-4 py-12 relative">
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌱</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-orange-500 bg-clip-text text-transparent">
              Loci
            </span>
          </div>
          
          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 text-sm transition-all"
              >
                <span>{link.emoji}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </nav>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-200 text-center">
          <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
            <span>© {new Date().getFullYear()} Loci</span>
            <span>•</span>
            <span>{t.footer.builtWith}</span>
            <span>•</span>
            <span>🌍</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
