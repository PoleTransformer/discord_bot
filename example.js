const {Client, Collection, Events, GatewayIntentBits} = require('discord.js');
const {token} = require('./config.json');
const client = new Client({intents: [GatewayIntentBits.Guilds]});
const fs = require('node:fs');
const path = require('node:path');

client.once(Events.ClientReady, readyClient => {
	console.log(`Logged in as ${readyClient.user.tag}`);
});

client.login(token);
client.commands = new Collection();

const folderPath = path.join(__dirname, 'commands'); //returns absolute path of commands directory
const commandFolders = fs.readdirSync(foldersPath); //returns all directories and files inside commands directory

for(const folder of commandFolders) { //loop through commands directory
	const commandsPath = path.join(folderPath, folder); //only one folder for now called utility, returns absolute path of utilities folder
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); //returns all files ending with .js inside utilities folder
	for(const file of commandFiles) { //loop through utilities directory
		const filePath = path.join(commandsPath, file); //returns absolute path of all .js files inside utilities directory
		const command = require(filePath);
		if('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log('[WARNING]');
		}

	}

}

//Command Listener
client.on(Events.InteractionCreate, interaction => {
	if(!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	if(!command) { //if command not found
		console.error("Command not found");
		return;
	}
	try {
		await command.execute(interaction); //attempt to execute the command
	} catch(error) {
		console.error(error); //oh no, something bad happened, log to console
		if(interaction.replied || interaction.deferred) { //log any error messaged reported by command
			await interaction.followUp({content: 'An error occured',ephemeral:true}); //only origin user can see error
		} else {
			await interaction.reply({content: 'An error occured',ephemeral:true});
		}
	}

	console.log(interaction);
});
