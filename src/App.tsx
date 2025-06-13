// src/app/page.tsx
"use client";

import { useState } from "react";
import Header from "@/components/App/Header";
import Background from "@/components/App/Background";
import Hero from "@/components/App/Hero";
import GeneratorForm from "@/components/App/GeneratorForm";
import Presets from "@/components/App/Presets";
import SocialBtn from "@/components/App/SocialBtn";
import DisconnectModal from "@/components/App/DisconnectModal";
import LoadingOverlay from "@/components/App/LoadingOverlay";

export default function HomePage() {
  // State for UI modes and connectivity
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(true);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  // State for child component interactions
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSpotifyHovered, setIsSpotifyHovered] = useState(false);
  const [isSocialButtonHovered, setIsSocialButtonHovered] = useState(false);

  // State for the generation process (lifted state)
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [playlistName, setPlaylistName] = useState("");

  // --- Handlers ---

  const handleGeneratePlaylist = () => {
    if (!prompt.trim()) return;
    console.log("Generating playlist with:", { prompt, playlistName });
    setIsGenerating(true);
    // Use void to explicitly ignore the Promise
    void (async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsGenerating(false);
    })();
  };

  const confirmDisconnect = () => {
    setIsSpotifyConnected(false);
    setShowDisconnectConfirm(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "TuneForge",
          text: "Create amazing AI-powered playlists!",
          url: window.location.href,
        })
        .catch(() => {
          navigator.clipboard.writeText(window.location.href).catch(() => { });
        });
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => { });
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
    >
      <Background isDarkMode={isDarkMode} />

      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isSpotifyConnected={isSpotifyConnected}
        setIsSpotifyConnected={setIsSpotifyConnected}
        isSpotifyHovered={isSpotifyHovered}
        setIsSpotifyHovered={setIsSpotifyHovered}
        handleDisconnectSpotify={() => setShowDisconnectConfirm(true)}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Hero isDarkMode={isDarkMode} />

        <GeneratorForm
          isDarkMode={isDarkMode}
          isGenerating={isGenerating}
          prompt={prompt}
          setPrompt={setPrompt}
          playlistName={playlistName}
          setPlaylistName={setPlaylistName}
          onSubmit={handleGeneratePlaylist}
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

      {/* Custom CSS for animations can remain here or be moved to a global CSS file */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dark-grid { 0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.02; } 50% { transform: scale(1.05) rotate(2deg); opacity: 0.03; } }
        @keyframes light-grid { 0%, 100% { transform: translateX(0px) translateY(0px); opacity: 0.02; } 25% { transform: translateX(5px) translateY(-2px); opacity: 0.025; } 50% { transform: translateX(0px) translateY(-4px); opacity: 0.03; } 75% { transform: translateX(-5px) translateY(-2px); opacity: 0.025; } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; opacity: 0; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  );
}