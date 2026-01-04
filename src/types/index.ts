import {
  ChatInputCommandInteraction,
  Client,
  Message,
  PermissionResolvable,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  ButtonInteraction,
  AnySelectMenuInteraction,
  ModalSubmitInteraction,
  Interaction,
  ContextMenuCommandBuilder,
} from "discord.js";
import type { ExtendedClient } from "@/structs/ExtendedClient";
export interface ModuleConfig {
  name: string;
  version: string;
  author: string;
  state: {
    load: boolean;
    event: boolean;
    commands: boolean;
    components: boolean;
  };
}
export interface RunOptions {
  client: ExtendedClient;
  interaction?: ChatInputCommandInteraction;
  message?: Message;
  args?: string[];
}
export type CommandRunFunction = (
  client: ExtendedClient,
  interaction: ChatInputCommandInteraction | any 
) => Promise<any>;
export type PrefixCommandRunFunction = (
  client: ExtendedClient,
  message: Message,
  args: string[]
) => Promise<any>;
export type ComponentRunFunction = (
  client: ExtendedClient,
  interaction: ButtonInteraction | AnySelectMenuInteraction | ModalSubmitInteraction,
  args: string[]
) => Promise<any>;
export interface CommandOptions {
  cooldown?: number;
  developers?: boolean;
  nsfw?: boolean;
}
export interface SlashCommand {
  structure:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    | ContextMenuCommandBuilder;
  options?: CommandOptions;
  run: CommandRunFunction;
}
export interface PrefixCommand {
  structure: {
    name: string;
    description: string;
    aliases?: string[];
    permissions?: PermissionResolvable[];
    ownerOnly?: boolean;
    nsfw?: boolean;
    cooldown?: number; 
  };
  options?: CommandOptions;
  run: PrefixCommandRunFunction;
}
export interface DiscordEvent {
  event: string;
  once?: boolean;
  run: (client: ExtendedClient, ...args: any[]) => Promise<any>;
}
export interface Component {
  customId: string;
  type: "BUTTON" | "SELECT" | "MODAL";
  run: ComponentRunFunction;
}
