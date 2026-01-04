import { EmbedBuilder, WebhookClient } from "discord.js";
import { log } from "@/utils/Logger";
const webhookUrl = process.env.ERROR_WEBHOOK_URL;
export const logErrorToWebhook = async (error: any, context: string) => {
  if (!webhookUrl) return;
  try {
    const webhookClient = new WebhookClient({ url: webhookUrl });
    const embed = new EmbedBuilder()
      .setTitle("🚨 Error Occurred")
      .setDescription(`**Context:** ${context}\n` + "```js\n" + String(error).slice(0, 4000) + "\n```")
      .setColor("Red")
      .setTimestamp();
    await webhookClient.send({
      embeds: [embed],
    });
  } catch (webhookError) {
    log(`Failed to send error to webhook: ${webhookError}`, "err");
  }
};