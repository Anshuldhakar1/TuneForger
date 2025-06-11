import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { toast } from "sonner";

interface PlaylistDetailProps {
  playlistId: Id<"playlists">;
  onBack: () => void;
}

export function PlaylistDetail({ playlistId, onBack }: PlaylistDetailProps) {
  const data = useQuery(api.playlists.getPlaylistWithTracks, { playlistId });

  const copyPlaylistLink = () => {
    const url = `${window.location.origin}?playlist=${playlistId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Playlist link copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  const openSpotifyPlaylist = () => {
    if (data?.playlist.spotifyUrl) {
      window.open(data.playlist.spotifyUrl, "_blank");
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!data) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { playlist, tracks } = data;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-primary hover:text-primary-hover transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Playlists
      </button>

      <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{playlist.name}</h1>
        <p className="text-gray-600 mb-4">{playlist.description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>{tracks.length} tracks</span>
          <span className="mx-2">•</span>
          <span>Created {new Date(playlist.createdAt).toLocaleDateString()}</span>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={copyPlaylistLink}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Playlist Link
          </button>
          
          {playlist.spotifyUrl && (
            <button
              onClick={openSpotifyPlaylist}
              className="flex items-center gap-2 px-4 py-2 bg-[#1db954] text-white rounded-lg hover:bg-[#1ed760] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Open in Spotify
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Tracks</h2>
        </div>
        
        <div className="divide-y">
          {tracks.map((track, index) => (
            <div key={track._id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 text-center text-gray-500 font-medium">
                  {index + 1}
                </div>
                
                {track.imageUrl && (
                  <div className="flex-shrink-0 ml-4">
                    <img 
                      src={track.imageUrl} 
                      alt={`${track.album} cover`}
                      className="w-12 h-12 rounded object-cover"
                    />
                  </div>
                )}
                
                <div className="flex-1 ml-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{track.name}</h3>
                      <p className="text-gray-600">{track.artist}</p>
                      {track.album && (
                        <p className="text-sm text-gray-500">{track.album}</p>
                      )}
                      {track.reasoning && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          "{track.reasoning}"
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 ml-4">
                      {track.duration && (
                        <span className="text-sm text-gray-500">
                          {formatDuration(track.duration)}
                        </span>
                      )}
                      
                      {track.previewUrl && (
                        <audio 
                          controls 
                          className="h-8"
                          preload="none"
                        >
                          <source src={track.previewUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                      
                      {track.spotifyId && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Spotify Integration:</strong> 
          {playlist.spotifyUrl 
            ? " This playlist is available on Spotify! Click 'Open in Spotify' to listen." 
            : " Connect your Spotify account in the generator to create playlists directly on Spotify."
          }
        </p>
      </div>
    </div>
  );
}
