import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } from "discord.js";
import { PrefixCommand } from "@/types";
import { ExtendedClient } from "@/structs/ExtendedClient";
export default {
  structure: {
    name: "ping",
    description: "Replies with Pong!",
    aliases: ["p"],
    cooldown: 5000,
  },
  run: async (client: ExtendedClient, message: Message, args: string[]) => {
    const action = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("ping:500:320:0004:500")
        .setLabel("Example Button")
        .setStyle(ButtonStyle.Primary)
    );
    await message.reply({
      content: "Pong! " + client.ws.ping,
      components: [action],
    });
  },
} as PrefixCommand;
