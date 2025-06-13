"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

interface LoadingOverlayProps {
    isGenerating: boolean;
    isDarkMode: boolean;
}

export default function LoadingOverlay({
    isGenerating,
    isDarkMode,
}: LoadingOverlayProps) {
    const [showOverlay, setShowOverlay] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const prevIsGenerating = useRef(isGenerating);

    useEffect(() => {
        if (isGenerating) {
            setShowOverlay(true);
            setIsSuccess(false);
        }
        else if (!isGenerating && prevIsGenerating.current) {
            setIsSuccess(true); 

            const timer = setTimeout(() => {
                setShowOverlay(false);
            }, 2500);

            return () => clearTimeout(timer);
        }

        prevIsGenerating.current = isGenerating;
    }, [isGenerating]);

    if (!showOverlay) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            <div
                className={`backdrop-blur-md rounded-2xl p-8 max-w-sm mx-4 text-center border shadow-2xl transition-all duration-300 ${isDarkMode
                        ? "bg-gray-800/95 border-gray-700"
                        : "bg-white/95 border-gray-200"
                    }`}
            >
                {isSuccess ? (
                    // --- Success State ---
                    <div>
                        <div className="relative mb-6">
                            <div className="w-16 h-16 bg-[#28a745] rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h3
                            className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                        >
                            Playlist Created!
                        </h3>
                        <p
                            className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                        >
                            Your new soundtrack is ready.
                        </p>
                    </div>
                ) : (
                    // --- Loading State ---
                    <div>
                        <div className="relative mb-6">
                            <div className="w-16 h-16 bg-[#28a745] rounded-full flex items-center justify-center mx-auto">
                                <Loader2 className="w-8 h-8 animate-spin text-white" />
                            </div>
                            <div className="absolute inset-0 w-16 h-16 bg-[#28a745] rounded-full mx-auto animate-ping opacity-20"></div>
                        </div>
                        <h3
                            className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                        >
                            Creating Your Playlist
                        </h3>
                        <p
                            className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                        >
                                AI is analyzing your preferences and selecting the perfect tracks...
                        </p>
                        <div className="flex justify-center items-end space-x-1">
                            {Array.from({ length: 8 }, (_, i) => (
                                <div
                                    key={i}
                                    className="bg-[#28a745] rounded-full animate-pulse"
                                    style={{
                                        width: "3px",
                                        height: `${Math.random() * 20 + 5}px`,
                                        animationDelay: `${i * 0.1}s`,
                                        animationDuration: "1.5s",
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}