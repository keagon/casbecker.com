const services = [
  {
    icon: "diversity_3",
    title: "Social Innovation",
    description: (
      <>
        Driving positive change through innovative solutions that address complex social challenges.
        Specializing in projects that combine technology with social impact. Like{" "}
        <a
          href="https://nakamaboardgame.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-400 underline-offset-2 hover:text-accent-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/60 rounded-sm transition-colors duration-300"
        >
          Nakama the card game
        </a>{" "}
        and{" "}
        <a
          href="https://www.desalonutrecht.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-400 underline-offset-2 hover:text-accent-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/60 rounded-sm transition-colors duration-300"
        >
          DeSalon
        </a>
        .
      </>
    ),
  },
  {
    icon: "code_blocks",
    title: "Development",
    description:
      "Expert in Mendix and front-end development, creating intuitive and scalable applications that deliver exceptional user experiences. With an insight into clients derived from a background in psychology.",
  },
  {
    icon: "psychology_alt",
    title: "Design Thinking",
    description:
      "Leveraging insights from psychology, crossover creativity and design thinking to develop innovative solutions to social challenges. Transdisciplinary, creative, and practical.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-12 sm:py-20 lg:py-32 relative">
      <div className="relative z-10 w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-10 sm:mb-16 lg:mb-24">
          <h2 className="section-title text-text-50">What do I do?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-10">
          {services.map((service, index) => (
            <article
              key={service.title}
              className={[
                "service-card animate-slide-up",
                index === 1 ? "delay-100" : "",
                index === 2 ? "delay-200 sm:col-span-2 lg:col-span-1 sm:max-w-md sm:mx-auto lg:max-w-none" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {/* Glass sits BEHIND the panel (sibling) — avoids overflow+backdrop opacity bug */}
              <div className="service-card__glass" aria-hidden="true" />

              <div className="service-card__panel">
                <div className="service-card__visual">
                  <span className="material-symbols-rounded service-card__icon" aria-hidden="true">
                    {service.icon}
                  </span>
                </div>

                <div className="service-card__content">
                  <h3 className="service-card__title">{service.title}</h3>
                  <p className="service-card__description">{service.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
