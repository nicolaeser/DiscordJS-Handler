import { ButtonInteraction, MessageFlags } from "discord.js";
import { Component } from "@/types";
import { ExtendedClient } from "@/structs/ExtendedClient";
export default {
  customId: "utility:ping",
  type: "BUTTON",
  run: async (client: ExtendedClient, interaction: ButtonInteraction, args: string[]) => {
    console.log(args);
    await interaction.reply({
      content: `The ping button has been successfully responded! Args: ${args.join(", ")}`,
      flags: [MessageFlags.Ephemeral],
    });
  },
} as Component;
