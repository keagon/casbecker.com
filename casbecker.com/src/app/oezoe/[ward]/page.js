import { notFound } from 'next/navigation';
import WardVoice from '../../../components/WardVoice';
import { WARDS, wardById } from '../../../lib/wards';

export function generateStaticParams() {
  return WARDS.map((ward) => ({ ward: ward.id }));
}

export function generateMetadata({ params }) {
  const ward = wardById(params.ward);
  if (!ward) return { title: 'The Oezoe Affair' };
  return {
    title: `${ward.name} — The Oezoe Affair`,
    description: 'Listen to the Ward.',
    robots: { index: false, follow: false },
  };
}

export const viewport = {
  themeColor: '#06040a',
};

export default function WardPage({ params }) {
  const ward = wardById(params.ward);
  if (!ward) notFound();
  return <WardVoice ward={ward} />;
}
