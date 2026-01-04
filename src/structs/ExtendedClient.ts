import { Client, Collection, GatewayIntentBits, Partials, ClientOptions } from "discord.js";
import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import NodeCache from "node-cache";
import { SlashCommand, PrefixCommand, Component } from "@/types";
import { ModuleLoader } from "@/handlers/ModuleLoader";
import { log } from "@/utils/Logger";
import { MiddlewareManager } from "@/structs/MiddlewareManager";
import { OwnerOnlyMiddleware, NsfwMiddleware, CooldownMiddleware, PermissionsMiddleware } from "@/middlewares/StandardMiddlewares";
export class ExtendedClient extends Client {
  public cluster: ClusterClient<ExtendedClient>;
  public middleware: MiddlewareManager;
  public collection = {
    interactioncommands: new Collection<string, SlashCommand>(),
    prefixcommands: new Collection<string, PrefixCommand>(),
    aliases: new Collection<string, string>(),
    components: {
      buttons: new Collection<string, Component>(),
      selects: new Collection<string, Component>(),
      modals: new Collection<string, Component>(),
    },
    exampleCache: new NodeCache({
      stdTTL: 60,
      checkperiod: 3,
      deleteOnExpire: true,
    }),
  };
  public applicationcommandsArray: any[] = [];
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.AutoModerationExecution,
      ],
      partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction,
      ],
      shards: getInfo().SHARD_LIST,
      shardCount: getInfo().TOTAL_SHARDS,
      presence: {
        activities: [
          {
            name: "Hello",
            type: 4,
            state: "Starting...",
          },
        ],
      },
    });
    this.cluster = new ClusterClient(this);
    this.middleware = new MiddlewareManager();
    this.middleware.use(PermissionsMiddleware);
    this.middleware.use(OwnerOnlyMiddleware);
    this.middleware.use(NsfwMiddleware);
    this.middleware.use(CooldownMiddleware);
  }
  public async start() {
    const loader = new ModuleLoader(this);
    await loader.loadModules();
    if (process.env.DISCORD_BOT_TOKEN) {
        await this.login(process.env.DISCORD_BOT_TOKEN);
    } else {
        log("No DISCORD_BOT_TOKEN found in environment variables.", "err");
    }
  }
}
