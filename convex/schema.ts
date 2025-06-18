import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  playlists: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.string(),
    query: v.string(),
    createdAt: v.number(),
    spotifyUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()), // <-- Add this line
  }).index("by_user", ["userId"]),
  
  tracks: defineTable({
    playlistId: v.id("playlists"),
    spotifyId: v.optional(v.string()),
    name: v.string(),
    artist: v.string(),
    album: v.optional(v.string()),
    duration: v.optional(v.number()),
    previewUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    reasoning: v.optional(v.string()),
  }).index("by_playlist", ["playlistId"]),

  spotifyTokens: defineTable({
    userId: v.id("users"),
    accessToken: v.string(),
    refreshToken: v.string(),
    expiresAt: v.number(),
    spotifyUserId: v.string(),
    spotifyDisplayName: v.optional(v.string()),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
