import Client from "./Client";
import { configLoader } from "../utils/utils";
import { extname, join, relative } from "path";
import Command from "../../types/Command";
import commandShape from "../../types/commandShape";
import { scan } from "fs-nextra";
import ow from "ow";
import mongoose from "mongoose";

const client = new Client();
const getConfig = configLoader();
const CMD_DIR = join(__dirname, "../../commands");
const EVT_DIR = join(__dirname, "../../events");
const commands = new Map<string, Command>();

export type Listener = (client: Client) => Client;

const clanbot = async () => {
      try {
        //loaders
        loadEvents();
        loadCommands();
        loadDatabase();

        } catch (err) {
          console.error("An error occurred while bootstrapping.\n", err);
          console.warn("Shutting down...");
          client.destroy();
          process.exit(1);
        }

    await client.login(getConfig().token);
}

async function loadEvents() : Promise<void> {
  const config = getConfig();
        console.info("Querying events directory...");
        const files = await scan(EVT_DIR, {
          filter: (stats, path) => stats.isFile() && extname(path) === ".js",
        });
        console.log("Queried events directory!");
    
        console.info("Registering events...");
        await Promise.all([...files.keys()]
          .map(async loc => {
            const evtName: any = relative(EVT_DIR, loc).slice(0, -3);
    
            if (evtName.startsWith("_")) return;
    
            const fileObj = await import(loc);
            if (!fileObj.default) console.warn(`The event ${evtName} with no default export was provided!`);
            const evt = fileObj.default as Listener;
    
            client.on(evtName, evt.bind(null, client));
    
            console.debug(`Registered event ${evtName}.`);
}));

}

async function loadCommands() : Promise<void> {
  const config = getConfig();
  console.info("Querying commands directory...");
  const files = await scan(CMD_DIR, {
    filter: (stats, path) => stats.isFile() && extname(path) === ".js",
  });
  console.log("Queried commands directory!");

  console.info("Registering commands...");
  await Promise.all([...files.keys()]
    .map(async loc => {
      const cmdName = relative(CMD_DIR, loc).slice(0, -3);

      if (cmdName.startsWith("_")) return;

      const fileObj = await import(loc);
      if (!fileObj.default) console.warn(`The command ${cmdName} with no default export was provided!`);
      const cmd = fileObj.default as Command;

      ow(cmd, commandShape);

      client.commands.set(cmdName, cmd);
      console.debug(`Registered command ${cmdName}.`);
    }));
}

async function loadDatabase() : Promise<void> {
  const db = mongoose.connection;

  await mongoose.connect('mongodb://localhost:27017/clanbot', {useNewUrlParser: true, useUnifiedTopology: true});

  db.on("open", () => console.log("The database has been succesfully opened!"));

}

clanbot();

export default clanbot;