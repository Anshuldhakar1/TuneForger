// src/components/App/DisconnectModal.tsx
"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DisconnectModalProps {
    show: boolean;
    isDarkMode: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DisconnectModal({
    show,
    isDarkMode,
    onClose,
    onConfirm,
}: DisconnectModalProps) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            <div
                className={`backdrop-blur-md rounded-2xl p-8 max-w-md mx-4 text-center border shadow-2xl transition-all duration-300 ${isDarkMode
                        ? "bg-gray-800/95 border-gray-700"
                        : "bg-white/95 border-gray-200"
                    }`}
            >
                <div className="flex justify-end mb-4">
                    <button
                        onClick={onClose}
                        className={`p-1 rounded-lg transition-colors ${isDarkMode
                                ? "hover:bg-gray-700 text-gray-400"
                                : "hover:bg-gray-100 text-gray-500"
                            }`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-red-600"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                        </svg>
                    </div>
                    <h3
                        className={`text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                    >
                        Disconnect from Spotify?
                    </h3>
                    <p
                        className={`text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                    >
                        You'll need to reconnect to create and save playlists.
                    </p>
                </div>
                <div className="flex space-x-4">
                    <Button
                        onClick={onClose}
                        className={`flex-1 h-12 bg-transparent border ${isDarkMode
                                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white border-0"
                    >
                        Disconnect
                    </Button>
                </div>
            </div>
        </div>
    );
}