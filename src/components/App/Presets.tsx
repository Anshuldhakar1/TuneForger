import { JSX } from "react";

export interface PresetProps { 
    isDarkMode: boolean;
    isGenerating: boolean;
    setPrompt: (prompt: string) => void;
};

export default function Presets({ isDarkMode, isGenerating, setPrompt }: PresetProps): JSX.Element {

    const handlePresetClick = (presetPrompt: string) => {
        setPrompt(presetPrompt)
    }

    const presetPrompts = [
        {
            text: "High-energy workout anthems with heavy bass drops and motivational lyrics",
            icon: "🔥",
            category: "Fitness",
        },
        {
            text: "Lo-fi hip hop and ambient soundscapes perfect for deep focus coding sessions",
            icon: "🧠",
            category: "Study",
        },
        {
            text: "Classic rock road trip essentials from the 70s, 80s, and 90s with epic guitar solos",
            icon: "🎸",
            category: "Travel",
        },
        {
            text: "Intimate acoustic love songs and soulful R&B for romantic dinner dates",
            icon: "💝",
            category: "Romance",
        },
        {
            text: "Dark synthwave and cyberpunk electronic beats for late-night programming",
            icon: "🌃",
            category: "Tech",
        },
        {
            text: "Smooth jazz standards and contemporary fusion for sophisticated evening relaxation",
            icon: "🎺",
            category: "Jazz",
        },
        {
            text: "Uplifting indie pop and alternative rock for sunny weekend adventures",
            icon: "☀️",
            category: "Weekend",
        },
        {
            text: "Nostalgic 2000s hits and early 2010s pop for throwback party vibes",
            icon: "🎉",
            category: "Party",
        },
        {
            text: "Meditative world music and nature sounds for yoga and mindfulness practice",
            icon: "🧘",
            category: "Wellness",
        },
    ];

    return (
        <div className="animate-fade-in" style={{ animationDelay: "1s" }}>
                  <h3 className={`text-2xl font-bold text-center mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Curated Playlist Ideas
                    <span className={`block text-sm font-normal mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Click any card to get started instantly
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {presetPrompts.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => handlePresetClick(preset.text)}
                        disabled={isGenerating}
                        className={`group p-6 text-left backdrop-blur-sm border rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] relative overflow-hidden animate-slide-up ${isDarkMode
                          ? "bg-gray-800/80 border-gray-700 hover:border-[#28a745]"
                          : "bg-white/80 border-gray-200 hover:border-[#28a745]"
                          }`}
                        style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                      >
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{preset.icon}</span>
                              <span className="text-xs px-2 py-1 rounded-full font-medium bg-[#8b5cf6]/10 text-[#8b5cf6]">
                                {preset.category}
                              </span>
                            </div>
                            <div className="w-2 h-2 bg-[#28a745] rounded-full group-hover:animate-pulse"></div>
                          </div>
                          <p
                            className={`text-sm font-semibold transition-colors leading-relaxed ${isDarkMode ? "text-white group-hover:text-[#28a745]" : "text-gray-900 group-hover:text-[#28a745]"
                              }`}
                          >
                            {preset.text}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
    );
};