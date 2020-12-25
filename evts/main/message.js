/* eslint-disable no-inline-comments */
module.exports = {
	name: 'message',
	onEmit: (client, message) => {

		const prefix = process.env.PREFIX || 't/'; // Addtional database if needed

		if (message.author.bot) return;
		if (message.content.startsWith(prefix)) // Maybe adding <content>.toLowerCase() if ignoring cased prefixes
		{
			const contentArray = message.content.slice(prefix.length).split(/ +/);
			const cmdName = contentArray[0];
			contentArray.splice();

			const cmd = client.cmds.get(cmdName)
							|| client.cmds.find(c => c.aliases && c.aliases === cmdName)
							|| client.cmds.find(c => c.aliases && c.aliases.includes(cmdName));

			if (!cmd) return message.reply('Invalid command.');

			try {
				cmd.onTrigger(message, contentArray, client); // contentArray acting as args
			} catch (e) {
				message.reply(`Error \`[${e.name}]: ${e.message}\``);
				return console.log(e);
			}
		}
	},
};