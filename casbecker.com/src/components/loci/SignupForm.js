'use client';

import { useState } from 'react';
import { useLanguage } from './LanguageContext';

export default function SignupForm({ spotsTaken, totalSpots }) {
  const { t, locale } = useLanguage();
  const isFull = spotsTaken >= totalSpots;
  
  const valueOptions = [
    { value: 'community', label: `🗳️ ${t.signup.options.community}` },
    { value: 'search', label: `🔍 ${t.signup.options.search}` },
    { value: 'canvas', label: `📝 ${t.signup.options.canvas}` },
    { value: 'multimodal', label: `👁️ ${t.signup.options.multimodal}` },
    { value: 'privacy', label: `🔐 ${t.signup.options.privacy}` },
  ];
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    valueMost: '',
    note: '',
    commitment: false,
  });
  
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const honeypot = e.target.elements.website?.value;
    if (honeypot) {
      setStatus('success');
      return;
    }
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.valueMost || !formData.commitment) {
      setErrorMessage(t.signup.error.required);
      setStatus('error');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage(t.signup.error.email);
      setStatus('error');
      return;
    }
    
    setStatus('submitting');
    setErrorMessage('');
    
    const mode = isFull ? 'Waitlist' : 'Founding Member';
    const timestamp = new Date().toISOString();
    
    const payload = {
      access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
      subject: `New Loci signup: ${formData.name} (${formData.valueMost})`,
      from_name: 'Loci Signup',
      name: formData.name,
      email: formData.email,
      'What they value most': formData.valueMost,
      'Additional note': formData.note || '(none)',
      'Signup mode': mode,
      'Language': locale,
      'Spots at signup': `${spotsTaken}/${totalSpots}`,
      'Timestamp': timestamp,
      message: `
New ${mode} signup for Loci!

Name: ${formData.name}
Email: ${formData.email}
What they value most: ${formData.valueMost}
Additional note: ${formData.note || '(none)'}

Signup mode: ${mode}
Language: ${locale}
Spots at signup: ${spotsTaken}/${totalSpots}
Timestamp: ${timestamp}
      `.trim(),
    };
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          valueMost: '',
          note: '',
          commitment: false,
        });
      } else {
        setErrorMessage(result.message || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch (err) {
      setErrorMessage('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };
  
  if (status === 'success') {
    return (
      <section id="signup" className="px-4 py-16 sm:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-100/30 to-transparent" />
        <div className="max-w-xl mx-auto relative z-10">
          <div className="backdrop-blur-xl bg-white/80 border border-emerald-200 rounded-3xl p-8 text-center shadow-xl shadow-emerald-900/5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-orange-100/50" />
            <div className="relative z-10">
              <div className="text-7xl mb-6 animate-bounce">🎉</div>
              <h3 className="text-3xl font-bold text-slate-800 mb-3">{t.signup.success.title}</h3>
              <p className="text-slate-600 text-lg mb-4">
                {isFull ? t.signup.success.messageWaitlist : t.signup.success.message}
              </p>
              <div className="flex justify-center gap-3">
                <span className="text-3xl">🚀</span>
                <span className="text-3xl">💚</span>
                <span className="text-3xl">✨</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  const spotsLeft = totalSpots - spotsTaken;
  
  return (
    <section id="signup" className="px-4 py-16 sm:py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-100/30 to-transparent" />
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl" />
      
      <div className="max-w-xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{isFull ? '📝' : '🎟️'}</div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-2">
            {isFull ? t.signup.titleWaitlist : t.signup.title}
          </h2>
          <p className="text-slate-500 flex items-center justify-center gap-2">
            {isFull 
              ? <>😅 {t.signup.allTaken}</>
              : <><span>🔥</span> {t.signup.spotsRemaining.replace('{count}', spotsLeft)}</>
            }
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/70 border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5">
          {/* Honeypot */}
          <input 
            type="text" 
            name="website" 
            tabIndex={-1}
            autoComplete="off"
            className="absolute opacity-0 pointer-events-none h-0 w-0"
          />
          
          {/* Name */}
          <div className="mb-5">
            <label htmlFor="name" className="flex items-center gap-2 text-slate-700 text-sm font-medium mb-2">
              <span>👤</span>
              <span>{t.signup.fields.name}</span>
              <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl
                         text-slate-800 placeholder-slate-400
                         focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100
                         transition-all"
              placeholder={t.signup.fields.placeholder.name}
            />
          </div>
          
          {/* Email */}
          <div className="mb-5">
            <label htmlFor="email" className="flex items-center gap-2 text-slate-700 text-sm font-medium mb-2">
              <span>📧</span>
              <span>{t.signup.fields.email}</span>
              <span className="text-orange-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl
                         text-slate-800 placeholder-slate-400
                         focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100
                         transition-all"
              placeholder={t.signup.fields.placeholder.email}
            />
          </div>
          
          {/* What do you value most */}
          <div className="mb-5">
            <label htmlFor="valueMost" className="flex items-center gap-2 text-slate-700 text-sm font-medium mb-2">
              <span>💎</span>
              <span>{t.signup.fields.excites}</span>
              <span className="text-orange-500">*</span>
            </label>
            <select
              id="valueMost"
              name="valueMost"
              value={formData.valueMost}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl
                         text-slate-800 
                         focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100
                         transition-all cursor-pointer"
            >
              <option value="" disabled>Pick one...</option>
              {valueOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Optional note */}
          <div className="mb-6">
            <label htmlFor="note" className="flex items-center gap-2 text-slate-700 text-sm font-medium mb-2">
              <span>💭</span>
              <span>{t.signup.fields.anythingElse}</span>
              <span className="text-slate-400 font-normal">{t.signup.fields.optional}</span>
            </label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl
                         text-slate-800 placeholder-slate-400 resize-none
                         focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100
                         transition-all"
              placeholder={t.signup.fields.placeholder.note}
            />
          </div>
          
          {/* Commitment checkbox */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all">
              <input
                type="checkbox"
                name="commitment"
                checked={formData.commitment}
                onChange={handleChange}
                required
                className="mt-0.5 w-5 h-5 rounded border-slate-300 bg-white 
                           text-emerald-500 focus:ring-emerald-200 focus:ring-offset-0
                           cursor-pointer"
              />
              <span className="text-slate-600 text-sm leading-relaxed group-hover:text-slate-700 transition-colors">
                {isFull 
                  ? <>✨ {t.signup.commitmentWaitlist}</>
                  : <>💚 {t.signup.commitment}</>
                }
              </span>
            </label>
          </div>
          
          {/* Error message */}
          {status === 'error' && errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-red-600 text-sm">{errorMessage}</p>
            </div>
          )}
          
          {/* Submit button */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg
                       bg-gradient-to-r from-emerald-500 to-emerald-400 text-white 
                       hover:from-emerald-400 hover:to-emerald-300 hover:-translate-y-1 hover:scale-[1.02]
                       active:scale-100
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100
                       shadow-lg shadow-emerald-500/30
                       hover:shadow-xl hover:shadow-emerald-500/40
                       transition-all duration-300"
          >
            {status === 'submitting' ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>{t.signup.submitting}</span>
              </>
            ) : isFull ? (
              <>
                <span>📝</span>
                <span>{t.signup.submitWaitlist}</span>
                <span>→</span>
              </>
            ) : (
              <>
                <span>🎉</span>
                <span>{t.signup.submit}</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
