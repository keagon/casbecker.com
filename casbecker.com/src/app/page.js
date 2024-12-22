"use client";

import { useState, useEffect } from "react";
import StarNetwork from "@/components/StarNetwork";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ContactModal from "@/components/ContactModal";
import ResumeModal from "@/components/ResumeModal";

export default function Home() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(true);

  const handleCloseModal = (setter) => {
    setIsClosing(true);
    setTimeout(() => {
      setter(false);
      setIsClosing(false);
    }, 300); // Match this with the exit animation duration
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const halfPageHeight = windowHeight / 2;
      
      setShowScrollButton(scrollPosition < halfPageHeight);
    };

    // Initial check
    handleScroll();

    // Add event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-background-950">
      <StarNetwork />
      
      <HeroSection 
        isContactOpen={isContactOpen}
        isResumeOpen={isResumeOpen}
        setIsResumeOpen={setIsResumeOpen}
        setIsContactOpen={setIsContactOpen}
        showScrollButton={showScrollButton}
      />

      <ServicesSection />

      <ContactModal 
        isOpen={isContactOpen}
        onClose={() => handleCloseModal(setIsContactOpen)}
        isClosing={isClosing}
      />

      <ResumeModal 
        isOpen={isResumeOpen}
        onClose={() => handleCloseModal(setIsResumeOpen)}
        isClosing={isClosing}
      />
    </main>
  );
}
