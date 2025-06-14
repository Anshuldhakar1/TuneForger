import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const getUserPlaylists = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    
    return await ctx.db
      .query("playlists")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getPlaylistWithTracks = query({
  args: { playlistId: v.id("playlists") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const playlist = await ctx.db.get(args.playlistId);
    if (!playlist || playlist.userId !== userId) {
      throw new Error("Playlist not found");
    }
    
    const tracks = await ctx.db
      .query("tracks")
      .withIndex("by_playlist", (q) => q.eq("playlistId", args.playlistId))
      .collect();
    
    return { playlist, tracks };
  },
});

export const generatePlaylist = action({
  args: {
    query: v.string(),
    playlistName: v.optional(v.string()),
    createOnSpotify: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<Id<"playlists">> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Generate playlist using AI with better JSON formatting
    const prompt = `You are a music expert creating a Spotify playlist. Based on this request: "${args.query}"

Generate a playlist of 15-20 songs that match this request unless explicitly provided an amount. For each song, provide:
- Song name
- Artist name
- Album name (if known)
- Brief reason why it fits the request

IMPORTANT: Respond ONLY with valid JSON in this exact format, no additional text:
[
  {
    "name": "Song Name",
    "artist": "Artist Name", 
    "album": "Album Name",
    "reasoning": "Why this song fits the request"
  }
]

Focus on popular, well-known songs that would be available on Spotify. Make the playlist cohesive and thoughtful.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Failed to generate playlist");
    }

    let songs;
    try {
      // Clean the response to ensure it's valid JSON
      const cleanedContent = content.trim();
      const jsonMatch = cleanedContent.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : cleanedContent;
      
      songs = JSON.parse(jsonString);
      
      if (!Array.isArray(songs) || songs.length === 0) {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response. Please try again.");
    }

    // Generate playlist name if not provided
    let playlistName = args.playlistName;
    if (!playlistName) {
      const namePrompt = `Create a creative, catchy playlist name for this request: "${args.query}". Return only the name, no quotes or extra text.`;
      const nameResponse = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [{ role: "user", content: namePrompt }],
        temperature: 0.8,
      });
      playlistName = nameResponse.choices[0].message.content?.trim() || "AI Generated Playlist";
    }

    // Create playlist in database
    const playlistId: Id<"playlists"> = await ctx.runMutation(api.playlists.createPlaylist, {
      name: playlistName,
      description: `Generated from: "${args.query}"`,
      query: args.query,
    });

    // Add tracks to playlist
    for (const song of songs) {
      if (song.name && song.artist) {
        await ctx.runMutation(api.playlists.addTrack, {
          playlistId,
          name: song.name,
          artist: song.artist,
          album: song.album || null,
          reasoning: song.reasoning || null,
        });
      }
    }

    // Create on Spotify if requested
    if (args.createOnSpotify) {
      try {
        const result = await ctx.runAction(api.spotify.createSpotifyPlaylist, {
          playlistId,
          name: playlistName,
          description: `Generated from: AI Playlist Generator`,
          tracks: songs,
        });
        console.log(`Spotify playlist created: ${result.tracksFound}/${result.totalTracks} tracks found`);
      } catch (error) {
        console.error("Failed to create Spotify playlist:", error);
        // Don't throw error here, just log it
      }
    }

    return playlistId;
  },
});

export const createPlaylist = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("playlists", {
      userId,
      name: args.name,
      description: args.description,
      query: args.query,
      createdAt: Date.now(),
    });
  },
});

export const updatePlaylistSpotifyUrl = mutation({
  args: {
    playlistId: v.id("playlists"),
    spotifyUrl: v.string(),
    imageUrl: v.optional(v.string()), // <-- Add this
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.playlistId, {
      spotifyUrl: args.spotifyUrl,
      ...(args.imageUrl ? { imageUrl: args.imageUrl } : {}),
    });
  },
});

export const updateTrackSpotifyData = mutation({
  args: {
    playlistId: v.id("playlists"),
    trackName: v.string(),
    trackArtist: v.string(),
    spotifyId: v.optional(v.string()),
    previewUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Find the track to update
    const tracks = await ctx.db
      .query("tracks")
      .withIndex("by_playlist", (q) => q.eq("playlistId", args.playlistId))
      .collect();

    const trackToUpdate = tracks.find(
      (track) => track.name === args.trackName && track.artist === args.trackArtist
    );

    if (!trackToUpdate) {
      throw new Error("Track not found");
    }

    // Update the track with only non-null values
    const updateData: any = {};
    if (args.spotifyId) updateData.spotifyId = args.spotifyId;
    if (args.previewUrl) updateData.previewUrl = args.previewUrl;
    if (args.imageUrl) updateData.imageUrl = args.imageUrl;
    if (args.duration !== undefined) updateData.duration = args.duration;

    await ctx.db.patch(trackToUpdate._id, updateData);
  },
});

export const addTrack = mutation({
  args: {
    playlistId: v.id("playlists"),
    name: v.string(),
    artist: v.string(),
    album: v.optional(v.string()),
    reasoning: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const playlist = await ctx.db.get(args.playlistId);
    if (!playlist || playlist.userId !== userId) {
      throw new Error("Playlist not found");
    }

    return await ctx.db.insert("tracks", {
      playlistId: args.playlistId,
      name: args.name,
      artist: args.artist,
      album: args.album,
      reasoning: args.reasoning,
    });
  },
});

export const deletePlaylist = mutation({
  args: { playlistId: v.id("playlists") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const playlist = await ctx.db.get(args.playlistId);
    if (!playlist || playlist.userId !== userId) {
      throw new Error("Playlist not found");
    }

    // Delete all tracks first
    const tracks = await ctx.db
      .query("tracks")
      .withIndex("by_playlist", (q) => q.eq("playlistId", args.playlistId))
      .collect();
    
    for (const track of tracks) {
      await ctx.db.delete(track._id);
    }

    // Delete playlist
    await ctx.db.delete(args.playlistId);
  },
});
