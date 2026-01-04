import { ModalSubmitInteraction, MessageFlags } from "discord.js";
import { Component } from "@/types";
import { ExtendedClient } from "@/structs/ExtendedClient";
export default {
  customId: "example:modal",
  type: "MODAL",
  run: async (client: ExtendedClient, interaction: ModalSubmitInteraction) => {
    await interaction.reply({
      content: `Your Name is: **${interaction.fields.getTextInputValue("example:modal:name")}**`,
      flags: [MessageFlags.Ephemeral],
    });
  },
} as Component;
