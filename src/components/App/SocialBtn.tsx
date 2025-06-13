import { Share2 } from "lucide-react";

interface SocialBtnProps {
    isDarkMode: boolean;
    setIsSocialButtonHovered: (hovered: boolean) => void;
    isSocialButtonHovered?: boolean;
    handleShare: () => void;
}

const GitHubLogo = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-github-icon lucide-github ${className || ''}`}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
);

export default function SocialBtn({ isDarkMode, setIsSocialButtonHovered, isSocialButtonHovered, handleShare }: SocialBtnProps) {
    return (
        <div
            className="fixed bottom-6 right-6 z-50"
            onMouseEnter={() => setIsSocialButtonHovered(true)}
            onMouseLeave={() => setIsSocialButtonHovered(false)}
            onFocusCapture={() => setIsSocialButtonHovered(true)}
            onBlurCapture={(e) => {
                // Only hide if focus is moving completely outside the container
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setIsSocialButtonHovered(false);
                }
            }}
        >
            <div className="relative">
                {/* Social Icons that shoot up */}
                <div
                    className={`absolute bottom-16 right-0 flex flex-col space-y-3 transition-all duration-500 ${isSocialButtonHovered ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
                        }`}
                >
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-[#28a745] focus:ring-offset-2 ${isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-white focus:bg-gray-700" : "bg-white hover:bg-gray-50 text-gray-900 focus:bg-gray-50"
                            }`}
                    >
                        <GitHubLogo className="w-5 h-5" />
                    </a>
                </div>

                {/* Main Share Button - Matching Size */}
                <button
                    onClick={handleShare}
                    className={`p-3 rounded-full shadow-lg transition-all duration-500 transform hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-[#28a745] focus:ring-offset-2 ${isSocialButtonHovered ? "rotate-360" : ""
                        } ${isDarkMode ? "bg-[#28a745] hover:bg-[#218838] focus:bg-[#218838]" : "bg-[#28a745] hover:bg-[#218838] focus:bg-[#218838]"}`}
                >
                    <Share2 className="w-5 h-5 text-white" />
                </button>
            </div>
        </div>
    );
}