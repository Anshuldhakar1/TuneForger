import { Sun,Moon,User,Settings,List,ChevronDown } from "lucide-react";

const CustomLogo = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#28a745" />
        <polygon points="12,10 12,22 22,16" fill="white" />
        <circle cx="8" cy="8" r="1" fill="white" opacity="0.6" />
        <circle cx="24" cy="24" r="1" fill="white" opacity="0.6" />
    </svg>
)

interface HeaderProps { 
    isDarkMode: boolean;
    isSpotifyHovered: boolean;
    isSpotifyConnected: boolean;
    isDropdownOpen: boolean;
    setIsSpotifyHovered: (spotifyHovered: boolean) => void;
    setIsSpotifyConnected: (setSpotify: boolean) => void;
    handleDisconnectSpotify: () => void;
    toggleDarkMode: () => void;
    setIsDropdownOpen: (dropdownState: boolean) => void;
    setCurrentPage: (page: "home" | "playlists" | "gen_playlist") => void;
};

export default function Header(
    {
        isDarkMode,
        isSpotifyHovered, 
        isSpotifyConnected,
        isDropdownOpen,
        setIsSpotifyHovered,
        setIsSpotifyConnected,
        handleDisconnectSpotify,
        toggleDarkMode,
        setIsDropdownOpen,
        setCurrentPage,
    }: HeaderProps
) {
    return (
        <header
            className={`backdrop-blur-md shadow-sm border-b relative z-20 transition-all duration-300 ${isDarkMode ? "bg-gray-900/90 border-gray-800" : "bg-white/90 border-gray-200"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* App Name with Simplified Logo */}
                    <div className="flex items-center space-x-3 animate-fade-in hover:cursor-pointer" onClick={() => { setCurrentPage("home"); }}>
                        <div className="transform hover:scale-110 transition-transform duration-200">
                            <CustomLogo />
                        </div>
                        <h1 className="text-2xl font-bold text-[#28a745]">TuneForge</h1>
                    </div>

                    {/* Center - Enhanced Spotify Connection Component with Smooth Animations */}
                    <div className="flex-1 flex justify-center px-8 scale-75">
                        <div
                            className={`
                                group
                                flex items-center
                                border-2
                                rounded-full
                                transition-all
                                duration-300
                                cursor-pointer
                                overflow-hidden
                                ${isSpotifyConnected
                                    ? isSpotifyHovered
                                        ? isDarkMode
                                            ? "bg-red-900/20 border-red-500 shadow-lg"
                                            : "bg-red-50 border-red-500 shadow-lg"
                                        : isDarkMode
                                            ? "bg-gray-800 border-gray-400"
                                            : "bg-gray-50 border-gray-400"
                                    : isSpotifyHovered
                                        ? isDarkMode
                                            ? "bg-green-900/20 border-green-500 shadow-lg"
                                            : "bg-green-50 border-green-500 shadow-lg"
                                        : isDarkMode
                                            ? "bg-gray-800 border-gray-400"
                                            : "bg-gray-50 border-gray-400"
                                }
    `}
                            style={{
                                width: isSpotifyHovered ? 210 : 64, // 210px for pill, 64px for circle
                                height: 64, // 64px height for perfect circle
                                paddingLeft: 0,
                                paddingRight: 0,
                                transition: "all 0.3s cubic-bezier(.4,0,.2,1)"
                            }}
                            onMouseEnter={() => setIsSpotifyHovered(true)}
                            onMouseLeave={() => setIsSpotifyHovered(false)}
                            onClick={
                                isSpotifyConnected
                                    ? handleDisconnectSpotify
                                    : () => setIsSpotifyConnected(true)
                            }
                        >
                            {/* Icon - always centered in its own flex container */}
                            <div className="flex items-center justify-center w-16 h-16 flex-shrink-0">
                                <div
                                    className={`w-10 h-10  relative left-[-1.75px] rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSpotifyConnected
                                            ? "border-[#28a745] bg-black"
                                            : "border-red-500 bg-white"
                                        }`}
                                >
                                    <svg
                                        className={`w-6 h-6 transition-all duration-300 ${isSpotifyConnected ? "text-[#1DB954]" : "text-gray-400"
                                            }`}
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Sliding Text */}
                            <div
                                className={`
                                    flex-1 flex items-center
                                    overflow-hidden
                                    transition-all
                                    duration-300
                                    ${isSpotifyHovered ? "pl-2" : ""}
                                `}
                                style={{
                                    minWidth: 0
                                }}
                            >
                                <span
                                    className={`
                                        whitespace-nowrap
                                        font-semibold
                                        text-lg
                                        transition-all
                                        duration-300
                                        ${isSpotifyHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}
                                        ${isDarkMode ? "text-gray-900" : "text-gray-900"}
                                        `}
                                    style={{
                                        transition: "all 0.3s cubic-bezier(.4,0,.2,1)"
                                    }}
                                >
                                    {isSpotifyConnected ? "Disconnect" : "Connect"}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Right - Dark Mode Toggle and Profile Dropdown */}
                    <div className="flex items-center space-x-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${isDarkMode
                                ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                                : "bg-gray-100 hover:bg-gray-200 border border-gray-200"
                                }`}
                        >
                            {isDarkMode ? <Sun className="w-5 h-5 text-[#8b5cf6]" /> : <Moon className="w-5 h-5 text-[#8b5cf6]" />}
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`flex items-center space-x-2 p-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${isDarkMode ? "hover:bg-gray-800 border border-gray-700" : "hover:bg-gray-100 border border-gray-200"
                                    }`}
                            >
                                <div className="w-8 h-8 bg-[#28a745] rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 text-[#28a745] transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            { isDropdownOpen && (
                                    <div
                                        className={`absolute right-0 mt-2 w-48 backdrop-blur-md rounded-xl shadow-xl border z-50 overflow-hidden transition-all duration-300 animate-fade-in ${isDarkMode
                                                ? "bg-gray-800/95 border-gray-700"
                                                : "bg-white/95 border-gray-200"
                                            } py-2`} // <-- Moved py-2 here
                                    >
                                        {/* The intermediate div has been removed */}
                                        <button
                                            onClick={() => {
                                                setCurrentPage("playlists");
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full px-4 py-3 text-left text-sm flex items-center space-x-3 transition-colors ${isDarkMode
                                                    ? "text-gray-300 hover:bg-gray-700/50"
                                                    : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                        >
                                            <List className="w-4 h-4 text-[#28a745]" />
                                            <span>My playlists</span>
                                        </button>
                                        <button
                                            className={`w-full px-4 py-3 text-left text-sm flex items-center space-x-3 transition-colors ${isDarkMode
                                                    ? "text-gray-300 hover:bg-gray-700/50"
                                                    : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                        >
                                            <Settings className="w-4 h-4 text-[#28a745]" />
                                            <span>Settings</span>
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </header>

    );
}