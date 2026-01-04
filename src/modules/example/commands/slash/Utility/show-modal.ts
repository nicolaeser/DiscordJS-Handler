import { ChatInputCommandInteraction, SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalActionRowComponentBuilder } from "discord.js";
import { SlashCommand } from "@/types";
import { ExtendedClient } from "@/structs/ExtendedClient";
export default {
  structure: new SlashCommandBuilder()
    .setName("show-modal")
    .setDescription("Modal interaction testing."),
  run: async (client: ExtendedClient, interaction: ChatInputCommandInteraction) => {
    const modal = new ModalBuilder()
      .setTitle("Modal Example")
      .setCustomId("example:modal");

    const nameInput = new TextInputBuilder()
      .setLabel("What's your name?")
      .setCustomId("example:modal:name")
      .setPlaceholder("Type your name here!")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(nameInput);

    modal.setComponents(firstActionRow);

    await interaction.showModal(modal);
  },
} as SlashCommand;
