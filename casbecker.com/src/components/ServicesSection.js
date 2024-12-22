export default function ServicesSection() {
  return (
    <section className="py-16 sm:py-32 relative">
      <div className="container relative z-10">
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="section-title text-text-50">What do I do?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12 max-w-6xl mx-auto">
          {/* Social Innovation Card */}
          <div className="relative group">
            <div className="card service-card animate-slide-up">
              <div className="content-wrapper">
                <div className="icon-wrapper">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-transparent" />
                  <span className="material-symbols-rounded icon">
                    diversity_3
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="title">
                    Social Innovation
                  </h3>
                  <p className="description">
                    Driving positive change through innovative solutions that address complex social challenges. 
                    Specializing in projects that combine technology with social impact.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Development Card */}
          <div className="relative group">
            <div className="card service-card animate-slide-up delay-100">
              <div className="content-wrapper">
                <div className="icon-wrapper">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-transparent" />
                  <span className="material-symbols-rounded icon">
                    code_blocks
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="title">
                    Development
                  </h3>
                  <p className="description">
                    Expert in Mendix and front-end development, creating intuitive and scalable applications 
                    that deliver exceptional user experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Thinking Card */}
          <div className="relative group">
            <div className="card service-card animate-slide-up delay-200">
              <div className="content-wrapper">
                <div className="icon-wrapper">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-transparent" />
                  <span className="material-symbols-rounded icon">
                    psychology_alt
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="title">
                    Design Thinking
                  </h3>
                  <p className="description">
                    Leveraging insights from psychology, crossover creativity and design thinking to develop 
                    innovative solutions to social challenges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 