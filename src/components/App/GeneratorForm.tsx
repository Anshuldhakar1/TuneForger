// src/components/App/GeneratorForm.tsx
"use client";

import { Loader2, Play, Headphones, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface GeneratorFormProps {
    isDarkMode: boolean;
    isGenerating: boolean;
    prompt: string;
    playlistName: string;
    setPrompt: (value: string) => void;
    setPlaylistName: (value: string) => void;
    onSubmit: () => void;
}

export default function GeneratorForm({
    isDarkMode,
    isGenerating,
    prompt,
    playlistName,
    setPrompt,
    setPlaylistName,
    onSubmit,
}: GeneratorFormProps) {
    return (
        <Card
            className={`mb-8 shadow-2xl backdrop-blur-sm transition-all duration-300 animate-slide-up border-2 ${isDarkMode
                    ? "bg-gray-800/95 border-gray-700 hover:border-gray-600"
                    : "bg-white/95 border-gray-200 hover:border-gray-300"
                }`}
            style={{ animationDelay: "0.8s" }}
        >
            <CardContent className="p-10">
                <div className="space-y-8">
                    <div>
                        <label
                            htmlFor="prompt"
                            className={`block text-base font-bold mb-4 flex items-center space-x-3 ${isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                        >
                            <div className="p-2 bg-[#28a745] rounded-lg">
                                <Headphones className="w-5 h-5 text-white" />
                            </div>
                            <span>Describe your perfect playlist</span>
                        </label>
                        <Textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., High-energy workout anthems with heavy bass drops..."
                            className={`min-h-[140px] resize-none transition-all duration-200 text-base leading-relaxed ${isDarkMode
                                    ? "border-gray-600 focus:border-[#28a745] bg-gray-800/70 text-white focus:ring-[#28a745]/30 placeholder:text-gray-400"
                                    : "border-gray-300 focus:border-[#28a745] bg-white/70 focus:ring-[#28a745]/30 placeholder:text-gray-500"
                                }`}
                            disabled={isGenerating}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="playlistName"
                            className={`block text-base font-bold mb-4 flex items-center space-x-3 ${isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                        >
                            <div className="p-2 bg-[#28a745] rounded-lg">
                                <Play className="w-5 h-5 text-white" />
                            </div>
                            <span>Playlist name (optional)</span>
                        </label>
                        <Input
                            id="playlistName"
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                            placeholder="Leave empty for AI-generated name"
                            className={`transition-all duration-200 text-base h-12 ${isDarkMode
                                    ? "border-gray-600 focus:border-[#28a745] bg-gray-800/70 text-white focus:ring-[#28a745]/30 placeholder:text-gray-400"
                                    : "border-gray-300 focus:border-[#28a745] bg-white/70 focus:ring-[#28a745]/30 placeholder:text-gray-500"
                                }`}
                            disabled={isGenerating}
                        />
                    </div>
                    <Button
                        onClick={onSubmit}
                        disabled={!prompt.trim() || isGenerating}
                        className="w-full h-16 text-xl font-bold bg-[#28a745] hover:bg-[#218838] text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border-0 rounded-xl"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                Generating Your Perfect Playlist...
                            </>
                        ) : (
                            <>
                                <Zap className="w-6 h-6 mr-3" />
                                Generate Playlist with AI
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}