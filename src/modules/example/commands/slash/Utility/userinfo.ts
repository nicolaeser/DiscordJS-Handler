import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "@/types";
import { ExtendedClient } from "@/structs/ExtendedClient";
import { time } from "@/utils/Time";
export default {
  structure: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get a user's information.")
    .addUserOption((opt) =>
      opt.setName("user").setDescription("The user.").setRequired(false),
    ),
  run: async (client: ExtendedClient, interaction: ChatInputCommandInteraction) => {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = interaction.guild?.members.cache.get(user.id);
    if (!member) {
      await interaction.reply({
        content: "That user is not on the guild.",
      });
      return;
    }
    const roles: string[] = [];
    if (member.roles)
      member.roles.cache.forEach((role) => {
        if (role.id !== interaction.guild?.roles.everyone.id)
          roles.push(`${role.toString()}`);
      });
    const joinedServer = member.joinedTimestamp
      ? `${time(member.joinedTimestamp, "d")} (${time(member.joinedTimestamp, "R")})` 
      : "N/A";
    const usernameStr = `**Username**: ${user.username}`;
    const displayNameStr = `**Display name**: ${member.nickname || user.displayName}`;
    const idStr = `**ID**: ${user.id}`;
    const joinedDiscordStr = `**Joined Discord**: ${time(user.createdTimestamp, "d")} (${time(user.createdTimestamp, "R")})`;
    const joinedServerStr = `**Joined server**: ${joinedServer}`;
    const rolesStr = `**Roles** [${member.roles?.cache?.size - 1}]: ${roles.join(", ")}`;
    const voiceStr = `**In a voice channel?**: ${member.voice.channel ? "Yes" : "No"}`;
    const ownerStr = `**Guild owner?**: ${interaction.guild?.ownerId === user.id ? "Yes" : "No"}`;
    const timeoutStr = `**Timed out?**: ${member.communicationDisabledUntilTimestamp ? "Yes" : "No"}`;
    const arr = [
      usernameStr,
      displayNameStr,
      idStr,
      joinedDiscordStr,
      joinedServerStr,
      rolesStr,
      voiceStr,
      ownerStr,
      timeoutStr,
    ];
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("User info - " + user.username)
          .setThumbnail(member.displayAvatarURL())
          .setDescription(arr.join("\n"))
          .setColor("Blurple"),
      ],
    });
  },
} as SlashCommand;