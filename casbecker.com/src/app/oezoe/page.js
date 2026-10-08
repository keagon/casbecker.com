import OezoeVault from '../../components/OezoeVault';

export const metadata = {
  title: 'The Oezoe Vault',
  description: 'Speak the four true names to open the vault.',
  robots: { index: false, follow: false },
};

export const viewport = {
  themeColor: '#06040a',
};

export default function OezoePage() {
  return <OezoeVault />;
}
