"use client";

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

interface ImageItem {
	src?: string;
		alt?: string;
		label?: string;
 	/** optional Icon component to render instead of an image */
 	Icon?: React.ElementType;
}

interface ZoomParallaxProps {
	/** Array of images/icons to be displayed in the parallax effect (max 7) */
	images: ImageItem[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
	const container = useRef(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	// spotlight that will appear behind the logo near the end of the zoom
	const spotlightOpacity = useTransform(scrollYProgress, [0.85, 0.95, 1], [0, 0.6, 1]);
	const spotlightScale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

	return (
		<div ref={container} className="relative h-[300vh]">
			<div className="sticky top-0 h-screen overflow-hidden">

				{/* Spotlight that sits behind the icons when zoom finishes */}
				<motion.div
					style={{ opacity: spotlightOpacity, scale: spotlightScale }}
					className="absolute inset-0 flex items-center justify-center pointer-events-none"
				>
					<div className="rounded-full w-[90vmin] md:w-[120vmin] h-[90vmin] md:h-[120vmin] bg-[radial-gradient(ellipse_at_center,rgba(67,25,97,0.16)_0%,rgba(160,120,220,0.10)_38%,rgba(67,25,97,0)_78%)] blur-3xl" aria-hidden />
				</motion.div>

				{images.map(({ src, alt, Icon }, index) => {
					const scale = scales[index % scales.length];

					return (
						<motion.div
							key={index}
							style={{ scale }}
							className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1 ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]' : ''} ${index === 2 ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]' : ''} ${index === 3 ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]' : ''} ${index === 4 ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]' : ''} ${index === 5 ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]' : ''} ${index === 6 ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]' : ''} `}
						>
							<div className={`relative z-10 flex items-center justify-center text-black dark:text-white ${index === 0 ? 'h-[8vh] w-[8vw]' : 'h-[25vh] w-[25vw]'}`}>
								{Icon ? (
										<Icon className="h-full w-full object-contain text-black dark:text-white" />
									) : (
									<Image
										src={src || '/placeholder.svg'}
										alt={alt || `Parallax image ${index + 1}`}
										fill
										className="object-cover"
										priority={false}
									/>
								)}
							</div>
							</motion.div>
					);
				})}
			</div>
		</div>
	);
}
