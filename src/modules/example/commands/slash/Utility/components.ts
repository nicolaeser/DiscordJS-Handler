import { ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, ButtonStyle } from "discord.js";
import { SlashCommand } from "@/types";
import { ExtendedClient } from "@/structs/ExtendedClient";
export default {
  structure: new SlashCommandBuilder()
    .setName("components")
    .setDescription("Test the components handler."),
  run: async (client: ExtendedClient, interaction: ChatInputCommandInteraction) => {
    await interaction.reply({
      content: "Select one of the components below.",
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("example:button")
            .setLabel("Example Button")
            .setStyle(ButtonStyle.Primary),
        ),
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("example:select")
            .setPlaceholder("Example Select menu")
            .addOptions(
              { label: "Option 1", value: "option 1" },
              { label: "Option 2", value: "option 2" },
              { label: "Option 3", value: "option 3" },
            ),
        ),
      ],
    });
  },
} as SlashCommand;
