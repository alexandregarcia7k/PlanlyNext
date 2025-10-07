'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight} from 'lucide-react';
import { Button } from '../ui/kibo-ui/landingpageui/button';
import Image from 'next/image';
import { TextEffect } from '../ui/kibo-ui/landingpageui/text-effect';
import { AnimatedGroup } from '../ui/kibo-ui/landingpageui/animated-group';
import { Header } from '../landing/Header';
import { animationVariants } from '../ui/kibo-ui/landingpageui/animations';
import { useFramerScroll } from '@/hooks/scroll/use-framer-scroll';

export default function Hero() {
  const { scrollTo } = useFramerScroll();
  return (
    <>
      <Header />
      <main className="overflow-hidden" id="hero">
        <div
          aria-hidden
          className="absolute inset-0 isolate opacity-100 contain-strict lg:block"
        >
          {/* ⚡ Performance: Blur reduzido de 48px para 16px (blur-3xl → blur-lg) */}
          <div
            className="
              absolute left-0 top-0 -rotate-45 -translate-y-87.5 w-140 h-320 rounded-full
              bg-[linear-gradient(115deg,rgba(67,25,97,0.16)_0%,rgba(160,120,220,0.10)_38%,rgba(67,25,97,0)_78%)]
              mix-blend-screen blur-lg
              dark:bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]
              dark:mix-blend-normal dark:blur-none
            "
          />
          <div
            className="
              absolute left-0 top-0 -rotate-45 [translate:5%_-50%] w-60 h-320 rounded-full
              bg-[radial-gradient(60%_60%_at_55%_45%,rgba(195,150,240,0.14)_0,rgba(67,25,97,0.06)_55%,transparent_100%)]
              mix-blend-screen blur-lg
              dark:bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]
              dark:mix-blend-normal dark:blur-none
            "
          />
          <div
            className="
              absolute left-0 top-0 -rotate-45 -translate-y-87.5 w-60 h-320 rounded-full
              bg-[radial-gradient(35%_35%_at_65%_30%,rgba(255,255,255,0.22)_0,rgba(167,139,250,0.12)_30%,transparent_70%)]
              mix-blend-screen blur-lg
              dark:bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]
              dark:mix-blend-normal dark:blur-none
            "
          />
        </div>

        <section>
          <div className="relative pt-24 md:pt-36">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      delayChildren: 0.2, // ⚡ Performance: Reduzido de 1.0s para 0.2s
                    },
                  },
                },
                item: {
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: 'spring',
                      bounce: 0.3,
                      duration: 2,
                    },
                  },
                },
              }}
              className="mask-b-from-35% mask-b-to-90% absolute inset-0 top-56 -z-20 lg:top-32"
            >
              {/* <Image
                src=""
                alt="background"
                className="hidden size-full dark:block"
                width="3276"
                height="4095"
              /> */}
              {/* Empty fragment as children to satisfy required prop */}
              <>
              </>
            </AnimatedGroup>

            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
            />

            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={animationVariants.heroText}>
                  <Link
                    href="#features"
                    className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                    onClick={e => {
                      e.preventDefault();
                      scrollTo('features');
                    }}
                  >
                    <span className="text-foreground text-sm">
                      Confira nossas funcionalidades
                    </span>
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                    <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedGroup>

                {/* ⚡ Performance: Blur mais rápido (speedSegment 0.3 → 0.15) */}
                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.15}
                  as="h1"
                  className="mx-auto mt-8 max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]"
                >
                    Ser produtivo e organizado não é complicado.
                </TextEffect>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.15}
                  delay={0.5}
                  as="p"
                  className="mx-auto mt-8 max-w-2xl text-balance text-lg"
                >
                  Ferramentas para aumentar sua produtividade e organizar sua vida de forma simples e eficaz.
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.3, // ⚡ Performance: Reduzido de 0.75s para 0.3s
                        },
                      },
                    },
                    ...animationVariants.heroText,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <div
                    key={1}
                    className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5"
                  >
                    <Button asChild size="lg" className="rounded-xl px-5 text-base">
                      <Link href="#link">
                        <span className="text-nowrap">Começar</span>
                      </Link>
                    </Button>
                  </div>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-10.5 rounded-xl px-5"
                  >
                    <Link href="https://planly-demo-frontend.vercel.app" target='_blank' rel='noopener noreferrer'>
                      <span className="text-nowrap">Versão demo</span>
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={animationVariants.imageEntrance}
            >
              <div className="mask-b-from-55% relative mt-8 px-4 sm:px-6 sm:mt-12 md:mt-20 md:px-8">
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-2 sm:p-4 shadow-lg shadow-zinc-950/15 ring-1">
                    {/* ⚡ Performance: Imagem WebP 1920x933 (LCP - priority apenas na primeira visível) -78% vs PNG */}
                    <Image
                      className="bg-background relative hidden rounded-2xl dark:block w-full h-auto"
                      src="/assets/kanbandark.webp"
                      alt="app screen"
                      width={1920}
                      height={933}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1280px) 80vw, 1152px"
                      quality={85}
                      priority
                    />
                  <Image
                    className="z-2 border-border/25 relative rounded-2xl border dark:hidden w-full h-auto"
                    src="/assets/kanbanlight.webp"
                    alt="app screen"
                    width={1920}
                    height={933}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1280px) 80vw, 1152px"
                    quality={85}
                    loading="eager"
                  />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
        {/* <section className="bg-background pb-16 pt-16 md:pb-32">
          <div className="group relative m-auto max-w-5xl px-6">
            <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
              <Link href="/" className="block text-sm duration-150 hover:opacity-75">
                <span> Meet Our Customers</span>

                <ChevronRight className="ml-1 inline-block size-3" />
              </Link>
            </div>
            <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
              <div className="flex">
                <Image
                  className="mx-auto h-5 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/nvidia.svg"
                  alt="Nvidia Logo"
                  height={20}
                  width={80}
                />
              </div>

              <div className="flex">
                <Image
                  className="mx-auto h-4 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/column.svg"
                  alt="Column Logo"
                  height={16}
                  width={80}
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-4 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/github.svg"
                  alt="GitHub Logo"
                  height={16}
                  width={80}
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-5 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/nike.svg"
                  alt="Nike Logo"
                  height={20}
                  width={80}
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-5 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                  alt="Lemon Squeezy Logo"
                  height={20}
                  width={80}
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-4 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/laravel.svg"
                  alt="Laravel Logo"
                  height={16}
                  width={80}
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-7 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/lilly.svg"
                  alt="Lilly Logo"
                  height={28}
                  width={80}
                />
              </div>

              <div className="flex">
                <Image
                  className="mx-auto h-6 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/openai.svg"
                  alt="OpenAI Logo"
                  height={24}
                  width={80}
                />
              </div>
            </div>
          </div>
        </section> */}
      </main>
    </>
  );
}
