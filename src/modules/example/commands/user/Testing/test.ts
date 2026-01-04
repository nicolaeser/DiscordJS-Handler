import { ContextMenuCommandBuilder, UserContextMenuCommandInteraction, ApplicationCommandType } from "discord.js";
import { SlashCommand } from "@/types";
import { ExtendedClient } from "@/structs/ExtendedClient";
export default {
  structure: new ContextMenuCommandBuilder()
    .setName("Test User command")
    .setType(ApplicationCommandType.User),
  run: async (client: ExtendedClient, interaction: UserContextMenuCommandInteraction) => {
    await interaction.reply({
      content: "Hello user context command!",
    });
  },
} as SlashCommand;
