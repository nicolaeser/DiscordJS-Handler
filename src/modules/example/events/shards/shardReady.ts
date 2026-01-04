import { Snowflake } from "discord.js";
import { ExtendedClient } from "@/structs/ExtendedClient";
import { log } from "@/utils/Logger";
import { DiscordEvent } from "@/types";
export default {
    event: "shardReady",
    run: async (client: ExtendedClient, shardId: number, unavailableGuilds: Set<Snowflake> | undefined) => {
        log(`[Shard ${shardId}] Ready. Unaivailable Guilds: ${unavailableGuilds}`, "done")
    }
} as DiscordEvent;
