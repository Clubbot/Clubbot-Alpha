import { Message } from "discord.js";
import { Client } from "../lib/utils/Client";

export type CommandExecutor = (client: Client, msg: Message, args: string[]) => Promise<void, Message> | void;

export default interface Command {
    aliases?: string[];
    information: string;
    usage: string;
    exec: CommandExecutor;
}