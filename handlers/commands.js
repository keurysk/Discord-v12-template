

module.exports = (err, files, client) => {
	if (err) return console.error(err);

	files.forEach((file) => {
		const command = require(`./../commands/${file}`);
		if (command.name, command) {
			if (command.name) {
				client.commands.set(command.name, command);
				console.log(`${command.name} was succesfully loaded!`)
				if (command.aliases && Array.isArray(command)) {
					command.aliases.foreach((alias) =>
						client.aliases.set(alias, command.name),
					);
				}
			}
		}
	});
};