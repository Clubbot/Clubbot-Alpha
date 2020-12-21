import Command from "../types/Command";
import { lookupCommand, LookupResult, configLoader } from "../lib/utils/utils";
import { join } from "path";

const getConfig = configLoader();

const reload: Command = {
    aliases: [],
    usage: "[command]",
    information: "Displays information on how to use the bot.",
    async exec(client, message, args) {
        if(message.author.id !== getConfig().ownerID) return message.channel.send("You don't have enough permissions to do that!");
        if(!args || args.length < 1) return message.reply("You didn't specify any command!");

        const cmdName = args[0].toLowerCase();
        const lookupRes = lookupCommand(client, cmdName) as LookupResult;

        let runningCmdName: string;

        let command: Command;
        [runningCmdName, command] = lookupRes;

        if(!client.commands.has(cmdName)) {
            return message.reply("This command doesn't exist!");
        }

    try {
        delete require.cache[require.resolve(join(__dirname, `${cmdName}`))];
        client.commands.delete(cmdName);
        const props = require(join(__dirname, `${cmdName}`));
        client.commands.set(cmdName, props);
    } catch(err) {
        console.error("There is an error!", err);
    }

    message.reply(`The command ${cmdName} has been reloaded`);

}
}

export = reload;