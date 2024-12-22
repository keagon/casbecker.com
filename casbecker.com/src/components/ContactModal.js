import { useState } from 'react';

export default function ContactModal({ isOpen, onClose, isClosing }) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText('cas.interleaf@gmail.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 1300);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const socialLinks = [
    {
      name: 'Email',
      href: '#',
      onClick: handleCopyEmail,
      icon: <span className="material-symbols-rounded text-[28px]">mail</span>,
      color: 'text-[#EA4335]',
      label: copiedEmail ? 'Copied!' : (
        <>
          <span className="hidden sm:inline">cas.interleaf@gmail.com</span>
          <span className="sm:hidden">Email</span>
        </>
      )
    },
    {
      name: 'LinkedIn',
      href: 'https://nl.linkedin.com/in/%F0%9F%8C%B1cas-becker-690421124',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      color: 'text-[#0077B5]'
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/cas.imomo/',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      color: 'text-[#E4405F]'
    }
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className={`modal-backdrop ${isClosing ? 'modal-backdrop-exit-active' : 'modal-backdrop-enter-active'}`} />
      <div 
        className={`relative w-full max-w-md mx-4 ${isClosing ? 'animate-fade-out' : 'animate-scale-up'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-background-900/50 backdrop-blur-sm rounded-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-rounded text-accent-500">handshake</span>
              <h3 className="text-2xl font-bold text-text-50">Let's Connect</h3>
            </div>
            <button 
              onClick={onClose}
              className="text-text-200 hover:text-text-50 transition-all duration-300"
            >
              <span className="material-symbols-rounded">close</span>
            </button>
          </div>
          <p className="text-text-200 mb-8">
            Feel free to reach out through any of these platforms. I'm always excited to connect and discuss new opportunities!
          </p>
          <div className="grid gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={link.onClick}
                target={link.onClick ? undefined : "_blank"}
                rel={link.onClick ? undefined : "noopener noreferrer"}
                className="group relative flex items-center p-4 rounded-lg transform hover:-translate-x-1 hover:translate-y-0.5 
                         transition-all duration-300 shadow-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-background-800/20 backdrop-blur-sm" />
                <div className="relative flex items-center w-full">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg mr-4 transition-all duration-300 ${link.color}`}>
                    {link.icon}
                  </div>
                  <span className="font-medium text-text-50">{link.label || link.name}</span>
                  <span className="material-symbols-rounded ml-auto transform transition-transform duration-300 group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 