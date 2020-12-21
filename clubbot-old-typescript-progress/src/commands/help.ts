import Command from "../types/Command";
import { MessageEmbed } from "discord.js";

const help: Command = {
    aliases: [],
    usage: "[command]",
    information: "Displays information on how to use the bot.",
    exec(_client, message, _args) {
        const embed = new MessageEmbed()
        .setTitle("Club Bot - Help")
        .setDescription("xxx")
        .setColor("#4EDDF9")
        .setImage("https://media.discordapp.net/attachments/475759657609068564/719222523182448710/lulurd_banner_grad.png");

        message.author.send(embed);

        
    }
};

export = help;