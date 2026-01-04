import { ChannelType, Message } from "discord.js";
import { ExtendedClient } from "@/structs/ExtendedClient";
import { DiscordEvent } from "@/types";
import { log } from "@/utils/Logger";
import { logErrorToWebhook } from "@/utils/WebhookLogger";
import { MiddlewareContext } from "@/structs/MiddlewareManager";
export default {
  event: "messageCreate",
  run: async (client: ExtendedClient, message: Message) => {
    if (message.author.bot || message.channel.type === ChannelType.DM) return;
    const prefix = process.env.PREFIX || "!";
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandInput = args.shift()?.toLowerCase();
    if (!commandInput) return;
    const command =
      client.collection.prefixcommands.get(commandInput) ||
      client.collection.prefixcommands.get(
        client.collection.aliases.get(commandInput) || ""
      );
    if (command) {
      try {
        const context: MiddlewareContext = {
            client,
            message,
            command,
            args
        };
        const result = await client.middleware.execute(context);
        if (!result.next) {
            if (result.message) {
                await message.reply({
                    content: result.message,
                });
            }
            return;
        }
        await command.run(client, message, args);
      } catch (error) {
        log(String(error), "err");
        await logErrorToWebhook(error, `Prefix Command: ${commandInput} | User: ${message.author.tag} (${message.author.id})`);
      }
    }
  },
} as DiscordEvent;
