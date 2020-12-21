import { Message } from "discord.js";
import { configLoader } from "../lib/utils/utils";
import Command from "../types/Command";
import { lookupCommand } from "../lib/utils/utils";
import Client from "../lib/utils/Client";

const getConfig = configLoader();

const message = async (client: Client, message: Message) => {
    let runningCmdName: string;

  try {
    const { prefix } = getConfig();

    let { content, author } = message;
    content = content.toLowerCase();

    if (author.bot || !content.startsWith(prefix)) return;

    const [cmdName, ...args] = content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);

    const lookupRes = lookupCommand(client, cmdName);

    if (!lookupRes) return;

    let command: Command;
    [runningCmdName, command] = lookupRes;

    await command.exec(client, message, args);
  } catch (err) {
    console.error("An error occurred on the message event.\n", err);
    if (runningCmdName) console.debug(`The command running at the time was ${runningCmdName}.`);
  }
}

export = message;