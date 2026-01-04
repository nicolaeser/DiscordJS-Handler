import { ExtendedClient } from "@/structs/ExtendedClient";
import { log } from "@/utils/Logger";
import { DiscordEvent } from "@/types";
export default {
    event: "shardError",
    run: async (client: ExtendedClient, error: Error, shardId: number) => {
        log(`[Shard ${shardId}] Error. ${error}`, "err")
    }
} as DiscordEvent;
