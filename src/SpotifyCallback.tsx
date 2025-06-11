import { useEffect } from "react";

export default function SpotifyCallback() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state");
        if (code && state) {
            // Send code/state to main window
            window.opener?.postMessage(
                { type: "spotify-code", code, state },
                window.location.origin
            );
        }
        window.close();
    }, []);
    return <div>Connecting to Spotify...</div>;
}