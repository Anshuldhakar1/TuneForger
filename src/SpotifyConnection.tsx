import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

export function SpotifyConnection() {
  const getAuthUrl = useAction(api.spotify.getSpotifyAuthUrl);
  const exchangeSpotifyCode = useAction(api.spotify.exchangeSpotifyCode);
  const spotifyTokens = useQuery(api.spotify.getSpotifyTokens);
  const disconnectSpotify = useMutation(api.spotify.disconnectSpotify);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const authUrl = await getAuthUrl();
      
      // Open popup window for Spotify auth
      const popup = window.open(
        authUrl,
        "spotify-auth",
        "width=500,height=600,scrollbars=yes,resizable=yes"
      );
  
      // Listen for popup messages
      const handleMessage = async (event: MessageEvent) => {
        if (event.data?.type === "spotify-code") {
          try {
            await exchangeSpotifyCode({ 
              code: event.data.code, 
              state: event.data.state 
            });
            toast.success("Spotify connected successfully!");
          } catch (error) {
            console.error('Exchange failed:', error);
            toast.error("Failed to connect Spotify");
          }
          popup?.close();
          setIsConnecting(false);
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          window.removeEventListener("message", handleMessage); 
        }
        
        if (event.data?.type === "spotify-error") {
          console.error('Spotify error:', event.data.error);
          toast.error("Spotify connection failed");
          popup?.close();
          setIsConnecting(false);
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          window.removeEventListener("message", handleMessage); // Fixed!
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      window.addEventListener("message", handleMessage); // Fixed!
  
      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup?.closed && isConnecting) {
          clearInterval(checkClosed);
          setIsConnecting(false);
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          window.removeEventListener("message", handleMessage); // Fixed!
          console.log('Popup was closed manually');
        }
      }, 1000);
  
    } catch (error) {
      console.error('Connection to spotify failed:', error);
      toast.error("Failed to connect to Spotify");
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    // console.log("disconnect handler called");
    try {
      await disconnectSpotify();
      toast.success("Spotify disconnected");
    } catch (error) {
      console.error('Disconnect failed:', error);
      toast.error("Failed to disconnect Spotify");
    }
  };

  if (spotifyTokens === undefined) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <div>
            <h3 className="font-semibold text-gray-900">Spotify Integration</h3>
            {spotifyTokens ? (
              <p className="text-sm text-green-600">
                Connected as {spotifyTokens.spotifyDisplayName || spotifyTokens.spotifyUserId}
              </p>
            ) : (
              <p className="text-sm text-gray-600">Connect to create playlists directly on Spotify</p>
            )}
          </div>
        </div>
        
        {spotifyTokens ? (
          <button
            onClick={() => { 
              void handleDisconnect(); 
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Disconnect
          </button>
        ) : (
          <button
              onClick={() => { void handleConnect(); }}
            disabled={isConnecting}
            className="px-4 py-2 bg-[#1db954] text-white rounded-lg hover:bg-[#1ed760] transition-colors disabled:opacity-50"
          >
            {isConnecting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Connecting...
              </div>
            ) : (
              "Connect Spotify"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
