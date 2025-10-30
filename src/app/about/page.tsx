
import type { Metadata } from 'next';
import AboutClientPage from '@/components/about/AboutClientPage';

export const metadata: Metadata = {
  title: 'About | Portfolio Ace',
  description: 'Learn more about Alejandro Mejia Rojas, a Multimedia Engineer specializing in UX and Game Design.',
};

const AboutPage = () => {
  return <AboutClientPage />;
};

export default AboutPage;
