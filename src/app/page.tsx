import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Features2 from '@/components/landing/Features2';
import Features3 from '@/components/landing/Features3';
import Parallax from '@/components/landing/Parallax';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/landing/Footer';


export default function LandingPage() {
  return (
    <main className="flex flex-col gap-4 p-4 md:p-8 lg:p-12">
      <div>
        <Hero />
        <Features />
        <Parallax />
        <Features2 />
        <Features3 />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
