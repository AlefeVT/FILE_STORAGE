import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
})

export const createFile = mutation({
    args: {
        name: v.string(),
        fileId: v.id("_storage"),
        userId: v.string(),
    },
    async handler(ctx, args) {

        // throw new Error("Você não tem acesso");
        
        await ctx.db.insert('files', {
            name: args.name,
            userId: args.userId,
            fileId: args.fileId,
        })
    }
})

export const getFiles = query({
    args: {
        userId: v.string()
    },
    async handler(ctx, args) {
        return ctx.db.query('files').withIndex("by_userId", (q) => q.eq("userId", args.userId)).collect();
    }
})