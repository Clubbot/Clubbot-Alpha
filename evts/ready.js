module.exports = {
	name: 'ready',
	once: true,
	onEmit: (client) => {
		console.log(`200: as ${client.user.tag}`);
	},
};