'use client'
import { ChartLine, SquareKanban, AlarmClockCheck, NotebookTabs } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import { AnimatedElement, ScrollTiltImage, useScrollTilt } from '../ui/kibo-ui/landingpageui/animations'

export default function FeaturesSection() {
    const ref = React.useRef<HTMLDivElement | null>(null)

    // Hook personalizado para scroll tilt
    const { rotateY, rotateX, scale } = useScrollTilt(ref as React.RefObject<HTMLDivElement>)

    return (
        <section id="features" className="overflow-hidden py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
                <div className="relative z-10 max-w-2xl">
                    <AnimatedElement
                        variant="featuresText"
                        delay={0.2}
                        className="text-4xl font-semibold lg:text-5xl"
                    >
                        <h2>Produtividade, Organização e Simplicidade</h2>
                    </AnimatedElement>
                    <AnimatedElement
                        variant="featuresText"
                        delay={0.4}
                        className="mt-6 text-lg"
                    >
                        <p>Organize seu trabalho, estudos, finanças e rotina <br />De forma <span className='text-primary font-extrabold '>SIMPLES</span> e <span className='text-primary font-extrabold '>EFICAZ.</span></p>
                    </AnimatedElement>
                </div>
                <ScrollTiltImage
                    variant="features"
                    className="relative -mx-4 pr-3 pt-3 md:-mx-12"
                >
                    <div className="perspective-midrange">
                        <div className="rotate-x-6 -skew-2">
                            <motion.div
                                ref={ref}
                                className="aspect-88/36 relative will-change-transform"
                                style={{
                                    rotateY,
                                    rotateX,
                                    scale,
                                    transformStyle: 'preserve-3d'
                                }}
                            >
                                <Image
                                    src="/assets/notesdark.png"
                                    className="hidden dark:block"
                                    alt="payments illustration dark"
                                    width={2797}
                                    height={1137}
                                />
                                <Image
                                    src="/assets/noteslight.png"
                                    className="dark:hidden"
                                    alt="payments illustration light"
                                    width={2797}
                                    height={1137}
                                />
                            </motion.div>
                        </div>
                    </div>
                </ScrollTiltImage>
                <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4 pt-20">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <ChartLine className="size-4" />
                            <h3 className="text-sm font-medium">Analytics</h3>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-[30ch] leading-6">
                            <span className="block">Visualize relatórios, gráficos e</span>
                            <span className="block">acompanhe a trajetória do seu</span>
                            <span className="block">desempenho</span>
                        </p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <SquareKanban className="size-4" />
                            <h3 className="text-sm font-medium">Kanban</h3>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-[28ch] leading-6">
                            <span className="block">Organize tarefas e projetos</span>
                            <span className="block">com quadro visual e controle</span>
                            <span className="block">intuitivo</span>
                        </p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <AlarmClockCheck className="size-4" />
                            <h3 className="text-sm font-medium">Timer Pomodoro</h3>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-[28ch] leading-6">
                            <span className="block">Aumente sua produtividade com</span>
                            <span className="block">Pomodoro e sessões de estudo</span>
                            <span className="block">focadas</span>
                        </p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <NotebookTabs className="size-4" />

                            <h3 className="text-sm font-medium">Notas</h3>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-[28ch] leading-6">
                            <span className="block">Crie, organize e compartilhe</span>
                            <span className="block">notas de maneira simples e</span>
                            <span className="block">eficiente</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
