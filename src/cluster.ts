import { ClusterManager, HeartbeatManager, ReClusterManager, messageType } from "discord-hybrid-sharding";
import path from "path";
import { log } from "@/utils/Logger";
import { StatsServer } from "@/api/StatsServer";
import "dotenv/config";
const scriptPath = path.join(__dirname, `index${path.extname(__filename)}`);
const manager = new ClusterManager(scriptPath, {
  totalShards: "auto", 
  shardsPerClusters: 2,
  totalClusters: "auto",
  mode: "process", 
  token: process.env.DISCORD_BOT_TOKEN,
});
manager.extend(
  new HeartbeatManager({
    interval: 2000, 
    maxMissedHeartbeats: 5, 
  })
);
if (process.env.STATS_ENABLED === "true") {
  const statsServer = new StatsServer(manager);
  statsServer.start();
} else {
  log("Stats Dashboard is disabled in .env (STATS_ENABLED=false)", "info");
}
manager.on("clusterCreate", (cluster) => {
  cluster.on("message", (message: any) => {
    if (message?._type !== messageType.CUSTOM_REQUEST) return; 
  });
  cluster.on("ready", () => {
    log(`[Cluster ${cluster.id + 1}] Cluster is ready.`, "done");
  });
  cluster.on("death", () => {
    log(`[Cluster ${cluster.id + 1}] Cluster has died.`, "done");
  });
});
manager.spawn({ timeout: -1 });
