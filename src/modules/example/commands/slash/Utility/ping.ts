import { SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { SlashCommand } from "@/types";
import { ExtendedClient } from "@/structs/ExtendedClient";
export default {
  structure: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  options: {
    cooldown: 5000,
  },
  run: async (client: ExtendedClient, interaction: ChatInputCommandInteraction) => {
    await interaction.reply({
      content: "Pong! " + client.ws.ping,
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("utility:ping:test_arg_1:test_arg_2")
            .setLabel("Ping Button")
            .setStyle(ButtonStyle.Primary)
        )
      ]
    });
  },
} as SlashCommand;
