import { Client as DJSClient } from "discord.js";
import Command from "../../types/Command";

class Client extends DJSClient {
    public commands = new Map<string, Command>();
    public prefix!: string;
}

export default Client;