import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Features2 from '@/components/landing/Features2';
import Features4 from '@/components/landing/Features3';

export default function LandingPage() {
  return (
    <main className="flex flex-col gap-4 p-4 md:p-8 lg:p-12">
      <div>
        <Hero />
        <Features />
        <Features2 />
        <Features4 />
      </div>
    </main>
  );
}
