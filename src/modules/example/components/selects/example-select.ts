import { AnySelectMenuInteraction, MessageFlags } from "discord.js";
import { Component } from "@/types";
import { ExtendedClient } from "@/structs/ExtendedClient";
export default {
  customId: "example:select",
  type: "SELECT",
  run: async (client: ExtendedClient, interaction: AnySelectMenuInteraction) => {
    const value = interaction.values[0];
    await interaction.reply({
      content: `You have selected from the menu: **${value}**`,
      flags: [MessageFlags.Ephemeral],
    });
  },
} as Component;
