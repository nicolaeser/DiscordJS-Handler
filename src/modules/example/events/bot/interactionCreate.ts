import { Interaction, ChatInputCommandInteraction, ContextMenuCommandInteraction, MessageFlags } from "discord.js";
import { ExtendedClient } from "@/structs/ExtendedClient";
import { DiscordEvent } from "@/types";
import { log } from "@/utils/Logger";
import { logErrorToWebhook } from "@/utils/WebhookLogger";
import { MiddlewareContext } from "@/structs/MiddlewareManager";
export default {
  event: "interactionCreate",
  run: async (client: ExtendedClient, interaction: Interaction) => {
    if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;
    const command = client.collection.interactioncommands.get(interaction.commandName);
    if (!command) return;
    try {
      const context: MiddlewareContext = {
          client,
          interaction,
          command
      };
      const result = await client.middleware.execute(context);
      if (!result.next) {
          if (result.message) {
              await interaction.reply({
                  content: result.message,
                  flags: [MessageFlags.Ephemeral]
              });
          }
          return;
      }
      await command.run(client, interaction);
    } catch (error) {
      log(String(error), "err");
      await logErrorToWebhook(error, `Command: ${interaction.commandName} | User: ${interaction.user.tag} (${interaction.user.id})`);
    }
  },
} as DiscordEvent;
