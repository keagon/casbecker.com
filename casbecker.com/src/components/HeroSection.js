import TypingAnimation from "@/components/TypingAnimation";

export default function HeroSection({ isContactOpen, isResumeOpen, setIsResumeOpen, setIsContactOpen, showScrollButton }) {
  return (
    <section className="min-h-[100svh] flex items-center justify-center relative px-0 py-16 sm:py-20">
      <div className={`container relative z-10 transition-all duration-400 ease-in-out ${isContactOpen || isResumeOpen ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-10 lg:space-y-12">
          <h1 className="text-[1.75rem] leading-tight sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-50 tracking-tight text-balance">
            <TypingAnimation delay={120}>HELLO WORLD, I'M CAS BECKER</TypingAnimation>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-text-100 animate-slide-up delay-100 leading-relaxed max-w-3xl mx-auto text-pretty px-1">
            I'm an agile developer and social innovator, specializing in Mendix, Front-End Development and creative project management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-stretch sm:items-center animate-slide-up delay-200 w-full max-w-md sm:max-w-none mx-auto">
            <button 
              onClick={() => setIsResumeOpen(true)}
              className="btn btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <span className="material-symbols-rounded">description</span>
              View Resume
            </button>
            <button 
              onClick={() => setIsContactOpen(true)}
              className="btn btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <span className="material-symbols-rounded">waving_hand</span>
              Let's Connect
            </button>
          </div>
        </div>
      </div>
      <button 
        onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
        className={`absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce-soft group
                   transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/60 rounded-lg
                   ${showScrollButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-text-100 text-sm group-hover:text-text-50 group-focus-visible:text-text-50 transition-colors duration-300">
            Scroll Down
          </span>
          <span className="material-symbols-rounded text-3xl text-accent-400 group-hover:text-accent-300 group-focus-visible:text-accent-300 group-hover:translate-y-0.5 transition-[color,transform] duration-300">
            expand_more
          </span>
        </div>
      </button>
    </section>
  );
} 