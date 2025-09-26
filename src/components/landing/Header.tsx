'use client'
import Link from 'next/link'
import { Logo } from './logo'
import { Menu, X } from 'lucide-react'
import { Button } from '../ui/kibo-ui/landingpageui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import { animate } from 'framer-motion'
import { ThemeSwitcher } from '../theme/ThemeSwitcher'

const menuItems = [
  { name: 'Features', href: '#link' },
  { name: 'Soluções', href: '#link' },
  { name: 'Plano', href: '#link' },
  { name: 'Sobre', href: '#link' },
]

export const Header = () => {
  const [menuState, SetMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header>
      {/* 1) nav ocupa a largura inteira, sem padding que “puxa” pro lado */}
  <nav data-state={menuState && 'active'} className="fixed inset-x-0 z-50">
        {/* 2) container centralizado com paddings simétricos em todos breakpoints */}
        <div
          data-shrunk={isScrolled}
          className={cn(
            'mx-auto mt-2 max-w-6xl px-4 sm:px-6 lg:px-8 transition-all duration-300',
            isScrolled && 'max-w-4xl rounded-2xl border bg-background/50 backdrop-blur-lg'
          )}
          // safe-area iOS
          style={{
            paddingLeft: 'max(env(safe-area-inset-left), 1rem)',
            paddingRight: 'max(env(safe-area-inset-right), 1rem)',
          }}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">

            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="#hero"
                aria-label="home"
                className="flex items-center space-x-2 cursor-pointer"
                onClick={e => {
                  e.preventDefault();
                  const el = document.getElementById('hero');
                  if (el) {
                    animate(window.scrollY, el.offsetTop, {
                      duration: 1,
                      ease: [0.22, 1, 0.36, 1],
                      onUpdate: v => window.scrollTo({ top: v })
                    });
                  }
                }}
              >
                <Logo />
              </Link>

              <button
                onClick={() => SetMenuState((v) => !v)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="m-auto size-6 duration-200 in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0" />
                <X className="absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100" />
              </button>
            </div>

            {/* menu central (desktop), centralizado sem absolute para não cobrir o logo */}
            <div className="hidden lg:flex flex-1 items-center justify-center">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="block text-sm text-muted-foreground duration-150 hover:text-accent-foreground"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3) MOBILE PANEL: centralizado e com largura limitada */}
            <div
              className="
                bg-background
                in-data-[state=active]:block lg:in-data-[state=active]:flex
                mb-6 hidden w-full flex-wrap items-center
                justify-center lg:justify-end
                space-y-8 rounded-3xl border p-6
                shadow-2xl shadow-zinc-300/20
                lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0
                lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none
                dark:shadow-none dark:lg:bg-transparent
                mx-auto max-w-md
              "
            >
              <div className="mx-auto w-full max-w-md lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="block duration-150 text-muted-foreground hover:text-accent-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <div className="flex justify-center">
                  <ThemeSwitcher />
                </div>

                <Button asChild variant="outline" size="sm" className={cn(isScrolled && 'lg:hidden')}>
                  <Link href="#"><span>Login</span></Link>
                </Button>

                <Button asChild size="sm" className={cn(isScrolled && 'hidden')}>
                  <Link href="#"><span>Sign Up</span></Link>
                </Button>

                <Button asChild size="sm" className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                  <Link href="#"><span>Get Started</span></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
