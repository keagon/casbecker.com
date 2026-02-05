import TypingAnimation from "@/components/TypingAnimation";

export default function HeroSection({ isContactOpen, isResumeOpen, setIsResumeOpen, setIsContactOpen, showScrollButton }) {
  return (
    <section className="min-h-screen flex items-center justify-center relative">
      <div className={`container relative z-10 transition-all duration-400 ease-in-out ${isContactOpen || isResumeOpen ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h1 className="text-5xl md:text-6xl font-bold text-text-50 tracking-tight leading-tight">
            <TypingAnimation delay={120}>HELLO WORLD, I'M CAS BECKER</TypingAnimation>
          </h1>
          <p className="text-lg md:text-xl text-text-100 animate-slide-up delay-100 leading-relaxed max-w-3xl mx-auto">
            I'm an agile developer and social innovator, specializing in Mendix, Front-End Development and creative project management.
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
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-soft group
                   transition-opacity duration-300 ${showScrollButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
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
  );
} 