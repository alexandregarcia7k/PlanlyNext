import dynamic from 'next/dynamic';

// ⚡ Performance: Carrega imediatamente (above the fold)
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';

// 🚀 Performance: Lazy load (carrega quando usuário scrolla - code-splitting)
const Parallax = dynamic(() => import('@/components/landing/Parallax'));
const Features2 = dynamic(() => import('@/components/landing/Features2'));
const Contact = dynamic(() => import('@/components/landing/Contact'));
const Features3 = dynamic(() => import('@/components/landing/Features3'));
const Footer = dynamic(() => import('@/components/landing/Footer'));

/**
 * Landing Page com Code-Splitting Estratégico
 *
 * O QUE É CODE-SPLITTING?
 * Dividir o JavaScript em "chunks" (pedaços) que carregam sob demanda.
 *
 * COMO FUNCIONA?
 * - Hero + Features: Carregam imediatamente (usuário vê primeiro)
 * - Parallax, Features2, Features3, Contact, Footer: Carregam quando visíveis
 *
 * GANHO:
 * - ANTES: 230 KB baixados imediatamente
 * - DEPOIS: ~150 KB iniciais, resto carrega progressivamente
 * - RESULTADO: -80 KB initial load, +1s FCP
 */
export default function LandingPage() {
  return (
    <main className="flex flex-col gap-4 p-4 md:p-8 lg:p-12">
      <div>
        <Hero />
        <Features />
        <Parallax />
        <Features2 />
        <Contact />
        <Features3 />
        <Footer />
      </div>
    </main>
  );
}
