"use client";

import { useState, useEffect } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRef } from "react";

// SVG ICONS
const HeadphonesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
);
const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
    </svg>
);
const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
    </svg>
);
const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        <line x1="10" x2="10" y1="11" y2="17" />
        <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
);
const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
    </svg>
);

interface PlaylistProps {
    isDarkMode: boolean;
    navigateTo: (page: "home" | "playlists" | "gen_playlist", playlistId?: string) => void;
    currentViewPlaylistId: string;
    spotifyTokens: any; 
}

export default function Playlist({
    isDarkMode,
    navigateTo,
    currentViewPlaylistId,
    spotifyTokens,
}: PlaylistProps) {
  // ✅ All hooks at the top
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch playlist and tracks from backend
  const data = useQuery(api.playlists.getPlaylistWithTracks, {
      playlistId: currentViewPlaylistId as Id<"playlists">,
  });

  // Track deletion (local only for now)
  const [tracks, setTracks] = useState<any[]>([]);
  useEffect(() => {
      if (data?.tracks) setTracks(data.tracks);
  }, [data?.tracks]);

  // Copy trackb
  const handleCopyTrack = (track: any) => {
      navigator.clipboard.writeText(`${track.name} - ${track.artist}`);
      toast.success("Track copied!");
  };

  // Delete track (local only)
  const handleDeleteTrack = (trackId: string) => {
      setTracks((prev) => prev.filter((t) => t._id !== trackId));
      toast.success("Track deleted!");
  };

  // Format duration helper
  function formatDuration(ms: number) {
      if (!ms) return "";
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
      if (data?.playlist?.description) {
          setDescription(data.playlist.description);
          setOriginalDescription(data.playlist.description);
      }
  }, [data?.playlist?.description]);

  const transferPlaylistAction = useAction(api.spotify.transferPlaylist);
  const [isTransferring, setIsTransferring] = useState(false);

  const transferToSpotify = async () => {
      if (!spotifyTokens) {
          toast.error("Not connected to Spotify");
          return;
      }

      if (playlist.spotifyUrl) {
          toast.error("Playlist has already been transferred to Spotify");
          return;
      }

      setIsTransferring(true);
      
      try {
          const result = await transferPlaylistAction({
              playlistId: currentViewPlaylistId as Id<"playlists">,
          });
          
          toast.success(
              `Playlist transferred to Spotify! Found ${result.tracksFound} out of ${result.totalTracks} tracks.`
          );
          
          // Open Spotify playlist in new tab
          window.open(result.spotifyUrl, '_blank');
          
      } catch (error: any) {
          console.error("Transfer failed:", error);
          toast.error(`Failed to transfer playlist: ${error.message}`);
      } finally {
          setIsTransferring(false);
      }
  }

  if (!data) {
    return (
        <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
  }

  const { playlist } = data;

  return (
      <div
          className={`min-h-screen transition-all duration-300 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
          role="main"
          aria-label="Playlist viewer"
      >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
              {/* Playlist Header */}
              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                  <div className="w-64 h-64 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                    {playlist.imageUrl ? (
                      <img
                        src={playlist.imageUrl}
                        alt="Playlist cover"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <HeadphonesIcon className="w-20 h-20 text-white/80" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-end">
                      <div className="flex items-center justify-between mb-2">
                          <h1 className={`text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                              {playlist.name}
                          </h1>
                          
                          {/* Transfer to Spotify Button */}
                          {spotifyTokens && !playlist.spotifyUrl && (
                              <button
                                  onClick={transferToSpotify}
                                  disabled={isTransferring}
                                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                      isTransferring
                                          ? "bg-gray-400 cursor-not-allowed text-white"
                                          : "bg-[#1DB954] hover:bg-[#1ed760] text-white hover:shadow-lg transform hover:scale-105"
                                  }`}
                              >
                                  {isTransferring ? (
                                      <>
                                          <div className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                          Transferring...
                                      </>
                                  ) : (
                                      <>
                                          <svg className="w-4 h-4 mr-2 inline-block" fill="currentColor" viewBox="0 0 24 24">
                                              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.6 0-.359.24-.66.54-.779 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.78.242 1.16zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.301.421-1.02.599-1.559.3z"/>
                                          </svg>
                                          Transfer to Spotify
                                      </>
                                  )}
                              </button>
                          )}
                          
                          {/* Show Spotify link if already transferred */}
                          {playlist.spotifyUrl && (
                              <a
                                  href={playlist.spotifyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 rounded-lg font-medium bg-[#1DB954] hover:bg-[#1ed760] text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                              >
                                  <svg className="w-4 h-4 mr-2 inline-block" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.6 0-.359.24-.66.54-.779 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.78.242 1.16zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.301.421-1.02.599-1.559.3z"/>
                                  </svg>
                                  Open in Spotify
                              </a>
                          )}
                      </div>
                      
                      <div className="mb-2">
                          <span className={`text-base font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-700"}`}>
                              Generated from:
                          </span>
                          <p className={`italic text-base mt-1 ${isDarkMode ? "text-gray-100" : "text-gray-600"}`}>
                              "{playlist.query || ""}"
                          </p>
                      </div>
                      <div className="mb-3">
                          <div className="text-base font-medium text-gray-700 ">
                              <span className={`relative top-[-3px] font-semibold ${isDarkMode ? "text-gray-100" : ""}`}>Description:</span>

                              {/* className={`ml-2 p-1 border-2 text-purple-200 border-purple-300 rounded-lg hover:bg-purple-600 hover:text-white `}
                                   */}
                              <button
                                  type="button"
                                  className={`ml-2 p-1 border-2 text-purple-600 border-purple-300 rounded-lg hover:bg-purple-300 hover:border-purple-500 hover:text-purple-800 
                                      ${isDarkMode ? "text-white hover:bg-purple-600 hover:text-white" : ""}`}
                                  onClick={() => {
                                      setIsEditingDescription(true);
                                      setTimeout(() => textareaRef.current?.focus(), 0);
                                  }}
                                  aria-label="Edit description"
                              >
                                  <svg className="w-4 h-4 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 20h9" />
                                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                  </svg>
                              </button>
                          </div>
                          {!isEditingDescription ? (
                              <div className="flex items-center gap-2 mt-1">
                                  <p className={`text-base text-gray-700 ${isDarkMode ? "text-gray-100" : ""}`}>
                                      {description}
                                  </p>
                              </div>
                          ) : (
                              <div className="flex flex-col gap-2 mt-2">
                                  <textarea
                                      ref={textareaRef}
                                      className={`w-full rounded relative z-50 border px-3 py-2 text-base resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 ${isDarkMode
                                              ? "bg-gray-800 border-gray-600 text-white"
                                              : "bg-white border-gray-200 text-gray-900"
                                          }`}
                                      value={description}
                                      onChange={e => setDescription(e.target.value)}
                                      rows={3}
                                  />
                                  <div className="flex gap-2">
                                      <button
                                          type="button"
                                          className="px-4 py-1.5 rounded bg-green-600 text-white hover:bg-green-700 text-sm font-medium"
                                          onClick={() => {
                                              setIsEditingDescription(false);
                                              setOriginalDescription(description);
                                              // TODO: Save to backend here if needed
                                              toast.success("Description updated!");
                                          }}
                                      >
                                          Save
                                      </button>
                                      <button
                                          type="button"
                                          className={`px-4 py-1.5 rounded border text-sm font-medium ${isDarkMode 
                                              ? "border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600" 
                                              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                                          }`}
                                          onClick={() => {
                                              setDescription(originalDescription);
                                              setIsEditingDescription(false);
                                          }}
                                      >
                                          Cancel
                                      </button>
                                  </div>
                              </div>
                          )}
                      </div>
                      <div className={`flex max-w-fit border-2 p-1 pl-2 pr-2 rounded-md relative z-60 items-center gap-4 text-sm mb-4 ${
                          isDarkMode 
                              ? "text-gray-100 bg-gray-800 border-green-500" 
                              : "text-gray-500 bg-white border-green-200"
                      }`}>
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                              Created {new Date(playlist.createdAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{tracks.length} tracks</span>
                      </div>
                  </div>
              </div>

              {/* Track List */}
              <Card
                  className={`shadow-sm relative z-100 ${isDarkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
              >
                  <CardContent className="p-0">
                      {/* Table Header */}
                      <div
                          className={`px-6 py-3 rounded-t-lg ${isDarkMode
                                  ? "bg-green-900/20 border-green-800"
                                  : "bg-green-50 border-green-100"
                              }`}
                      >
                          <div className="grid grid-cols-12 gap-4 text-base font-semibold text-green-600">
                              <div className="col-span-1">#</div>
                              <div className="col-span-3">Track Details</div>
                              <div className="col-span-3">Artist</div>
                              <div className="col-span-2">Genre</div>
                              <div className="col-span-1 flex items-center gap-1">
                                  <ClockIcon className="w-4 h-4" />
                                  Duration
                              </div>
                              <div className="col-span-2">Actions</div>
                          </div>
                      </div>
                      {/* Track Rows */}
                      <div className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                          {tracks.map((track, idx) => (
                              <div
                                  key={track._id}
                                  className={`grid grid-cols-12 gap-4 items-center px-6 py-4 text-base ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
                              >
                                  <div className="col-span-1 text-green-500 font-semibold">{idx + 1}</div>
                                  <div className="col-span-3 flex items-center gap-3">
                                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                                          <HeadphonesIcon className="w-5 h-5 text-green-600" />
                                      </div>
                                      <div>
                                          <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                              {track.name}
                                          </div>
                                          {/* Optionally show album or other info here */}
                                      </div>
                                  </div>
                                  <div className={`col-span-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      {track.artist || <span className="text-gray-400">N/A</span>}
                                  </div>
                                  <div className="col-span-2">
                                      <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                                          {track.genre || "Unknown"}
                                      </span>
                                  </div>
                                  <div className={`col-span-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                      {track.duration ? formatDuration(track.duration) : ""}
                                  </div>
                                  <div className="col-span-2 flex gap-2 items-center">
                                      {/* Favorite icon (show only) */}
                                      <span
                                          className="inline-flex items-center p-[2px] justify-center rounded-full bg-pink-50 w-9 h-9"
                                          title="Favorite"
                                      >
                                          <HeartIcon className="w-5 h-5 text-pink-500" />
                                      </span>
                                      {/* Copy icon */}
                                      <button
                                          type="button"
                                          onClick={() => handleCopyTrack(track)}
                                          aria-label="Copy track"
                                          className="inline-flex items-center p-[2px] justify-center rounded-full bg-green-50 w-9 h-9 hover:bg-green-100 focus:outline-none"
                                      >
                                          <CopyIcon className="w-5 h-5 text-green-600" />
                                      </button>
                                      {/* Delete icon */}
                                      <button
                                          type="button"
                                          onClick={() => handleDeleteTrack(track._id)}
                                          aria-label="Delete track"
                                          className="inline-flex items-center p-[2px] justify-center rounded-full bg-gray-50 w-9 h-9 hover:bg-red-50 focus:outline-none"
                                      >
                                          <TrashIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          </div>
      </div>
  );
}

// Helper
function formatDuration(ms: number) {
    if (!ms) return "";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}