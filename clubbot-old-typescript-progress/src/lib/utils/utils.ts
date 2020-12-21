import BotConfig from "../../types/BotConfig";
import configShape from "../../types/configShape";
import ow from "ow";
import Command from "../../types/Command";
import Client from "./Client";

const client = new Client();

export function configLoader(): () => BotConfig {
    let cachedConfig: BotConfig;
  
    return loadConfig;
  
    function loadConfig(): BotConfig {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const config = cachedConfig ?? require("../../../config.json");
      if (!cachedConfig) {
        ow(config, configShape);
        cachedConfig = config;
      }
  
      return config;
    }
  }

export type LookupResult = [string, Command];

export function lookupCommand(client: Client, cmdName: string): LookupResult | void {
  const potentialCmd = client.commands.get(cmdName);

  if (potentialCmd) return [cmdName, potentialCmd];

  const aliasCmd = [...client.commands.entries()].find(([_cName, cmd]) => cmd.aliases && cmd.aliases.includes(cmdName));

  return aliasCmd;
}