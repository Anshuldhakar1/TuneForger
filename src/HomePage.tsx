"use client"

import Hero from "@/components/App/Hero";
import GeneratorForm from "@/components/App/GeneratorForm";
import Presets from "@/components/App/Presets";
import SocialBtn from "@/components/App/SocialBtn";
import DisconnectModal from "@/components/App/DisconnectModal";
import LoadingOverlay from "@/components/App/LoadingOverlay";

import { useState } from "react";

interface HomePageProps {
    isDarkMode: boolean;
    setShowDisconnectConfirm: (value: boolean) => void;
    setCurrentPage: (page: "home" | "playlists") => void;   
    isSocialButtonHovered: boolean;
    setIsSocialButtonHovered: (value: boolean) => void;
    handleShare: () => void;                                                        
    showDisconnectConfirm: boolean;
    confirmDisconnect: () => void;
}

const HomePage = (
    { 
        isDarkMode,
        setShowDisconnectConfirm,
        setCurrentPage,
        isSocialButtonHovered,
        setIsSocialButtonHovered,
        handleShare,
        showDisconnectConfirm,
        confirmDisconnect,
    }: HomePageProps
) => {

    const [isGenerating, setIsGenerating] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [playlistName, setPlaylistName] = useState("");

    return (
        <div>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <Hero isDarkMode={isDarkMode} />

                <GeneratorForm
                    isDarkMode={isDarkMode}
                    isGenerating={isGenerating}
                    prompt={prompt}
                    setPrompt={setPrompt}
                    setIsGenerating={setIsGenerating}
                    playlistName={playlistName}
                    setPlaylistName={setPlaylistName}
                    setCurrentPage={setCurrentPage}
                />

                <Presets
                    isDarkMode={isDarkMode}
                    isGenerating={isGenerating}
                    setPrompt={setPrompt}
                />
            </main>

            <SocialBtn
                isDarkMode={isDarkMode}
                isSocialButtonHovered={isSocialButtonHovered}
                setIsSocialButtonHovered={setIsSocialButtonHovered}
                handleShare={handleShare}
            />

            <DisconnectModal
                show={showDisconnectConfirm}
                isDarkMode={isDarkMode}
                onClose={() => setShowDisconnectConfirm(false)}
                onConfirm={confirmDisconnect}
            />

            <LoadingOverlay isGenerating={isGenerating} isDarkMode={isDarkMode} />
        </div>
    );

};

export default HomePage;