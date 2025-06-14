interface PlaylistsProps {
    isDarkMode: boolean;
    setCurrentPage: (page: "home" | "playlists") => void;
    isSocialButtonHovered: boolean;
    setIsSocialButtonHovered: (value: boolean) => void;
    handleShare: () => void;
};

const Playlists = (
    { 
        isDarkMode,
        setCurrentPage,
        isSocialButtonHovered,
        setIsSocialButtonHovered,
        handleShare,
    }: PlaylistsProps
) => { 
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Playlists</h1>
        <p className="text-gray-700 dark:text-gray-300">This feature is coming soon!</p>
        </div>
    );
};

export default Playlists;