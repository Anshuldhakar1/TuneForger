import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || "";

export const getSpotifyAuthUrl = action({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const scopes = [
      "playlist-modify-public",
      "playlist-modify-private",
      "user-read-private",
      "user-read-email"
    ].join(" ");

    const params = new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID!,
      scope: scopes,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      state: userId,
      show_dialog: "true",
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  },
});

export const exchangeSpotifyCode = action({
  args: {
    code: v.string(),
    state: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    if (userId !== args.state) {
      throw new Error("Invalid state parameter");
    }

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: args.code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokenData = await tokenResponse.json();

    // Get user profile
    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error("Failed to get user profile");
    }

    const profile = await profileResponse.json();

    // Store tokens
    await ctx.runMutation(api.spotify.storeSpotifyTokens, {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: Date.now() + (tokenData.expires_in * 1000),
      spotifyUserId: profile.id,
      spotifyDisplayName: profile.display_name,
      userId: userId,
    });

    return { success: true };
  },
});

export const storeSpotifyTokens = mutation({
  args: {
    accessToken: v.string(),
    refreshToken: v.string(),
    expiresAt: v.number(),
    spotifyUserId: v.string(),
    spotifyDisplayName: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = args.userId;
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user already has Spotify tokens
    const existingTokens = await ctx.db
      .query("spotifyTokens")
      .withIndex("by_user", (q) => q.eq("userId", userId as any))
      .unique();

    if (existingTokens) {
      await ctx.db.patch(existingTokens._id, {
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        expiresAt: args.expiresAt,
        spotifyUserId: args.spotifyUserId,
        spotifyDisplayName: args.spotifyDisplayName,
      });
    } else {
      await ctx.db.insert("spotifyTokens", {
        userId: userId as any,
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        expiresAt: args.expiresAt,
        spotifyUserId: args.spotifyUserId,
        spotifyDisplayName: args.spotifyDisplayName,
      });
    }
  },
});

export const getSpotifyTokens = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("spotifyTokens")
      .withIndex("by_user", (q) => q.eq("userId", userId as any))
      .unique();
  },
});

export const refreshSpotifyToken = action({
  args: {},
  handler: async (ctx): Promise<string> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const tokens = await ctx.runQuery(api.spotify.getSpotifyTokens);
    if (!tokens) {
      throw new Error("No Spotify tokens found");
    }

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: tokens.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();

    await ctx.runMutation(api.spotify.storeSpotifyTokens, {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || tokens.refreshToken,
      expiresAt: Date.now() + (data.expires_in * 1000),
      spotifyUserId: tokens.spotifyUserId,
      spotifyDisplayName: tokens.spotifyDisplayName,
      userId: userId,
    });

    return data.access_token;
  },
});

export const searchSpotifyTrack = action({
  args: {
    trackName: v.string(),
    artistName: v.string(),
  },
  handler: async (ctx, args): Promise<any> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    let tokens = await ctx.runQuery(api.spotify.getSpotifyTokens);
    if (!tokens) {
      throw new Error("Spotify not connected");
    }

    // Check if token needs refresh
    if (Date.now() >= tokens.expiresAt) {
      await ctx.runAction(api.spotify.refreshSpotifyToken);
      tokens = await ctx.runQuery(api.spotify.getSpotifyTokens);
    }

    const query = `track:"${args.trackName}" artist:"${args.artistName}"`;
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`;

    const response = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${tokens!.accessToken}`,
      },
    });

    if (!response.ok) {
      console.error(`Spotify search failed for "${args.trackName}" by "${args.artistName}"`);
      return null;
    }

    const data = await response.json();
    const tracks = data.tracks?.items || [];
    
    return tracks.length > 0 ? tracks[0] : null;
  },
});

export const createSpotifyPlaylist = action({
  args: {
    playlistId: v.id("playlists"),
    name: v.string(),
    description: v.string(),
    tracks: v.array(v.object({
      name: v.string(),
      artist: v.string(),
      album: v.optional(v.string()),
      reasoning: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args): Promise<{ spotifyUrl: string; tracksFound: number; totalTracks: number }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    let tokens = await ctx.runQuery(api.spotify.getSpotifyTokens);
    if (!tokens) {
      throw new Error("Spotify not connected. Please connect your Spotify account first.");
    }

    // Check if token needs refresh
    if (Date.now() >= tokens.expiresAt) {
      await ctx.runAction(api.spotify.refreshSpotifyToken);
      tokens = await ctx.runQuery(api.spotify.getSpotifyTokens);
    }

    // Create playlist on Spotify
    const createResponse = await fetch(`https://api.spotify.com/v1/users/${tokens!.spotifyUserId}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokens!.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: args.name,
        description: args.description,
        public: false,
      }),
    });

    if (!createResponse.ok) {
      throw new Error("Failed to create Spotify playlist");
    }

    const spotifyPlaylist = await createResponse.json();

    // Get the playlist image from Spotify (use the first image or a default)
    const playlistImageUrl =
      spotifyPlaylist.images && spotifyPlaylist.images.length > 0
        ? spotifyPlaylist.images[0].url
        : "https://misc.scdn.co/liked-songs/liked-songs-640.png"; // Spotify default playlist icon

    // Search for tracks and collect Spotify URIs
    const trackUris: string[] = [];
    const foundTracks: any[] = [];

    for (const track of args.tracks) {
      try {
        const spotifyTrack = await ctx.runAction(api.spotify.searchSpotifyTrack, {
          trackName: track.name,
          artistName: track.artist,
        });

        if (spotifyTrack) {
          trackUris.push(spotifyTrack.uri);
          foundTracks.push({
            ...track,
            spotifyId: spotifyTrack.id,
            previewUrl: spotifyTrack.preview_url,
            imageUrl: spotifyTrack.album?.images?.[0]?.url,
            duration: spotifyTrack.duration_ms,
          });
        }
      } catch (error) {
        console.error(`Failed to search for track: ${track.name} by ${track.artist}`, error);
      }
    }

    // Add tracks to playlist in batches (Spotify API limit is 100 tracks per request)
    if (trackUris.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < trackUris.length; i += batchSize) {
        const batch = trackUris.slice(i, i + batchSize);
        
        const addResponse = await fetch(`https://api.spotify.com/v1/playlists/${spotifyPlaylist.id}/tracks`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokens!.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: batch,
          }),
        });

        if (!addResponse.ok) {
          console.error("Failed to add tracks to Spotify playlist");
        }
      }
    }

    // Update playlist in database with Spotify URL and image
    await ctx.runMutation(api.playlists.updatePlaylistSpotifyUrl, {
      playlistId: args.playlistId,
      spotifyUrl: spotifyPlaylist.external_urls.spotify,
      imageUrl: playlistImageUrl,
    });

    // Update tracks with Spotify metadata
    for (const track of foundTracks) {
      await ctx.runMutation(api.playlists.updateTrackSpotifyData, {
        playlistId: args.playlistId,
        trackName: track.name,
        trackArtist: track.artist,
        spotifyId: track.spotifyId || undefined,
        previewUrl: track.previewUrl || undefined,
        imageUrl: track.imageUrl || undefined,
        duration: track.duration || undefined,
      });
    }

    return {
      spotifyUrl: spotifyPlaylist.external_urls.spotify,
      tracksFound: foundTracks.length,
      totalTracks: args.tracks.length,
    };
  },
});

export const transferPlaylist = action({
  args: {
    playlistId: v.id("playlists"),
  },
  handler: async (ctx, args): Promise<{ spotifyUrl: string; tracksFound: number; totalTracks: number }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get Spotify tokens
    let tokens = await ctx.runQuery(api.spotify.getSpotifyTokens);
    if (!tokens) {
      throw new Error("Spotify not connected. Please connect your Spotify account first.");
    }

    // Check if token needs refresh
    if (Date.now() >= tokens.expiresAt) {
      await ctx.runAction(api.spotify.refreshSpotifyToken);
      tokens = await ctx.runQuery(api.spotify.getSpotifyTokens);
    }

    // Get playlist and tracks from database
    const playlistData = await ctx.runQuery(api.playlists.getPlaylistWithTracks, {
      playlistId: args.playlistId,
    });

    if (!playlistData) {
      throw new Error("Playlist not found");
    }

    const { playlist, tracks } = playlistData;

    // Check if playlist already exists on Spotify
    if (playlist.spotifyUrl) {
      throw new Error("Playlist has already been transferred to Spotify");
    }

    // Create playlist on Spotify
    const createResponse = await fetch(`https://api.spotify.com/v1/users/${tokens!.spotifyUserId}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokens!.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playlist.name,
        description: playlist.description || `Generated from: "${playlist.query}"`,
        public: false,
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      throw new Error(`Failed to create Spotify playlist: ${error}`);
    }

    const spotifyPlaylist = await createResponse.json();

    // Get the playlist image from Spotify (use the first image or a default)
    const playlistImageUrl =
      spotifyPlaylist.images && spotifyPlaylist.images.length > 0
        ? spotifyPlaylist.images[0].url
        : "https://misc.scdn.co/liked-songs/liked-songs-640.png"; // Spotify default playlist icon

    // Search for tracks and collect Spotify URIs
    const trackUris: string[] = [];
    const foundTracks: any[] = [];
    const notFoundTracks: any[] = [];

    for (const track of tracks) {
      try {
        // Check if track already has Spotify data
        if (track.spotifyId) {
          trackUris.push(`spotify:track:${track.spotifyId}`);
          foundTracks.push(track);
          continue;
        }

        // Search for track on Spotify
        const spotifyTrack = await ctx.runAction(api.spotify.searchSpotifyTrack, {
          trackName: track.name,
          artistName: track.artist,
        });

        if (spotifyTrack) {
          trackUris.push(spotifyTrack.uri);
          foundTracks.push({
            ...track,
            spotifyId: spotifyTrack.id,
            previewUrl: spotifyTrack.preview_url,
            imageUrl: spotifyTrack.album?.images?.[0]?.url,
            duration: spotifyTrack.duration_ms,
          });
        } else {
          notFoundTracks.push(track);
          console.warn(`Track not found on Spotify: ${track.name} by ${track.artist}`);
        }
      } catch (error) {
        notFoundTracks.push(track);
        console.error(`Failed to search for track: ${track.name} by ${track.artist}`, error);
      }
    }

    // Add tracks to playlist in batches (Spotify API limit is 100 tracks per request)
    if (trackUris.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < trackUris.length; i += batchSize) {
        const batch = trackUris.slice(i, i + batchSize);
        
        const addResponse = await fetch(`https://api.spotify.com/v1/playlists/${spotifyPlaylist.id}/tracks`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokens!.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: batch,
          }),
        });

        if (!addResponse.ok) {
          const error = await addResponse.text();
          console.error(`Failed to add tracks to Spotify playlist: ${error}`);
        }
      }
    }

    // Log not found tracks (tracks that couldn't be found on Spotify)
    if (notFoundTracks.length > 0) {
      console.warn(`${notFoundTracks.length} tracks could not be found on Spotify and will be skipped`);
      notFoundTracks.forEach(track => {
        console.warn(`- ${track.name} by ${track.artist}`);
      });
    }

    // Update playlist in database with Spotify URL and image
    await ctx.runMutation(api.playlists.updatePlaylistSpotifyUrl, {
      playlistId: args.playlistId,
      spotifyUrl: spotifyPlaylist.external_urls.spotify,
      imageUrl: playlistImageUrl,
    });

    // Update tracks with Spotify metadata for newly found tracks
    for (const track of foundTracks) {
      if (track.spotifyId && !tracks.find(t => t._id === track._id && t.spotifyId)) {
        // Only update if it doesn't already have Spotify data
        await ctx.runMutation(api.playlists.updateTrackSpotifyData, {
          playlistId: args.playlistId,
          trackName: track.name,
          trackArtist: track.artist,
          spotifyId: track.spotifyId,
          previewUrl: track.previewUrl,
          imageUrl: track.imageUrl,
          duration: track.duration,
        });
      }
    }

    return {
      spotifyUrl: spotifyPlaylist.external_urls.spotify,
      tracksFound: foundTracks.length,
      totalTracks: tracks.length,
    };
  },
});

export const disconnectSpotify = mutation({
  args: {},
  handler: async (ctx) => {
    // console.log("API reached ")
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const tokens = await ctx.db
      .query("spotifyTokens")
      .withIndex("by_user", (q) => q.eq("userId", userId as any))
      .unique();

    if (tokens) {
      await ctx.db.delete(tokens._id);
    }
  },
});


export const deleteTracksFromPlaylist = mutation({
  args: {
    playlistId: v.id("playlists"),
    trackIds: v.array(v.id("tracks")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get all tracks for the playlist
    const tracks = await ctx.db
      .query("tracks")
      .withIndex("by_playlist", (q) => q.eq("playlistId", args.playlistId))
      .collect();

    let deletedCount = 0;

    for (const track of tracks) {
      if (args.trackIds.some(id => id === track._id)) {
        await ctx.db.delete(track._id);
        deletedCount++;
      }
    }

    return { deletedCount };
  },
});
