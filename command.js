import { Command } from "commander";
import redisConfig from "./redisConfig.js";

export async function proxy_command() {

    const program = new Command();
    program
      .option("-p, --port <number>", "specify the port number of your cache server")
      .option("-o, --origin <url>", "specify the server to request")
      .option("-c, --clear-cache", "clear the cache")
    
    program.parse()
    const options = program.opts();
    
    if (options.clearCache) {
      await redisConfig.flushDb()
      console.log("Cache cleared")
    }
    
    const PORT = options.port || 3000;
    let server_url = options.origin;
    if (!server_url.startsWith("https://") && !server_url.startsWith("http://")) {
      server_url = "https://" + server_url;
    }
    return {PORT, server_url}
}