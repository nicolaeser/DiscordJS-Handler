import { CloseEvent } from "discord.js";
import { ExtendedClient } from "@/structs/ExtendedClient";
import { log } from "@/utils/Logger";
import { DiscordEvent } from "@/types";
export default {
    event: "shardDisconnect",
    run: async (client: ExtendedClient, closeEvent: CloseEvent, shardId: number) => {
        log(`[Shard ${shardId}] Disconnected. ${closeEvent}`, "err")
    }
} as DiscordEvent;
