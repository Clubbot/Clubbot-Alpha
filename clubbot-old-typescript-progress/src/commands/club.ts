import Command from "../types/Command";

const club: Command = {
    aliases: [],
    usage: "[command]",
    information: "The club command to join / leave / create clubs.",
    exec(_client, message, args) {
        if(args.length == 0) return message.channel.send("Club Penguin is the best club.");

        if(args[0].toLowerCase() == "join") {
            message.channel.send("join a club pls or die trying");

        } else if(args[0].toLowerCase() == "info") {
            message.channel.send("Insert generic info about a club");
        }

    }
};

export = club;