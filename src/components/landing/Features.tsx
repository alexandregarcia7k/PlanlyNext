'use client'
import { ChartLine, SquareKanban, AlarmClockCheck, NotebookTabs } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import { AnimatedElement, ScrollTiltImage, useScrollTilt } from '../ui/animations'

export default function FeaturesSection() {
    const ref = React.useRef<HTMLDivElement | null>(null)

    // Hook personalizado para scroll tilt
    const { rotateY, rotateX, scale } = useScrollTilt(ref as React.RefObject<HTMLDivElement>)

    return (
        <section className="overflow-hidden py-16 md:py-32">
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
                <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <ChartLine className="size-4" />
                            <h3 className="text-sm font-medium">Analytics</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Tenha controle sobre sua produtividade, visualize relatórios e gráficos de desempenho.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <SquareKanban className="size-4" />
                            <h3 className="text-sm font-medium">Kanban</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Organize suas tarefas e projetos de forma visual e intuitiva.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <AlarmClockCheck className="size-4" />
                            <h3 className="text-sm font-medium">Timer Pomodoro</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Aumente sua produtividade com o método Pomodoro.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <NotebookTabs className="size-4" />

                            <h3 className="text-sm font-medium">Notas</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Crie, organize e compartilhe suas notas de forma simples e eficiente.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
