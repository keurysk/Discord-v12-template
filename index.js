const { token } = require('./config/config.json');
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir('./events/', (err, files) => {
	const events = require('./handlers/events.js');
	events(err, files, client);
});

fs.readdir('./commands/', (err, files) => {
	const commands = require('./handlers/commands.js');
	commands(err, files, client);
});

client.login(token);