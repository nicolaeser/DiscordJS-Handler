import { ExtendedClient } from "@/structs/ExtendedClient";
import { log } from "@/utils/Logger";
import { DiscordEvent } from "@/types";
export default {
    event: "shardResume",
    run: async (client: ExtendedClient, shardId: number, replayedEvents: number) => {
        log(`[Shard ${shardId}] Resumed. ${replayedEvents}`, "info")
    }
} as DiscordEvent;
