import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import { SpotifyConnection } from "./SpotifyConnection";

interface PlaylistGeneratorProps {
  onPlaylistCreated: () => void;
}

export function PlaylistGenerator({ onPlaylistCreated }: PlaylistGeneratorProps) {
  const [query, setQuery] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [createOnSpotify, setCreateOnSpotify] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const generatePlaylist = useAction(api.playlists.generatePlaylist);
  const spotifyTokens = useQuery(api.spotify.getSpotifyTokens);

  const handleSubmit = async (e: React.FormEvent) => {

    console.log("handleSubmit invoked");

    e.preventDefault();
    if (!query.trim()) return;

    console.log("Submitting playlist generation with query:", query, "and name:", playlistName);
    console.log("Create on Spotify:", createOnSpotify, "Spotify tokens available:", !!spotifyTokens);

    if (createOnSpotify && !spotifyTokens) {
      toast.error("Please connect your Spotify account first to create playlists on Spotify");
      return;
    }

    setIsGenerating(true);
    try {
      await generatePlaylist({
        query: query.trim(),
        playlistName: playlistName.trim() || undefined,
        createOnSpotify: createOnSpotify && !!spotifyTokens,
      });
      toast.success(
        createOnSpotify && spotifyTokens
          ? "Playlist generated and created on Spotify!" 
          : "Playlist generated successfully!"
      );
      setQuery("");
      setPlaylistName("");
      onPlaylistCreated();
    } catch (error) {
      toast.error("Failed to generate playlist. Please try again.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const exampleQueries = [
    "Upbeat songs for a morning workout",
    "Chill indie music for studying",
    "90s nostalgia hits",
    "Songs that make you feel like you're in a movie",
    "Rainy day acoustic vibes",
    "Electronic music for coding",
    "Feel-good summer anthems",
    "Emotional ballads for late nights"
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SpotifyConnection />
      
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Generate Your Perfect Playlist
        </h2>

        <form onSubmit={() => handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
              Describe your ideal playlist
            </label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Upbeat songs for a morning workout, chill indie music for studying..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="playlistName" className="block text-sm font-medium text-gray-700 mb-2">
              Playlist name (optional)
            </label>
            <input
              id="playlistName"
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="Leave blank for AI to generate a name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              id="createOnSpotify"
              type="checkbox"
              checked={createOnSpotify}
              onChange={(e) => setCreateOnSpotify(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="createOnSpotify" className="ml-2 block text-sm text-gray-700">
              Create playlist directly on Spotify
              {createOnSpotify && !spotifyTokens && (
                <span className="text-red-500 ml-1">(Connect Spotify first)</span>
              )}
            </label>
          </div>

          <button
            type="submit"
            disabled={!query.trim() || isGenerating || (createOnSpotify && !spotifyTokens)}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Playlist...
              </div>
            ) : (
              "Generate Playlist"
            )}
          </button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need inspiration? Try these:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => setQuery(example)}
                className="text-left p-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 hover:border-primary"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
