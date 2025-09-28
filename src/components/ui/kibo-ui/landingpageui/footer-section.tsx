"use client"

import * as React from "react"
import { Button } from "@/components/ui/kibo-ui/landingpageui/button"
import Link from "next/link"
import { Input } from "@/components/ui/kibo-ui/landingpageui/input"
// ... textarea not required in this footer demo
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/kibo-ui/landingpageui/tooltip"
import { Facebook, Instagram, Linkedin, Send, Twitter, Loader2, Check } from "lucide-react"
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher'
import { useFramerScroll } from "@/hooks/scroll/use-framer-scroll"
import { subscribeNewsletter } from '@/server/newsletter/actions'
import { toast } from 'sonner'
import { useActionState, useState, useRef, useEffect } from 'react'

// Constantes de configuração
const SUCCESS_DISPLAY_DURATION_MS = 3000; // 3 segundos

interface NewsletterFormState {
  success: boolean;
  error?: string;
}

function FooterSection() {
  const { scrollTo } = useFramerScroll();
  const [isNewsletterPending, setIsNewsletterPending] = useState(false);
  const [isNewsletterSuccess, setIsNewsletterSuccess] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout ao desmontar componente
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const [newsletterState, newsletterAction] = useActionState(async (prevState: NewsletterFormState | null, formData: FormData) => {
    setIsNewsletterPending(true);
    setIsNewsletterSuccess(false);
    
    // Limpar timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    const result = await subscribeNewsletter(formData);
    
    setIsNewsletterPending(false);

    if (result.success) {
      setIsNewsletterSuccess(true);
      // Armazenar referência do timeout para cleanup
      timeoutRef.current = setTimeout(() => {
        setIsNewsletterSuccess(false);
        timeoutRef.current = null;
      }, SUCCESS_DISPLAY_DURATION_MS);
      
      toast.success("Inscrito na newsletter!", {
        description: "Você receberá nossas novidades em breve."
      });
    } else {
      toast.error("Erro ao inscrever", {
        description: result.error || "Tente novamente."
      });
    }

    return result;
  }, null);



  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Mantenha-se Conectado</h2>
            <p className="mb-6 text-muted-foreground">
              Fique por dentro das novidades sobre o Planly.
            </p>
            <form action={newsletterAction} className="relative">
              <Input
                name="email"
                type="email"
                placeholder="Digite seu email"
                className="pr-12 backdrop-blur-sm"
                required
                disabled={isNewsletterPending}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
                disabled={isNewsletterPending || isNewsletterSuccess}
              >
                {isNewsletterPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isNewsletterSuccess ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sr-only">Inscrever-se</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Atalhos</h3>
            <nav className="space-y-2 text-sm">
              <button onClick={() => scrollTo('hero')} className="block transition-colors hover:text-primary cursor-pointer text-left">
                Home
              </button>
              <button onClick={() => scrollTo('features')} className="block transition-colors hover:text-primary cursor-pointer text-left">
                Funcionalidades
              </button>
              <button onClick={() => scrollTo('parallax')} className="block transition-colors hover:text-primary cursor-pointer text-left">
                Sobre
              </button>
              <button onClick={() => scrollTo('features3')} className="block transition-colors hover:text-primary cursor-pointer text-left">
                Serviços
              </button>
              <button onClick={() => scrollTo('contact')} className="block transition-colors hover:text-primary cursor-pointer text-left">
                Contato
              </button>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Entre em Contato</h3>
            <address className="space-y-2 text-sm not-italic">
              <p></p>
              <p></p>
              <p></p>
              <p>Email: suggestions@planly.com</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Siga-nos</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nos siga no Facebook</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nos siga no Twitter</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nos siga no Instagram</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nos siga no LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 Planly. Criado por <Link href="https://alexandregarcia.me" target="_blank" rel="who made it">Alexandre Garcia</Link>.
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="transition-colors hover:text-primary">
              Politica de Privacidade
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Termos de Serviço
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Configurações de Cookies
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { FooterSection }
