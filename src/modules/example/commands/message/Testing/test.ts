import { ContextMenuCommandBuilder, MessageContextMenuCommandInteraction, ApplicationCommandType } from "discord.js";
import { SlashCommand } from "@/types";
import { ExtendedClient } from "@/structs/ExtendedClient";
export default {
  structure: new ContextMenuCommandBuilder()
    .setName("Test Message command")
    .setType(ApplicationCommandType.Message),
  run: async (client: ExtendedClient, interaction: MessageContextMenuCommandInteraction) => {
    await interaction.reply({
      content: "Hello message context command!",
    });
  },
} as SlashCommand;
