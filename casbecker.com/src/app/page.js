"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import StarNetwork from "@/components/StarNetwork";
import { Carousel } from 'react-responsive-3d-carousel';
import 'react-responsive-3d-carousel/dist/styles.css';

export default function Home() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseModal = (setter) => {
    setIsClosing(true);
    setTimeout(() => {
      setter(false);
      setIsClosing(false);
    }, 300); // Match this with the exit animation duration
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const portfolioItems = [
    {
      title: "De Salon",
      description: "Creatief Collectief Utrecht",
      image: "/portfolio/project1.jpg",
      technologies: [""],
      link: "https://www.instagram.com/desalonutrecht/"
    },
    {
      title: "Nakama",
      description: "Een bordspel dat emotionele verbinding stimuleert",
      image: "/portfolio/project2.jpg",
      technologies: [""],
      link: "https://www.instagram.com/nakamaboardgame/"
    },
    {
      title: "Interleaf",
      description: "Freelance programmeur, web designer en Mendix professional",
      image: "/portfolio/project3.jpg",
      technologies: [""],
      link: "https://nl.linkedin.com/in/%F0%9F%8C%B1cas-becker-690421124/"
    }
  ];

  const carouselItems = portfolioItems.map((item, index) => (
    <div 
      key={index} 
      className="w-full max-w-2xl mx-auto px-6 py-8" 
      style={{ 
        boxShadow: 'none !important',
        WebkitBoxShadow: 'none !important',
        MozBoxShadow: 'none !important',
        all: 'unset',
        width: '100%',
        maxWidth: '42rem',
        padding: '2rem'
      }}
    >
      <div className="card group h-full flex flex-col">
        <div className="relative w-full overflow-hidden rounded-2xl mb-6">
          <div className="w-full pt-[100%] relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 to-transparent z-10" />
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center absolute inset-0 transition-transform duration-500 group-hover:scale-105"
              priority
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col p-6">
          <h3 className="text-2xl md:text-3xl font-bold text-text-50 mb-3">
            {item.title}
          </h3>
          <p className="text-text-100 mb-6 text-base md:text-lg">
            {item.description}
          </p>
          <div className="mt-auto">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-accent-400 hover:text-accent-300 transition-colors gap-2 text-base md:text-lg group"
            >
              View Project
              <span className="material-symbols-rounded text-base md:text-lg transition-transform duration-300 group-hover:translate-x-1">
                arrow_forward
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  ));

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

  return (
    <main className="min-h-screen bg-background-950">
      <StarNetwork />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative">
        <div className={`container relative z-10 transition-all duration-400 ease-in-out ${isContactOpen || isResumeOpen ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h1 className="text-5xl md:text-6xl font-bold text-text-50 animate-slide-up tracking-tight leading-tight">
              HI, I'M CAS BECKER	
            </h1>
            <p className="text-lg md:text-xl text-text-100 animate-slide-up delay-100 leading-relaxed max-w-3xl mx-auto">
              I'm an agile developer and social innovator, specializing in Mendix, Front-End Development and creative project management 
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up delay-200">
              <button 
                onClick={() => setIsResumeOpen(true)}
                className="btn btn-primary w-full sm:w-auto flex items-center gap-2"
              >
                <span className="material-symbols-rounded">description</span>
                View Resume
              </button>
              <button 
                onClick={() => setIsContactOpen(true)}
                className="btn btn-secondary w-full sm:w-auto flex items-center gap-2"
              >
                <span className="material-symbols-rounded">waving_hand</span>
                Let's Connect
              </button>
            </div>
          </div>
        </div>
        <button 
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-soft group"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-text-100 text-sm group-hover:text-text-50 transition-colors">
              Scroll Down
            </span>
            <span className="material-symbols-rounded text-3xl text-accent-400 group-hover:text-accent-300 transition-colors">
              expand_more
            </span>
          </div>
        </button>
      </section>

     

      {/* Portfolio Section
      <section className="py-32 relative">
        <div className="container relative z-10">
          <div className="text-center mb-24">
            <h2 className="section-title text-text-50">Portfolio</h2>
          </div>
          <div className="max-w-6xl mx-auto">
            <Carousel
              items={carouselItems}
              autoPlay={true}
              interval={5000}
              infiniteLoop={true}
              showArrows={true}
              showStatus={false}
              showThumbs={false}
              showIndicators={false}
              centerMode={!isMobile}
              centerSlidePercentage={100}
              className="portfolio-carousel"
              swipeable={true}
              emulateTouch={true}
              preventMovementUntilSwipeScrollTolerance={true}
              swipeScrollTolerance={50}
            />
          </div>
        </div>
      </section> */}

 {/* Services Section */}
 <section className="py-32 relative">
        <div className="container relative z-10">
          <div className="text-center mb-24">
            <h2 className="section-title text-text-50">What do I do?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Social Innovation Card */}
            <div className="card group hover:-translate-y-2 animate-slide-up">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-accent-800/10 rounded-full flex items-center justify-center mx-auto relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-transparent" />
                  <span className="material-symbols-rounded text-4xl text-accent-400">
                    diversity_3
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-text-50 mb-3">
                    Social Innovation
                  </h3>
                  <p className="text-text-100 leading-relaxed">
                    Driving positive change through innovative solutions that address complex social challenges. 
                    Specializing in projects that combine technology with social impact.
                  </p>
                </div>
              </div>
            </div>

            {/* Development Card */}
            <div className="card group hover:-translate-y-2 animate-slide-up delay-100">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-accent-800 bg-opacity-10 rounded-full flex items-center justify-center mx-auto relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-transparent" />
                  <span className="material-symbols-rounded text-4xl text-accent-500">
                    code_blocks
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-text-50 mb-3">
                    Development
                  </h3>
                  <p className="text-text-100 leading-relaxed">
                    Expert in Mendix and front-end development, creating intuitive and scalable applications 
                    that deliver exceptional user experiences.
                  </p>
                </div>
              </div>
            </div>

            {/* Strategic Thinking Card */}
            <div className="card group hover:-translate-y-2 animate-slide-up delay-200">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-accent-800 bg-opacity-10 rounded-full flex items-center justify-center mx-auto relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-transparent" />
                  <span className="material-symbols-rounded text-4xl text-accent-500">
                    psychology_alt
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-text-50 mb-3">
                    Design Thinking
                  </h3>
                  <p className="text-text-100 leading-relaxed">l
                    Leveraging insights from psychology, crossover creativity and design thinking to develop 
                    innovative solutions to social challenges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {isContactOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => handleCloseModal(setIsContactOpen)}
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
                  onClick={() => handleCloseModal(setIsContactOpen)}
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
      )}

      {/* Resume Modal */}
      {isResumeOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => handleCloseModal(setIsResumeOpen)}
        >
          <div className={`modal-backdrop ${isClosing ? 'modal-backdrop-exit-active' : 'modal-backdrop-enter-active'}`} />
          <div 
            className={`relative w-full max-w-md mx-4 ${isClosing ? 'animate-fade-out' : 'animate-scale-up'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-background-900/50 backdrop-blur-sm rounded-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-rounded text-accent-500">description</span>
                  <h3 className="text-2xl font-bold text-text-50">My Resume</h3>
                </div>
                <button 
                  onClick={() => handleCloseModal(setIsResumeOpen)}
                  className="text-text-200 hover:text-text-50 transition-all duration-300"
                >
                  <span className="material-symbols-rounded">close</span>
                </button>
              </div>
              <p className="text-text-200 mb-8">
                Download my resume to learn more about my experience, skills, and achievements.
              </p>
              <div className="grid gap-4">
                <a
                  href="/CV-Cas-Becker-apr-2023-Development.pdf"
                  download
                  onClick={() => handleCloseModal(setIsResumeOpen)}
                  className="group relative flex items-center p-4 rounded-lg transform hover:-translate-x-1 hover:translate-y-0.5 
                           transition-all duration-300 shadow-lg overflow-hidden"
                >
                  <div className="absolute inset-0 bg-background-800/20 backdrop-blur-sm" />
                  <div className="relative flex items-center w-full">
                    <span className="p-2 rounded-lg mr-4 transition-all duration-300 text-accent-500">
                      <span className="material-symbols-rounded">download</span>
                    </span>
                    <span className="font-medium text-text-50">Download Resume</span>
                    <span className="material-symbols-rounded ml-auto transform transition-transform duration-300 group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
