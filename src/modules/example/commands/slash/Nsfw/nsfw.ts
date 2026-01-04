import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "@/types";
import { ExtendedClient } from "@/structs/ExtendedClient";
export default {
  structure: new SlashCommandBuilder()
    .setName("nsfw")
    .setDescription("Nsfw command."),
  options: {
    nsfw: true,
  },
  run: async (client: ExtendedClient, interaction: ChatInputCommandInteraction) => {
    await interaction.reply({ content: "NSFW Command!" });
  },
} as SlashCommand;
