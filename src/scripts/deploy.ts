import "dotenv/config";
import { ModuleLoader } from "@/handlers/ModuleLoader";
import { log } from "@/utils/Logger";
const mockClient: any = {
  collection: {
    interactioncommands: new Map(),
    prefixcommands: new Map(),
    aliases: new Map(),
    components: {
      buttons: new Map(),
      selects: new Map(),
      modals: new Map(),
    },
  },
  applicationcommandsArray: [],
  on: () => {},
  once: () => {},
};
(async () => {
  try {
    log("Initializing deployment...", "info");
    process.env.DEPLOY = "no"; 
    const loader = new ModuleLoader(mockClient);
    await loader.loadModules();
    log(`Found ${mockClient.applicationcommandsArray.length} application commands to deploy.`, "info");
    await loader.deployCommands();
    log("Deployment script finished.", "done");
    process.exit(0);
  } catch (error) {
    log(`Deployment failed: ${error}`, "err");
    process.exit(1);
  }
})();
