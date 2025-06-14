"use client";

import { useState, useMemo } from "react";
import { Heart, MoreHorizontal, Search, Grid, List, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import type { Id } from "../convex/_generated/dataModel";

// Spotify-themed sync icon component
const SpotifySyncIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 14.5c-.17 0-.33-.09-.42-.24-.35-.6-1.27-.81-2.57-.81s-2.22.21-2.57.81c-.09.15-.25.24-.42.24-.08 0-.17-.02-.25-.06-.23-.13-.31-.42-.18-.65.5-.85 1.72-1.14 3.42-1.14s2.92.29 3.42 1.14c.13.23.05.52-.18.65-.08.04-.17.06-.25.06zm.86-2.22c-.2 0-.39-.1-.51-.28-.44-.75-1.6-1.02-3.24-1.02s-2.8.27-3.24 1.02c-.12.18-.31.28-.51.28-.1 0-.2-.02-.29-.07-.28-.15-.38-.49-.23-.77.64-1.1 2.13-1.46 4.27-1.46s3.63.36 4.27 1.46c.15.28.05.62-.23.77-.09.05-.19.07-.29.07zm1.15-2.95c-.23 0-.45-.12-.58-.33-.52-.87-1.96-1.17-3.82-1.17s-3.3.3-3.82 1.17c-.13.21-.35.33-.58.33-.12 0-.24-.03-.35-.09-.32-.18-.43-.58-.25-.9.71-1.21 2.49-1.51 5-1.51s4.29.3 5 1.51c.18.32.07.72-.25.9-.11.06-.23.09-.35.09z" />
        <path d="M17.5 8.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm-11 0c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z" />
        <path d="M12 6c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z" />
    </svg>
);

interface PlaylistsProps {
    isDarkMode: boolean;
    setCurrentPage: (page: "home" | "playlists") => void;
}

export default function Playlists({
    isDarkMode,
    setCurrentPage,
}: PlaylistsProps) {
    // Fetch playlists from backend
    const playlists = useQuery(api.playlists.getUserPlaylists) || [];

    // UI state
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [likedPlaylists, setLikedPlaylists] = useState<Id<"playlists">[]>([]);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    // Backend mutations
    const deletePlaylist = useMutation(api.playlists.deletePlaylist);

    // Handlers
    const toggleLike = (playlistId: Id<"playlists">) => {
        setLikedPlaylists((prev) =>
            prev.includes(playlistId)
                ? prev.filter((id) => id !== playlistId)
                : [...prev, playlistId]
        );
    };

    const handleDelete = async (
        playlistId: Id<"playlists">,
        playlistName: string
    ) => {
        if (!confirm(`Are you sure you want to delete "${playlistName}"?`)) return;
        try {
            await deletePlaylist({ playlistId });
            toast.success("Playlist deleted successfully");
        } catch (error) {
            toast.error("Failed to delete playlist");
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };

    const copyPlaylistLink = (playlistId: Id<"playlists">) => {
        const url = `${window.location.origin}?playlist=${playlistId}`;
        navigator.clipboard
            .writeText(url)
            .then(() => {
                toast.success("Playlist link copied to clipboard!");
            })
            .catch(() => {
                toast.error("Failed to copy link");
            });
    };

    // Filtering
    const filteredPlaylists = useMemo(() => {
        return playlists.filter((playlist) => {
            const matchesSearch =
                playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (playlist.description || "")
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            const matchesFavorites = showFavoritesOnly
                ? likedPlaylists.includes(playlist._id)
                : true;
            return matchesSearch && matchesFavorites;
        });
    }, [playlists, searchQuery, showFavoritesOnly, likedPlaylists]);

    // Color palette for playlist cards (fallback)
    const colorPalette = [
        "from-green-400 to-green-600",
        "from-red-400 to-red-600",
        "from-blue-400 to-blue-600",
        "from-purple-400 to-purple-600",
        "from-orange-400 to-orange-600",
        "from-teal-400 to-teal-600",
    ];

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
            {/* Page Header */}
            <div className="mb-8 animate-in slide-in-from-top duration-500 ease-out">
                <h1
                    className={`text-4xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                >
                    Your Playlists
                </h1>
                <p
                    className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                >
                    Discover and manage your curated music collections
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-in slide-in-from-top duration-700 ease-out">
                <div className="flex-1 flex gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search playlists..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`pl-10 transition-all duration-300 ease-out ${isDarkMode
                                    ? "bg-gray-800 border-gray-600 text-white focus:border-[#31c266] focus:ring-[#31c266]"
                                    : "bg-white border-gray-200 focus:border-[#31c266] focus:ring-[#31c266]"
                                }`}
                        />
                    </div>

                    {/* Favorites Filter */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        className={`transition-all duration-300 ease-out hover:scale-105 ${showFavoritesOnly
                                ? "bg-[#31c266]/10 text-[#31c266] border-[#31c266]/30 hover:bg-[#31c266]/20"
                                : isDarkMode
                                    ? "bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
                                    : "bg-white border-gray-200 hover:bg-gray-50"
                            }`}
                    >
                        <Heart className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <div
                        className={`flex border rounded-lg overflow-hidden ${isDarkMode
                                ? "border-gray-600 bg-gray-800"
                                : "border-gray-200 bg-white"
                            }`}
                    >
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className={`rounded-none transition-all duration-300 ease-out ${viewMode === "grid"
                                    ? "bg-[#31c266] hover:bg-[#31c266]/90 text-white"
                                    : isDarkMode
                                        ? "hover:bg-gray-700 text-gray-200"
                                        : "hover:bg-gray-50"
                                }`}
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className={`rounded-none transition-all duration-300 ease-out ${viewMode === "list"
                                    ? "bg-[#31c266] hover:bg-[#31c266]/90 text-white"
                                    : isDarkMode
                                        ? "hover:bg-gray-700 text-gray-200"
                                        : "hover:bg-gray-50"
                                }`}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Playlists Grid/List */}
            <div
                className={
                    viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        : "space-y-4"
                }
            >
                {filteredPlaylists.map((playlist, index) => {
                    // Pick a color for the card (fallback if not in DB)
                    const color =
                        colorPalette[index % colorPalette.length] ||
                        "from-green-400 to-green-600";
                    return (
                        <Card
                            key={playlist._id}
                            className={`
                group cursor-pointer transition-all duration-500 ease-out hover:scale-105
                animate-in slide-in-from-bottom
                ${isDarkMode
                                    ? "bg-gray-800 border-gray-700 hover:border-[#31c266] hover:shadow-xl"
                                    : "bg-white border-gray-200 hover:border-[#31c266]/30 hover:shadow-xl"
                                }
              `}
                            style={{
                                animationDelay: `${index * 100}ms`,
                                animationFillMode: "both",
                            }}
                        >
                            {viewMode === "grid" ? (
                                <>
                                    <CardHeader className="p-0">
                                        <div className="relative overflow-hidden rounded-t-lg">
                                            <div
                                                className={`h-48 bg-gradient-to-br ${color} relative`}
                                            >
                                                <div className="absolute inset-0 bg-black/20" />
                                                <div className="absolute bottom-4 left-4 flex gap-2">
                                                    <div
                                                        className="transition-all duration-300 ease-out transform translate-y-2 group-hover:translate-y-0"
                                                        style={{ transitionDelay: "50ms" }}
                                                    >
                                                        {playlist.spotifyUrl && (
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                className="bg-white/90 hover:bg-white text-[#31c266] shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:scale-110"
                                                                onClick={() =>
                                                                    window.open(playlist.spotifyUrl, "_blank")
                                                                }
                                                                title="Open in Spotify"
                                                            >
                                                                <SpotifySyncIcon className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="absolute top-4 right-4 flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleLike(playlist._id);
                                                        }}
                                                        className="text-white hover:bg-white/20 transition-all duration-300 ease-out hover:scale-110"
                                                    >
                                                        <Heart
                                                            className={`w-4 h-4 transition-all duration-300 ease-out ${likedPlaylists.includes(playlist._id)
                                                                    ? "fill-red-500 text-red-500"
                                                                    : "text-white"
                                                                }`}
                                                        />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3
                                                className={`font-semibold group-hover:text-[#31c266] transition-colors duration-300 ease-out ${isDarkMode ? "text-white" : "text-gray-900"
                                                    }`}
                                            >
                                                {playlist.name}
                                            </h3>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className={`opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out ${isDarkMode
                                                                ? "hover:bg-gray-700"
                                                                : "hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className={
                                                        isDarkMode ? "bg-gray-800 border-gray-700" : ""
                                                    }
                                                >
                                                    <DropdownMenuItem
                                                        className={
                                                            isDarkMode
                                                                ? "text-gray-200 hover:bg-gray-700"
                                                                : ""
                                                        }
                                                        onClick={() => copyPlaylistLink(playlist._id)}
                                                    >
                                                        Copy Link
                                                    </DropdownMenuItem>
                                                    {playlist.spotifyUrl && (
                                                        <DropdownMenuItem
                                                            className={
                                                                isDarkMode
                                                                    ? "text-gray-200 hover:bg-gray-700"
                                                                    : ""
                                                            }
                                                            onClick={() =>
                                                                window.open(playlist.spotifyUrl, "_blank")
                                                            }
                                                        >
                                                            Open in Spotify
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator
                                                        className={isDarkMode ? "bg-gray-700" : ""}
                                                    />
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => {
                                                            void handleDelete(playlist._id, playlist.name);
                                                        }}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <p
                                            className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                                                }`}
                                        >
                                            {playlist.description}
                                        </p>
                                        <div
                                            className={`flex items-center justify-between text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
                                                }`}
                                        >
                                            <span>
                                                Playlist
                                            </span>
                                            <span>
                                                {playlist.createdAt
                                                    ? new Date(playlist.createdAt).toLocaleDateString()
                                                    : ""}
                                            </span>
                                        </div>
                                    </CardContent>
                                </>
                            ) : (
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className={`w-16 h-16 bg-gradient-to-br ${color} rounded-lg flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300 ease-out`}
                                        >
                                            <div className="absolute inset-0 bg-black/20 rounded-lg" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3
                                                className={`font-semibold group-hover:text-[#31c266] transition-colors duration-300 ease-out ${isDarkMode ? "text-white" : "text-gray-900"
                                                    }`}
                                            >
                                                {playlist.name}
                                            </h3>
                                            <p
                                                className={`text-sm truncate ${isDarkMode ? "text-gray-300" : "text-gray-600"
                                                    }`}
                                            >
                                                {playlist.description}
                                            </p>
                                            
                                            <div
                                                className={`flex items-center space-x-4 text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"
                                                    }`}
                                            >
                                                <span>
                                                    Playlist
                                                </span>
                                                <span>
                                                    {playlist.createdAt
                                                        ? new Date(playlist.createdAt).toLocaleDateString()
                                                        : ""}
                                                </span>
                                            </div>
                                            {playlist.spotifyUrl && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="transition-all duration-300 ease-out hover:scale-110"
                                                    onClick={() =>
                                                        window.open(playlist.spotifyUrl, "_blank")
                                                    }
                                                    title="Open in Spotify"
                                                >
                                                    <SpotifySyncIcon className="w-4 h-4 text-[#31c266]" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleLike(playlist._id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out hover:scale-110"
                                            >
                                                <Heart
                                                    className={`w-4 h-4 transition-all duration-300 ease-out ${likedPlaylists.includes(playlist._id)
                                                            ? "fill-red-500 text-red-500"
                                                            : "text-gray-400"
                                                        }`}
                                                />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className={
                                                        isDarkMode ? "bg-gray-800 border-gray-700" : ""
                                                    }
                                                >
                                                    <DropdownMenuItem
                                                        className={
                                                            isDarkMode
                                                                ? "text-gray-200 hover:bg-gray-700"
                                                                : ""
                                                        }
                                                        onClick={() => copyPlaylistLink(playlist._id)}
                                                    >
                                                        Copy Link
                                                    </DropdownMenuItem>
                                                    {playlist.spotifyUrl && (
                                                        <DropdownMenuItem
                                                            className={
                                                                isDarkMode
                                                                    ? "text-gray-200 hover:bg-gray-700"
                                                                    : ""
                                                            }
                                                            onClick={() =>
                                                                window.open(playlist.spotifyUrl, "_blank")
                                                            }
                                                        >
                                                            Open in Spotify
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator
                                                        className={isDarkMode ? "bg-gray-700" : ""}
                                                    />
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => {
                                                            void handleDelete(playlist._id, playlist.name);
                                                        }}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredPlaylists.length === 0 && (
                <div className="text-center py-12 animate-in fade-in duration-500 ease-out">
                    <Music
                        className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? "text-gray-600" : "text-gray-300"
                            }`}
                    />
                    <h3
                        className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                    >
                        No playlists found
                    </h3>
                    <p
                        className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                    >
                        {searchQuery
                            ? "Try adjusting your search terms"
                            : showFavoritesOnly
                                ? "No favorite playlists found"
                                : "Your playlists will appear here"}
                    </p>
                </div>
            )}
        </main>
    );
}