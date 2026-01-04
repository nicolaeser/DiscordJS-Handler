import { Interaction } from "discord.js";
import { ExtendedClient } from "@/structs/ExtendedClient";
import { DiscordEvent, Component } from "@/types";
import { log } from "@/utils/Logger";

async function findComponent(
  collection: Map<string, Component>,
  customId: string
): Promise<{ component: Component | undefined; values: string[] }> {
  if (collection.has(customId)) {
    return { component: collection.get(customId), values: [] };
  }
  const parts = customId.split(":");
  for (let i = parts.length - 1; i >= 0; i--) {
    const key = parts.slice(0, i + 1).join(":");
    if (collection.has(key)) {
      return { component: collection.get(key), values: parts.slice(i + 1) };
    }
  }
  return { component: undefined, values: [] };
}

export default {
  event: "interactionCreate",
  run: async (client: ExtendedClient, interaction: Interaction) => {
    if (interaction.isButton()) {
      const { component, values } = await findComponent(
        client.collection.components.buttons,
        interaction.customId
      );
      if (!component) return;
      try {
        await component.run(client, interaction, values);
      } catch (error) {
        log(String(error), "err");
      }
      return;
    }
    if (interaction.isAnySelectMenu()) {
      const { component, values } = await findComponent(
        client.collection.components.selects,
        interaction.customId
      );
      if (!component) return;
      try {
        await component.run(client, interaction, values);
      } catch (error) {
        log(String(error), "err");
      }
      return;
    }
    if (interaction.isModalSubmit()) {
      const { component, values } = await findComponent(
        client.collection.components.modals,
        interaction.customId
      );
      if (!component) return;
      try {
        await component.run(client, interaction, values);
      } catch (error) {
        log(String(error), "err");
      }
      return;
    }
  },
} as DiscordEvent;
