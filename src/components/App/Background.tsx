"use client"

import { useEffect, useState } from "react"

interface MusicBackgroundAnimationProps {
    isDarkMode: boolean
    intensity?: "low" | "medium" | "high"
}

export default function MusicBackgroundAnimation({
    isDarkMode = false,
    intensity = "medium",
}: MusicBackgroundAnimationProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const getIntensitySettings = () => {
        switch (intensity) {
            case "low":
                return {
                    noteCount: 8,
                    waveBarCount: 30,
                    circleCount: 4,
                    noteOpacity: "opacity-10",
                    waveOpacity: "opacity-10",
                    circleOpacity: "opacity-5",
                }
            case "high":
                return {
                    noteCount: 20,
                    waveBarCount: 80,
                    circleCount: 10,
                    noteOpacity: "opacity-30",
                    waveOpacity: "opacity-20",
                    circleOpacity: "opacity-15",
                }
            default: // medium
                return {
                    noteCount: 15,
                    waveBarCount: 60,
                    circleCount: 8,
                    noteOpacity: "opacity-20",
                    waveOpacity: "opacity-15",
                    circleOpacity: "opacity-10",
                }
        }
    }

    const settings = getIntensitySettings()
    const primaryColor = isDarkMode ? "#31c266" : "#31c266"
    const secondaryColor = isDarkMode ? "#22c55e" : "#16a34a"

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Floating Music Notes */}
            <div className="absolute inset-0">
                {[...Array(settings.noteCount)].map((_, i) => (
                    <div
                        key={`note-${i}`}
                        className={`absolute animate-float-music ${settings.noteOpacity}`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 15}s`,
                            animationDuration: `${6 + Math.random() * 8}s`,
                            color: Math.random() > 0.5 ? primaryColor : secondaryColor,
                        }}
                    >
                        {/* Musical Note SVG */}
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                    </div>
                ))}

                {/* Additional Musical Symbols */}
                {[...Array(Math.floor(settings.noteCount / 2))].map((_, i) => (
                    <div
                        key={`symbol-${i}`}
                        className={`absolute animate-float-music ${settings.noteOpacity}`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 20}s`,
                            animationDuration: `${8 + Math.random() * 6}s`,
                            color: primaryColor,
                        }}
                    >
                        {/* Treble Clef */}
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14.5 2c-1.5 0-3 .5-4 1.5-1 1-1.5 2.5-1.5 4 0 1.5.5 3 1.5 4s2.5 1.5 4 1.5 3-.5 4-1.5 1.5-2.5 1.5-4-.5-3-1.5-4-2.5-1.5-4-1.5zm0 2c.8 0 1.5.3 2 .8s.8 1.2.8 2-.3 1.5-.8 2-1.2.8-2 .8-1.5-.3-2-.8-.8-1.2-.8-2 .3-1.5.8-2 1.2-.8 2-.8zm-3 8v6c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.4 0 .7.1 1 .3V12h1z" />
                        </svg>
                    </div>
                ))}
            </div>

            {/* Sound Wave Visualization - Bottom */}
            <div className={`absolute bottom-0 left-0 right-0 h-40 ${settings.waveOpacity}`}>
                <div className="flex items-end justify-center h-full space-x-1">
                    {[...Array(settings.waveBarCount)].map((_, i) => (
                        <div
                            key={`wave-${i}`}
                            className="animate-sound-wave"
                            style={{
                                width: "3px",
                                height: `${15 + Math.random() * 70}%`,
                                background: `linear-gradient(to top, ${primaryColor}, ${secondaryColor})`,
                                animationDelay: `${i * 0.05}s`,
                                animationDuration: `${0.8 + Math.random() * 1.5}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Sound Wave Visualization - Top */}
            <div className={`absolute top-0 left-0 right-0 h-32 ${settings.waveOpacity} rotate-180`}>
                <div className="flex items-end justify-center h-full space-x-1">
                    {[...Array(Math.floor(settings.waveBarCount * 0.6))].map((_, i) => (
                        <div
                            key={`wave-top-${i}`}
                            className="animate-sound-wave"
                            style={{
                                width: "2px",
                                height: `${10 + Math.random() * 50}%`,
                                background: `linear-gradient(to top, ${primaryColor}40, ${secondaryColor}40)`,
                                animationDelay: `${i * 0.08}s`,
                                animationDuration: `${1 + Math.random() * 2}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Pulsing Circles */}
            <div className="absolute inset-0">
                {[...Array(settings.circleCount)].map((_, i) => (
                    <div
                        key={`circle-${i}`}
                        className={`absolute rounded-full border-2 animate-pulse-ring ${settings.circleOpacity}`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${80 + Math.random() * 300}px`,
                            height: `${80 + Math.random() * 300}px`,
                            borderColor: Math.random() > 0.5 ? `${primaryColor}40` : `${secondaryColor}40`,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${3 + Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

            {/* Floating Vinyl Records */}
            <div className="absolute inset-0">
                {[...Array(Math.floor(settings.noteCount / 3))].map((_, i) => (
                    <div
                        key={`vinyl-${i}`}
                        className={`absolute animate-vinyl-spin ${settings.noteOpacity}`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 10}s`,
                            animationDuration: `${15 + Math.random() * 10}s`,
                            color: primaryColor,
                        }}
                    >
                        {/* Vinyl Record SVG */}
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" opacity="0.6">
                            <circle cx="12" cy="12" r="10" fill="currentColor" />
                            <circle cx="12" cy="12" r="6" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
                            <circle cx="12" cy="12" r="3" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
                            <circle cx="12" cy="12" r="1" fill="white" opacity="0.8" />
                        </svg>
                    </div>
                ))}
            </div>

            {/* Grid Pattern */}
            <div
                className={`absolute inset-0 bg-grid-pattern ${settings.circleOpacity} animate-grid-move`}
                style={{
                    backgroundImage: `linear-gradient(${primaryColor}20 1px, transparent 1px), linear-gradient(90deg, ${primaryColor}20 1px, transparent 1px)`,
                    backgroundSize: "50px 50px",
                }}
            />

            {/* Radial Gradient Overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 50% 50%, transparent 0%, ${isDarkMode ? "rgba(17, 24, 39, 0.3)" : "rgba(255, 255, 255, 0.3)"} 100%)`,
                }}
            />
        </div>
    )
}
