import Hero from '@/components/loci/Hero';
import SpotsCounter from '@/components/loci/SpotsCounter';
import FeatureCards from '@/components/loci/FeatureCards';
import Pricing from '@/components/loci/Pricing';
import AboutCas from '@/components/loci/AboutCas';
import SignupForm from '@/components/loci/SignupForm';
import FAQ from '@/components/loci/FAQ';
import Footer from '@/components/loci/Footer';
import LanguageSwitcher from '@/components/loci/LanguageSwitcher';

export const metadata = {
  title: 'Loci - Ethical, Community-Driven AI 🌱',
  description: 'Loci is a movement against privacy invasion, pollution, and hierarchy. Join the 30 founding members building AI that runs on clean energy and respects your data.',
  openGraph: {
    title: 'Loci - Ethical, Community-Driven AI 🌱',
    description: 'Join the countermovement. AI that runs on clean energy, respects your privacy, and is shaped by the community.',
    type: 'website',
  },
};

export default function LociPage() {
  const spotsTaken = parseInt(process.env.NEXT_PUBLIC_LOCI_SPOTS_TAKEN || '0', 10);
  const totalSpots = parseInt(process.env.NEXT_PUBLIC_LOCI_SPOTS_TOTAL || '30', 10);
  const spotsRemaining = Math.max(0, totalSpots - spotsTaken);
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/30 to-orange-50/20 text-slate-800 overflow-hidden">
      {/* Language Switcher */}
      <LanguageSwitcher />
      
      {/* Global background effects */}
      <div className="fixed inset-0 -z-10">
        {/* Radial glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/40 via-emerald-100/20 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-orange-200/30 via-orange-100/10 to-transparent" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <Hero 
        spotsRemaining={spotsRemaining} 
        totalSpots={totalSpots} 
        spotsTaken={spotsTaken} 
      />
      
      <SpotsCounter 
        spotsTaken={spotsTaken} 
        totalSpots={totalSpots} 
      />
      
      <FeatureCards />
      
      <Pricing />
      
      <AboutCas />
      
      <SignupForm 
        spotsTaken={spotsTaken} 
        totalSpots={totalSpots} 
      />
      
      <FAQ />
      
      <Footer />
    </main>
  );
}
