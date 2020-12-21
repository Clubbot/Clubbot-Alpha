const { readdirSync, lstatSync } = require('fs');
const { extname, join } = require('path');
const modules = require('./modules');

require('dotenv').config();

module.exports = class Main
{
	constructor(client, data = {})
	{
		this.token = process.env.TOKEN;
		this.client = client;
		Object.assign(this.client, data);
		this.Init = () => {
			this.commandsHandler(data.path);
			this.eventHandler(data.path);
			this.client.login(this.token);
		};
	}

	commandsHandler(path = '../cmds')
	{		
		this.cmdNoName = [];
		this.cmdNoFunc = [];
		readdirSync(path).forEach(file => {
			const CMD_PATH = join(path, file);

			if (lstatSync(CMD_PATH).isDirectory()) this.commandsHandler(CMD_PATH);
			if (extname(CMD_PATH) === '.js') this.commandCheck(CMD_PATH);
		});

		if (this.cmdNoName.length > 0) console.warn(`These commands has no or invalid names and cannot be loaded.'\n> ${this.cmdNoName.join('\n> ')}`);
		if (this.cmdNoFunc.length > 0) console.warn(`These commands has no valid functions of 'onTrigger', consider repairing or delete.'\n> ${this.cmdNoFunc.join('\n> ')}`);
	}

	commandCheck(CMD_PATH)
	{
		const cmd = require(CMD_PATH);
		if (!cmd || cmd === {}) return; // notify empty files if needed

		if (!cmd.name) return this.cmdNoName.push(`"${CMD_PATH}"`);
		if (!cmd.onTrigger || typeof cmd.onTrigger === 'function') return this.cmdNoFunc.push(`${CMD_PATH}${cmd.name ? `: "${cmd.name}"` : ''}`);

		this.client.cmds.set(cmd.name, cmd);
	}

	eventHandler(path = '../evts')
	{
		this.evtNoName = [];
		this.evtNoFunc = [];

		readdirSync(path).forEach(file => {
			const EVT_PATH = join(path, file);

			if (lstatSync(EVT_PATH).isDirectory()) this.eventHandler(EVT_PATH);
			if (extname(EVT_PATH) === '.js') this.eventCheck(EVT_PATH);
		});

		if (this.cmdNoName.length > 0) console.warn(`These events has either no or invalid names and cannot be loaded.'\n> ${this.cmdNoName.join('\n> ')}`);
		if (this.cmdNoFunc.length > 0) console.warn(`These events has no valid functions of 'onEmit', consider repairing or delete.'\n> ${this.cmdNoFunc.join('\n> ')}`);

	}

	eventCheck(EVT_PATH)
	{
		const evt = require(EVT_PATH);
		if (!evt || evt === {}) return; // notify empty files if needed

		if (!evt.name || !modules.validEvents.some(evtName => evtName === evt.name)) return this.evtNoName.push(`${EVT_PATH}${evt.name ? `: "${evt.name}"` : ''}`);
		if (!evt.onEmit || typeof evt.onEmit === 'function') return this.evtNoFunc.push(`${EVT_PATH}${evt.name ? `: "${evt.name}"` : ''}`);

		if (evt.once) this.client.once(evt.name, evt.onEmit.bind(null, this.client));
		else this.client.on(evt.name, evt.onEmit.bind(null, this.client));
	}
}