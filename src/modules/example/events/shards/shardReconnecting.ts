import { ExtendedClient } from "@/structs/ExtendedClient";
import { log } from "@/utils/Logger";
import { DiscordEvent } from "@/types";
export default {
    event: "shardReconnecting",
    run: async (client: ExtendedClient, shardId: number) => {
        log(`[Shard ${shardId}] Reconnecting.`, "info")
    }
} as DiscordEvent;
