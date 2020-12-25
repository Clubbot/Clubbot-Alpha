module.exports = {
	name: 'ready',
	once: true,
	onEmit: (client) => { // onEmit Global/Public, In framework already 
		console.log(`200: as ${client.user.tag}`); //login precedure log
	},
};