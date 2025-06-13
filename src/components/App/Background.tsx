// src/components/App/Background.tsx
"use client";

import { useState, useEffect } from "react";

interface BackgroundProps {
    isDarkMode: boolean;
}

type Particle = {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    rotation: number;
    type: "note" | "treble" | "bass" | "vinyl" | "headphone";
};

export default function Background({ isDarkMode }: BackgroundProps) {
    const [animatedParticles, setAnimatedParticles] = useState<Particle[]>([]);
    const [scrollY, setScrollY] = useState(0);

    // Generate prominent, rotating music-themed particles
    useEffect(() => {
        const particles = Array.from({ length: 18 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 200,
            size: Math.random() * 20 + 15,
            duration: Math.random() * 30 + 25,
            delay: Math.random() * 15,
            rotation: Math.random() * 360,
            type: ["note", "treble", "bass", "vinyl", "headphone"][
                Math.floor(Math.random() * 5)
            ] as Particle["type"],
        }));
        setAnimatedParticles(particles);
    }, []);

    // Track scroll position for parallax effects
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Enhanced music-themed particle renderer with rotation
    const renderMusicParticle = (particle: Particle) => {
        const baseClasses = "absolute opacity-25 pointer-events-none";
        const primaryColor = "#28a745";
        const secondaryColor = "#8b5cf6";
        const slowParallax = scrollY * 0.02;

        switch (particle.type) {
            case "note":
                return (
                    <div
                        key={particle.id}
                        className={`${baseClasses} text-3xl animate-bounce`}
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            color: primaryColor,
                            animationDelay: `${particle.delay}s`,
                            animationDuration: `${particle.duration}s`,
                            transform: `translateY(${slowParallax}px) rotate(${particle.rotation + scrollY * 0.1
                                }deg)`,
                        }}
                    >
                        ♪
                    </div>
                );
            // ... (other cases: treble, bass, vinyl, headphone are identical to your original code)
            default:
                return null;
        }
    };

    return (
        <div
            className="fixed inset-0 overflow-hidden pointer-events-none z-0"
            style={{ height: "200vh" }}
        >
            <div
                className={`absolute inset-0 ${isDarkMode ? "opacity-2" : "opacity-2"
                    }`}
                style={{
                    backgroundImage: isDarkMode
                        ? `radial-gradient(circle at 25% 25%, #28a745 0.5px, transparent 0.5px),
               radial-gradient(circle at 75% 75%, #28a745 0.3px, transparent 0.3px)`
                        : `repeating-linear-gradient(45deg, #28a745 0px, #28a745 0.5px, transparent 0.5px, transparent 40px),
               repeating-linear-gradient(-45deg, #28a745 0px, #28a745 0.3px, transparent 0.3px, transparent 50px)`,
                    backgroundSize: isDarkMode
                        ? "60px 60px, 40px 40px"
                        : "80px 80px, 100px 100px",
                    animation: isDarkMode
                        ? "dark-grid 40s ease-in-out infinite"
                        : "light-grid 30s ease-in-out infinite",
                }}
            />
            {animatedParticles.map(renderMusicParticle)}
            <div
                className="absolute w-96 h-96 rounded-full opacity-2 animate-pulse"
                style={{
                    top: "15%",
                    left: "8%",
                    backgroundColor: "#28a745",
                    animationDuration: "12s",
                    transform: `translateY(${scrollY * 0.01}px)`,
                }}
            />
            <div
                className="absolute w-64 h-64 rounded-full opacity-2 animate-pulse"
                style={{
                    top: "70%",
                    right: "12%",
                    backgroundColor: "#28a745",
                    animationDuration: "15s",
                    animationDelay: "3s",
                    transform: `translateY(${scrollY * 0.015}px)`,
                }}
            />
        </div>
    );
}