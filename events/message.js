const { prefix } = require('./../config/config.json');
const { error } = require('./../config/default.json');
const Discord = require('discord.js');
let cooldown = {}

module.exports = {
	event: 'message', 
	run: async (message, client) =>{
		if (!message.content.startsWith(prefix) || message.author.bot) return;
		const args = message.content.slice(prefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();
		const command =
		client.commands.get(commandName) ||
		client.commands.find(
			(cmd) => cmd.aliases && cmd.aliases.includes(commandName),
		);
		if (!command) return;
		if (command.guildOnly && message.channel.type !== 'text') {
			return message.reply(`I can\'t execute that command in DMs!`).then(m => m.delete({ timeout: 9000 }));
		}

		let uCooldown = cooldown[message.author.id];

		if (!uCooldown) {
		  cooldown[message.author.id] = {}
		  uCooldown = cooldown[message.author.id]
		}
	  
		let time = uCooldown[command.name] || 0
	  
		if (time && (time > Date.now())) return message.channel.send(new Discord.MessageEmbed().setColor(error)
		.setDescription(` You can use this command again in **${Math.ceil((time - Date.now()) / 1000)}** Second's!`)).then(m => m.delete({ timeout: 9000 })); //YOU CAN USE PARSE MS TO GET BETTER responce

		cooldown[message.author.id][command.name] = Date.now() + command.cooldown;

		if (command.args && !args.length) {
                   let reply = `You didn't provide any arguments, ${message.author}!`;
            
                   if (command.usage) {
                       reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
                   }
            
                   return message.channel.send(reply);
		}  // 
		try {
			command.execute(message, client, args);
		}
		catch (error) {
			console.error(error);
			message.channel.send(new Discord.MessageEmbed().setColor(error)
			.setDescription(`An error ocurred when executing that command!`)).then(m => m.delete({ timeout: 9000 }));
		}
	},
};