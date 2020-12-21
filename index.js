const modules = require('./utils/modules');
const main = require('./utils/main');
const { Client } = require('discord.js');

new main(new Client(), modules).Init();