import fs from "fs";
import path from "path";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import type { ExtendedClient } from "@/structs/ExtendedClient";
import { ModuleConfig, DiscordEvent, SlashCommand, PrefixCommand, Component } from "@/types";
import { log } from "@/utils/Logger";
export class ModuleLoader {
  private client: ExtendedClient;
  private modulesPath: string;
  constructor(client: ExtendedClient) {
    this.client = client;
    this.modulesPath = path.join(__dirname, "..", "modules");
  }
  public async loadModules() {
    if (!fs.existsSync(this.modulesPath)) return;
    const modules = fs.readdirSync(this.modulesPath);
    for (const moduleName of modules) {
      const modulePath = path.join(this.modulesPath, moduleName);
      const configPath = path.join(modulePath, "module.json");
      if (!fs.existsSync(configPath)) continue;
      try {
        const moduleConfig: ModuleConfig = require(configPath);
        if (moduleConfig.state.load) {
          await this.loadModule(moduleName, moduleConfig);
          log(
            `${moduleConfig.name} is loaded (Author: ${moduleConfig.author} | v${moduleConfig.version}).`,
            "done"
          );
        } else {
          log(
            `${moduleConfig.name} is currently deactivated (Author: ${moduleConfig.author} | v${moduleConfig.version}).`,
            "info"
          );
        }
      } catch (e) {
        log(`Failed to load module ${moduleName}: ${e}`, "err");
      }
    }
    if (process.env.DEPLOY === "yes") {
      await this.deployCommands();
    }
  }
  private async loadModule(moduleName: string, config: ModuleConfig) {
    const modulePath = path.join(this.modulesPath, moduleName);
    if (config.state.event) {
      await this.loadEvents(path.join(modulePath, "events"));
    }
    if (config.state.commands) {
      await this.loadCommands(path.join(modulePath, "commands"));
    }
    if (config.state.components) {
      await this.loadComponents(path.join(modulePath, "components"));
    }
  }
  private async loadEvents(eventsPath: string) {
    if (!fs.existsSync(eventsPath)) return;
    const dirs = fs.readdirSync(eventsPath);
    for (const dir of dirs) {
        const dirPath = path.join(eventsPath, dir);
        if(!fs.statSync(dirPath).isDirectory()) continue;
        const files = fs.readdirSync(dirPath).filter(this.isScriptFile);
        for (const file of files) {
            const eventPath = path.join(dirPath, file);
            const { default: event }: { default: DiscordEvent } = require(eventPath);
            if (!event || !event.event || !event.run) {
                log(`Unable to load event ${dir}/${file}: missing export default or properties.`, "warn");
                continue;
            }
            if (event.once) {
                this.client.once(event.event, (...args) => event.run(this.client, ...args));
            } else {
                this.client.on(event.event, (...args) => event.run(this.client, ...args));
            }
            log(`Loaded event: ${dir}/${file}`, "info");
        }
    }
  }
  private async loadCommands(commandsPath: string) {
    if (!fs.existsSync(commandsPath)) return;
    const types = fs.readdirSync(commandsPath); 
    for (const type of types) {
        const typePath = path.join(commandsPath, type);
        if(!fs.statSync(typePath).isDirectory()) continue;
        const dirs = fs.readdirSync(typePath);
        for(const dir of dirs) {
            const dirPath = path.join(typePath, dir);
            if(!fs.statSync(dirPath).isDirectory()) continue;
            const files = fs.readdirSync(dirPath).filter(this.isScriptFile);
            for(const file of files) {
                const commandPath = path.join(dirPath, file);
                const { default: command } = require(commandPath);
                if(!command) continue;
                if (type === "prefix") {
                    const cmd = command as PrefixCommand;
                    if(!cmd.structure?.name || !cmd.run) {
                        log(`Invalid prefix command ${dir}/${file}`, "warn");
                        continue;
                    }
                    this.client.collection.prefixcommands.set(cmd.structure.name, cmd);
                    cmd.structure.aliases?.forEach(alias => {
                        this.client.collection.aliases.set(alias, cmd.structure.name);
                    });
                } else {
                    const cmd = command as SlashCommand;
                    if(!cmd.structure?.name || !cmd.run) {
                        log(`Invalid slash command ${dir}/${file}`, "warn");
                        continue;
                    }
                    this.client.collection.interactioncommands.set(cmd.structure.name, cmd);
                    this.client.applicationcommandsArray.push(cmd.structure);
                }
                log(`Loaded command: ${type}/${file}`, "info");
            }
        }
    }
  }
  private async loadComponents(componentsPath: string) {
    if (!fs.existsSync(componentsPath)) return;
    const dirs = fs.readdirSync(componentsPath); 
    for (const dir of dirs) {
        const dirPath = path.join(componentsPath, dir);
        if(!fs.statSync(dirPath).isDirectory()) continue;
        const files = fs.readdirSync(dirPath).filter(this.isScriptFile);
        for(const file of files) {
            const componentPath = path.join(dirPath, file);
            const { default: component } = require(componentPath);
            if(!component || !component.customId || !component.run) {
                log(`Invalid component ${dir}/${file}`, "warn");
                continue;
            }
            const comp = component as Component;
            if (dir === "buttons") {
                this.client.collection.components.buttons.set(comp.customId, comp);
            } else if (dir === "selects") {
                this.client.collection.components.selects.set(comp.customId, comp);
            } else if (dir === "modals") {
                this.client.collection.components.modals.set(comp.customId, comp);
            }
            log(`Loaded component: ${dir}/${file}`, "info");
        }
    }
  }
  public async deployCommands() {
    const token = process.env.DISCORD_BOT_TOKEN;
    const clientId = process.env.DISCORD_BOT_ID;
    const guildId = process.env.GUILD_ID;
    if (!token || !clientId) {
        log("Cannot deploy commands: Missing DISCORD_BOT_TOKEN or DISCORD_BOT_ID", "err");
        return;
    }
    const rest = new REST({ version: "10" }).setToken(token);
    try {
      log("Started loading application commands... (this might take minutes!)", "info");
      await rest.put(
        guildId
          ? Routes.applicationGuildCommands(clientId, guildId)
          : Routes.applicationCommands(clientId),
        { body: this.client.applicationcommandsArray }
      );
      log("Successfully loaded application commands to Discord API.", "done");
    } catch (e) {
      log(`Unable to load application commands to Discord API: ${e}`, "err");
    }
  }
  private isScriptFile(file: string): boolean {
    return (file.endsWith(".js") || file.endsWith(".ts")) && !file.endsWith(".d.ts");
  }
}
