/* eslint-disable no-inline-comments */
const { readdirSync, lstatSync } = require('fs');
const { extname, join } = require('path');
const modules = require('./modules');

require('dotenv').config();

module.exports = class Main
{
	constructor(client, data = {})
	{
		this.token = process.env.TOKEN; //env token
		this.client = client;
		Object.assign(this.client, data);
		this.Init = () => {
			this.commandsHandler(data.path, data.root); //root commands pull
			this.eventHandler(data.path, data.root); //root event handler
			this.client.login(this.token); //login finalizes

		};

		this.cmdNoName = [];
		this.cmdNoFunc = [];
		this.evtNoName = [];
		this.evtNoFunc = [];
//overall events
	}

	commandsHandler(path = './cmds', root = '../') //cmd pathing
	{
		readdirSync(path).forEach(file => {
			const CMD_PATH = join(path, file); //path finding

			if (lstatSync(CMD_PATH).isDirectory()) this.commandsHandler(CMD_PATH); 
			if (extname(CMD_PATH) === '.js') this.commandCheck(join(root, CMD_PATH));
		});

		if (this.cmdNoName.length > 0) console.log(`These commands has no or invalid names and cannot be loaded.'\n> ${this.cmdNoName.join('\n> ')}`);
		if (this.cmdNoFunc.length > 0) console.log(`These commands has no valid functions of 'onTrigger', consider repairing or delete.'\n> ${this.cmdNoFunc.join('\n> ')}`); //console error failsafe messages
	}

	commandCheck(CMD_PATH)
	{
		const cmd = require(CMD_PATH);
		if (!cmd || cmd === {}) return; // notify empty files if needed

		if (!cmd.name) return this.cmdNoName.push(`"${CMD_PATH}"`);
		if (!cmd.onTrigger || typeof cmd.onTrigger !== 'function') return this.cmdNoFunc.push(`${CMD_PATH}${cmd.name ? `: "${cmd.name}"` : ''}`);

		this.client.cmds.set(cmd.name, cmd);
	}

	eventHandler(path = './evts', root = '../')
	{
		readdirSync(path).forEach(file => {
			const EVT_PATH = join(path, file);

			if (lstatSync(EVT_PATH).isDirectory()) this.eventHandler(EVT_PATH);
			if (extname(EVT_PATH) === '.js') this.eventCheck(join(root, EVT_PATH)); //path event error failsafe
		});

		if (this.evtNoName.length > 0) console.log(`These events has either no or invalid names and cannot be loaded.'\n> ${this.evtNoName.join('\n> ')}`);
		if (this.evtNoFunc.length > 0) console.log(`These events has no valid functions of 'onEmit', consider repairing or delete.'\n> ${this.evtNoFunc.join('\n> ')}`);
	}

	eventCheck(EVT_PATH)
	{
		const evt = require(EVT_PATH);
		if (!evt || evt === {}) return; // notify empty files if needed

		if (!evt.name || !modules.validEvents.some(evtName => evtName === evt.name)) return this.evtNoName.push(`${EVT_PATH}${evt.name ? `: "${evt.name}"` : ''}`);
		if (!evt.onEmit || typeof evt.onEmit !== 'function') return this.evtNoFunc.push(`${EVT_PATH}${evt.name ? `: "${evt.name}"` : ''}`);

		if (evt.once) this.client.once(evt.name, evt.onEmit.bind(null, this.client));
		else this.client.on(evt.name, evt.onEmit.bind(null, this.client));
	}
};