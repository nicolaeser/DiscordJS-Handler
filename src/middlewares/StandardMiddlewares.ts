import { MiddlewareFunction } from "@/structs/MiddlewareManager";
import redis from "@/lib/redis";
import { PermissionResolvable } from "discord.js";
export const PermissionsMiddleware: MiddlewareFunction = async (context) => {
    const permissions = context.command.structure.permissions as PermissionResolvable[];
    if (permissions && context.message && context.message.member) {
        if (!context.message.member.permissions.has(permissions)) {
            return { next: false, message: "You do not have the permission to use this command." };
        }
    }
    return { next: true };
};
export const OwnerOnlyMiddleware: MiddlewareFunction = async (context) => {
    if (context.command.options?.developers || context.command.structure.ownerOnly) {
        const userId = context.interaction?.user.id || context.message?.author.id;
        if (!userId) return { next: false, message: "Could not identify user." };
        if (process.env.OWNER_ID !== userId) {
            return { next: false, message: "You are not authorized to use this command." };
        }
    }
    return { next: true };
};
export const NsfwMiddleware: MiddlewareFunction = async (context) => {
    if (context.command.options?.nsfw || context.command.structure.nsfw) {
        const channel = context.interaction?.channel || context.message?.channel;
        if (channel && 'nsfw' in channel && !(channel as any).nsfw) {
            return { next: false, message: "The current channel is not a NSFW channel." };
        }
    }
    return { next: true };
};
export const CooldownMiddleware: MiddlewareFunction = async (context) => {
    const cooldownTime = context.command.options?.cooldown || context.command.structure.cooldown;
    if (cooldownTime) {
        const userId = context.interaction?.user.id || context.message?.author.id;
        const commandName = context.command.structure.name;
        if (!userId) return { next: false, message: "Could not identify user." };
        const key = `cooldown:${userId}:${commandName}`;
        const existingCooldown = await redis.get(key);
        if (existingCooldown) {
            const ttl = await redis.ttl(key);
            return { 
                next: false, 
                message: `Slow down! You can use this command again in ${ttl} seconds.` 
            };
        }
        await redis.setex(key, Math.floor(cooldownTime / 1000), "1");
    }
    return { next: true };
};
