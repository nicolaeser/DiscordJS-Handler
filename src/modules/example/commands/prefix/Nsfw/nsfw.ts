import { Message } from "discord.js";
import { PrefixCommand } from "@/types";
import { ExtendedClient } from "@/structs/ExtendedClient";
export default {
  structure: {
    name: "nsfw",
    description: "Nsfw Command",
    aliases: ["ns"],
    permissions: ["SendMessages"],
    cooldown: 5000,
    nsfw: true,
  },
  run: async (client: ExtendedClient, message: Message, args: string[]) => {
    await message.reply({
      content: "NSFW Command",
    });
  },
} as PrefixCommand;
