// src/app/page.tsx
"use client";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useEffect, useCallback } from "react";
import Background from "@/components/App/Background";
import HomePage from "./HomePage";
import Header from "@/components/App/Header";
import Playlists from "./Playlists";
import DisconnectModal from "@/components/App/DisconnectModal";
import Playlist from "./Playlist";
import Login from "./Login";
import LogOutModal from "./components/App/LogOutModal";
export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

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

  const { signOut } = useAuthActions();

  const [logOutModalOpen, setLogOutModalOpen] = useState(false);

  // --- Handlers ---

  // Navigation helper
  const navigateTo = useCallback((page: "home" | "playlists" | "gen_playlist", playlistId = "") => {
    setCurrentPage(page);
    setCurrentViewPlaylistId(playlistId);

    let url = "/";
    if (page === "playlists") url = "/playlists";
    if (page === "gen_playlist" && playlistId) url = `/playlist/${playlistId}`;

    window.history.pushState(
      { page, playlistId },
      "",
      url
    );
  }, []);

  // Listen for browser navigation
  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state && state.page) {
        setCurrentPage(state.page);
        setCurrentViewPlaylistId(state.playlistId || "");
      } else {
        setCurrentPage("home");
        setCurrentViewPlaylistId("");
      }
    };

    window.addEventListener("popstate", onPopState);

    // On mount, push the initial state if not present
    if (!window.history.state) {
      window.history.replaceState(
        { page: currentPage, playlistId: currentViewPlaylistId },
        "",
        window.location.pathname
      );
    }

    return () => window.removeEventListener("popstate", onPopState);
  }, []);

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

  // --- AUTH GATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login isDarkMode={isDarkMode} />;
  }

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
          setLogOutModalOpen={setLogOutModalOpen}
          navigateTo={navigateTo}
      />

      { currentPage === "home" && 
        <HomePage
          isDarkMode={isDarkMode}
          navigateTo={navigateTo}
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
          navigateTo={navigateTo}
          setCurrentViewPlaylistId={setCurrentViewPlaylistId}
        />
      }

      { 
        currentPage === "gen_playlist" && currentViewPlaylistId !== "" &&
        <Playlist 
          isDarkMode={isDarkMode}
          navigateTo={navigateTo}
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

      <LogOutModal
        show={logOutModalOpen} // This can be controlled by a state if needed
        isDarkMode={isDarkMode}
        onClose={() => { setLogOutModalOpen(false); }} // Implement close logic
        onConfirm={() => {
          setLogOutModalOpen(false);
          void signOut();
          navigateTo("home");
        }} // Implement logout logic
      />
    </div>
  );
}