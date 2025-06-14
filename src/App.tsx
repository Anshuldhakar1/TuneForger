// src/app/page.tsx
"use client";

import { useState } from "react";
import Background from "@/components/App/Background";
import HomePage from "./HomePage";
import Header from "@/components/App/Header";
import Playlists from "./Playlists";
import DisconnectModal from "@/components/App/DisconnectModal";
import Playlist from "./Playlist";

export default function App() {

  const [currentPage, setCurrentPage] = useState<"home" | "playlists" | "gen_playlist">("home");
  const [currentViewPlaylistId, setCurrentViewPlaylistId] = useState<string>("");

  // State for UI modes and connectivity
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(true);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  // State for child component interactions
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSpotifyHovered, setIsSpotifyHovered] = useState(false);
  const [isSocialButtonHovered, setIsSocialButtonHovered] = useState(false);

  // --- Handlers ---

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
          setCurrentPage={setCurrentPage}
      />

      { currentPage === "home" && 
        <HomePage
          isDarkMode={isDarkMode}
          setCurrentPage={setCurrentPage}
          isSocialButtonHovered={isSocialButtonHovered}
          setIsSocialButtonHovered={setIsSocialButtonHovered}
          handleShare={handleShare}
          showDisconnectConfirm={showDisconnectConfirm}
          setShowDisconnectConfirm={setShowDisconnectConfirm}
          confirmDisconnect={confirmDisconnect}
        />
      }

      { currentPage === "playlists" && 
        <Playlists
          isDarkMode={isDarkMode}
          setCurrentPage={setCurrentPage}
          setCurrentViewPlaylistId={setCurrentViewPlaylistId}
        />
      }

      { 
        currentPage === "gen_playlist" && currentViewPlaylistId !== "" &&
        <Playlist 
          isDarkMode={isDarkMode}
          setCurrentPage={setCurrentPage}
          currentViewPlaylistId={currentViewPlaylistId}
        />

      }
      
      {/* Add any additional components or modals here */}
      
      <DisconnectModal
          show={showDisconnectConfirm}
          isDarkMode={isDarkMode}
          onClose={() => setShowDisconnectConfirm(false)}
          onConfirm={confirmDisconnect}
      />
    </div>
  );
}