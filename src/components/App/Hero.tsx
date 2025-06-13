// src/components/App/Hero.tsx
"use client";

import { Zap } from "lucide-react";

interface HeroProps {
    isDarkMode: boolean;
}

export default function Hero({ isDarkMode }: HeroProps) {
    return (
        <div className="text-center mb-8 relative animate-fade-in">
            <div
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border mb-4 transition-all duration-300 ${isDarkMode
                        ? "bg-gray-800/50 border-gray-700"
                        : "bg-gray-100/50 border-gray-200"
                    }`}
            >
                <Zap className="w-4 h-4 text-[#28a745]" />
                <span className="text-sm font-medium text-[#28a745]">
                    AI-Powered Music Curation
                </span>
            </div>

            <h2
                className={`text-4xl font-bold mb-3 leading-tight animate-slide-up ${isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                style={{ animationDelay: "0.2s" }}
            >
                Create Your Perfect
                <span className="block text-[#28a745]">AI Playlist</span>
            </h2>
            <p
                className={`text-lg max-w-xl mx-auto leading-relaxed animate-slide-up ${isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                style={{ animationDelay: "0.4s" }}
            >
                Describe the mood, genre, or occasion, and let our AI curate the
                perfect soundtrack.
            </p>

            <div
                className="flex justify-center items-end space-x-1 mt-6 mb-6 animate-fade-in"
                style={{ animationDelay: "0.6s" }}
            >
                {Array.from({ length: 16 }, (_, i) => (
                    <div
                        key={i}
                        className="bg-[#28a745] rounded-full animate-pulse"
                        style={{
                            width: "3px",
                            height: `${Math.random() * 30 + 8}px`,
                            animationDelay: `${i * 0.08}s`,
                            animationDuration: `${1.2 * 2}s`,
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
}