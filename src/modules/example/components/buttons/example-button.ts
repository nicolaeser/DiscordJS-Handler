import { ButtonInteraction, MessageFlags } from "discord.js";
import { Component } from "@/types";
import { ExtendedClient } from "@/structs/ExtendedClient";
export default {
  customId: "example:button",
  type: "BUTTON",
  run: async (client: ExtendedClient, interaction: ButtonInteraction) => {
    await interaction.reply({
      content: "The button has been successfully responded!",
      flags: [MessageFlags.Ephemeral],
    });
  },
} as Component;
