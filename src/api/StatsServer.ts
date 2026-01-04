import express, { Express, Request, Response } from "express";
import cors from "cors";
import path from "path";
import { ClusterManager } from "discord-hybrid-sharding";
import { log } from "@/utils/Logger";
export class StatsServer {
  private app: Express;
  private manager: ClusterManager;
  private port: number;
  constructor(manager: ClusterManager) {
    this.manager = manager;
    this.app = express();
    this.port = parseInt(process.env.STATS_PORT || "3000", 10);
    this.config();
    this.routes();
  }
  private config() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, "public")));
  }
  private routes() {
    this.app.get("/api/stats", async (req: Request, res: Response) => {
      try {
        const stats = await this.getStats();
        res.json(stats);
      } catch (error) {
        log(`Error fetching stats: ${error}`, "err");
        res.status(500).json({ error: "Failed to fetch stats" });
      }
    });
    this.app.get(/(.*)/, (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "public", "index.html"));
    });
  }
  private async getStats() {
    const promises = [
      this.manager.broadcastEval((c) => c.guilds.cache.size),
      this.manager.broadcastEval((c) => c.users.cache.size), 
      this.manager.broadcastEval((c) => c.ws.ping),
      this.manager.broadcastEval((c) => process.memoryUsage().rss),
    ];
    const [guilds, users, pings, memory] = await Promise.all(promises);
    const totalGuilds = guilds.reduce((acc, count) => acc + count, 0);
    const totalUsers = users.reduce((acc, count) => acc + count, 0); 
    const avgPing = Math.round(
      pings.reduce((acc, ping) => acc + ping, 0) / pings.length
    );
    const totalMemory = memory.reduce((acc, mem) => acc + mem, 0);
    return {
      guilds: totalGuilds,
      users: totalUsers,
      clusters: this.manager.totalClusters,
      shards: this.manager.totalShards,
      ping: avgPing,
      memory: (totalMemory / 1024 / 1024).toFixed(2) + " MB", 
      uptime: process.uptime(), 
    };
  }
  public start() {
    this.app.listen(this.port, () => {
      log(`Stats Dashboard running at http://localhost:${this.port}`, "done");
    });
  }
}
