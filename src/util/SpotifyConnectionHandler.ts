import { useAction, useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

// Move these inside the component that uses them, or create a custom hook
export const useSpotifyConnection = () => {
  const getAuthUrl = useAction(api.spotify.getSpotifyAuthUrl);
  const exchangeSpotifyCode = useAction(api.spotify.exchangeSpotifyCode);
  const spotifyTokens = useQuery(api.spotify.getSpotifyTokens);
  const disconnectSpotify = useMutation(api.spotify.disconnectSpotify);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectSpotify = async (): Promise<boolean> => {
    console.log("=== Starting Spotify connection ===");
    setIsConnecting(true);
    
    return new Promise((resolve) => {
      const connect = async () => {
        try {
          console.log("Getting auth URL...");
          const authUrl = await getAuthUrl();
          console.log("Auth URL received:", authUrl);
          
          // Open popup window for Spotify auth
          const popup = window.open(
            authUrl,
            "spotify-auth",
            "width=500,height=600,scrollbars=yes,resizable=yes"
          );

          if (!popup) {
            console.log("Popup blocked");
            toast.error("Popup blocked. Please allow popups for this site.");
            setIsConnecting(false);
            resolve(false);
            return;
          }

          console.log("Popup opened successfully");

          // Listen for popup messages
          const handleMessage = async (event: MessageEvent) => {
            console.log("=== Message received ===");
            console.log("Origin:", event.origin);
            console.log("Data:", event.data);
            console.log("Type:", event.data?.type);

            // Temporarily remove origin check for debugging
            // if (event.origin !== window.location.origin) {
            //   console.log("Origin mismatch, ignoring");
            //   return;
            // }

            if (event.data?.type === "spotify-code") {
              console.log("Processing spotify-code with:", {
                code: event.data.code,
                state: event.data.state
              });
            
              try {
                console.log("Calling exchangeSpotifyCode...");
                const result = await exchangeSpotifyCode({ 
                  code: event.data.code, 
                  state: event.data.state 
                });
                console.log("Exchange successful:", result);
                
                toast.success("Spotify connected successfully!");
                popup?.close();
                setIsConnecting(false);
                window.removeEventListener("message", handleMessage);
                resolve(true);
              } catch (error) {
                console.error('Exchange failed:', error);
                toast.error(`Failed to connect Spotify: ${error}`);
                popup?.close();
                setIsConnecting(false);
                window.removeEventListener("message", handleMessage);
                resolve(false);
              }
            }
            
            if (event.data?.type === "spotify-error") {
              console.error('Spotify error:', event.data.error);
              toast.error("Spotify connection failed");
              popup?.close();
              setIsConnecting(false);
              window.removeEventListener("message", handleMessage);
              resolve(false);
            }
          };

          window.addEventListener("message", handleMessage);
          console.log("Message listener added");

          // Check if popup was closed manually
          const checkClosed = setInterval(() => {
            if (popup?.closed) {
              console.log("Popup closed manually");
              clearInterval(checkClosed);
              if (isConnecting) {
                setIsConnecting(false);
                window.removeEventListener("message", handleMessage);
                resolve(false);
              }
            }
          }, 1000);

        } catch (error) {
          console.error('Connection failed:', error);
          toast.error("Failed to connect to Spotify");
          setIsConnecting(false);
          resolve(false);
        }
      };

      connect();
    });
  };

  const handleDisconnect = async (): Promise<boolean> => {
    try {
      await disconnectSpotify();
      toast.success("Spotify disconnected");
      return true;
    } catch (error) {
      console.error('Disconnect failed:', error);
      toast.error("Failed to disconnect Spotify");
      return false;
    }
  };

  return {
    connectSpotify,
    handleDisconnect,
    isConnecting,
    spotifyTokens,
  };
};