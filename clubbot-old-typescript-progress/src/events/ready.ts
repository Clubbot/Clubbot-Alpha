/*module.exports = async client => {
    console.log(`${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "ready");
  
    client.user.setActivity(`Clubs`, {type: "PLAYING"});
  };*/

import { Client } from "discord.js";
import { configLoader } from "../lib/utils/utils";
const BotConfig = configLoader();

const ready = async (client: Client) => {

  console.log(`${client.user.tag}, has logged in succesfully!`);
  
    await client.user.setActivity(BotConfig().status.message, { type: BotConfig().status.type });
}

export = ready;