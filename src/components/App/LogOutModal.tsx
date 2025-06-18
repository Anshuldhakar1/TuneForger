// src/components/App/SignOutModal.tsx
"use client";

import { X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignOutModalProps {
    show: boolean;
    isDarkMode: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function LogOutModal({
    show,
    isDarkMode,
    onClose,
    onConfirm,
}: SignOutModalProps) {
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
                        <LogOut className="w-8 h-8 text-red-600" />
                    </div>
                    <h3
                        className={`text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                    >
                        Sign out of your account?
                    </h3>
                    <p
                        className={`text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                    >
                        You will need to sign in again to access your playlists and features.
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
                        Sign out
                    </Button>
                </div>
            </div>
        </div>
    );
}