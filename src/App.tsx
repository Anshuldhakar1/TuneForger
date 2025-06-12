import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { PlaylistGenerator } from "./PlaylistGenerator";
import { PlaylistList } from "./PlaylistList";
import { useState } from "react";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-primary">🎵 AI Playlist Generator</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 p-8">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [currentView, setCurrentView] = useState<"generator" | "playlists">("generator");

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Unauthenticated>
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-primary mb-4">🎵 AI Playlist Generator</h1>
          <p className="text-xl text-secondary mb-8">Create personalized Spotify playlists with AI</p>
          <SignInForm />
        </div>
      </Unauthenticated>

      <Authenticated>
        {/* <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Welcome back, {loggedInUser?.email?.split('@')[0]}!</h1> 
          <p className="text-lg text-secondary">Generate amazing playlists with AI</p>
        </div> */}

        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-2 shadow-sm border">
            <button
              onClick={() => setCurrentView("generator")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                currentView === "generator"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Generate Playlist
            </button>
            <button
              onClick={() => setCurrentView("playlists")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                currentView === "playlists"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              My Playlists
            </button>
          </div>
        </div>

        {currentView === "generator" ? (
          <PlaylistGenerator onPlaylistCreated={() => setCurrentView("playlists")} />
        ) : (
          <PlaylistList />
        )}
      </Authenticated>
    </div>
  );
}
