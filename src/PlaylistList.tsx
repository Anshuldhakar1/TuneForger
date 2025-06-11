import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { PlaylistDetail } from "./PlaylistDetail";
import type { Id } from "../convex/_generated/dataModel";

export function PlaylistList() {
  const playlists = useQuery(api.playlists.getUserPlaylists) || [];
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<Id<"playlists"> | null>(null);
  const deletePlaylist = useMutation(api.playlists.deletePlaylist);

  const handleDelete = async (playlistId: Id<"playlists">, playlistName: string) => {
    if (!confirm(`Are you sure you want to delete "${playlistName}"?`)) return;
    
    try {
      await deletePlaylist({ playlistId });
      toast.success("Playlist deleted successfully");
      if (selectedPlaylistId === playlistId) {
        setSelectedPlaylistId(null);
      }
    } catch (error) {
      toast.error("Failed to delete playlist");
      console.error(error);
    }
  };

  const copyPlaylistLink = (playlistId: Id<"playlists">) => {
    const url = `${window.location.origin}?playlist=${playlistId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Playlist link copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  if (selectedPlaylistId) {
    return (
      <PlaylistDetail
        playlistId={selectedPlaylistId}
        onBack={() => setSelectedPlaylistId(null)}
      />
    );
  }

  if (playlists.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎵</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No playlists yet</h3>
        <p className="text-gray-600">Generate your first AI playlist to get started!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your AI Generated Playlists</h2>
      
      <div className="grid gap-4">
        {playlists.map((playlist) => (
          <div
            key={playlist._id}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {playlist.name}
                </h3>
                <p className="text-gray-600 mb-3">{playlist.description}</p>
                <p className="text-sm text-gray-500">
                  Created {new Date(playlist.createdAt).toLocaleDateString()}
                </p>
                {playlist.spotifyUrl && (
                  <div className="flex items-center mt-2">
                    <svg className="w-4 h-4 text-green-600 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    <span className="text-sm text-green-600">Available on Spotify</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => copyPlaylistLink(playlist._id)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Copy playlist link"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedPlaylistId(playlist._id)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                >
                  View Tracks
                </button>
                <button
                  onClick={() => handleDelete(playlist._id, playlist.name)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
