"use client";
import React, { useRef } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import Lenis from '@studio-freight/lenis'
import { ZoomParallax } from "@/components/zoom-parallax";
import { LogoIcon } from '@/components/landing/logo';
import { BookOpenText, Dumbbell, House, Briefcase, CalendarFold, HandCoins } from 'lucide-react';
import { TextEffect } from '../ui/text-effect';

export default function DefaultDemo() {

	React.useEffect( () => {
        const lenis = new Lenis()

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
    },[])


	// use LogoIcon as the central / first slot; keep a stable order for icons to avoid
	// hydration mismatch between server and client (don't use Math.random here)
	const images = React.useMemo(() => {
		const lucideIcons = [BookOpenText, Dumbbell, House, Briefcase, CalendarFold, HandCoins];
		return [
			{ Icon: LogoIcon, alt: 'Planly logo', label: 'Planly' },
			...lucideIcons.map((Icon, i) => ({ Icon, alt: Icon.name, label: ['Trabalho','GYM','Pessoal','Datas','Finanças','Estudos'][i] })),
		];
	}, []);

	// Title intersection observer: render animation only when section is in view
	const titleRef = useRef(null);
	const titleInView = useInView(titleRef, { once: true, amount: 0.45 });

	return (
		<main className="min-h-screen w-full">
			<div className="relative flex h-[50vh] items-center justify-center">
				{/* Radial spotlight */}
				<div
					aria-hidden="true"
					className={cn(
						// keep the spotlight visible above the page background but behind the content
						'pointer-events-none absolute top-0 md:-top-1/2 left-1/2 -translate-x-1/2 rounded-full z-0',
						'h-[100vmin] md:h-[120vmin] w-[100vmin] md:w-[120vmin]',
						// stronger purple radial for light theme to match the Hero
						'bg-[radial-gradient(ellipse_at_center,rgba(67,25,97,0.16)_0%,rgba(160,120,220,0.10)_38%,rgba(67,25,97,0)_78%)]',
						'blur-[30px]',
					)}
				/>
				{/* Title: only animate when section is in view */}

				<div ref={titleRef} className='relative z-10 flex flex-col items-center justify-center gap-9 pt-16 text-center text-4xl font-bold'>
					{titleInView ? (
						<TextEffect
							preset="fade-in-blur"
							speedSegment={0.3}
							as="h1"
							className='mx-auto mt-8 max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]'
						>
							Sua Organização em um só Lugar
						</TextEffect>
					) : (
						// keep same space before the animation triggers
						<h1 className="text-center text-4xl font-bold opacity-0">Sua Organização em um só Lugar</h1>
					)}
				</div>
			</div>
			<ZoomParallax images={images} />


		</main>
	);
}
