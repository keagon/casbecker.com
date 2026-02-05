'use client';

import { Josefin_Sans } from "next/font/google";
import { LanguageProvider } from '@/components/loci/LanguageContext';

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export default function LociLayout({ children }) {
  return (
    <div className={josefin.className}>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </div>
  );
}
