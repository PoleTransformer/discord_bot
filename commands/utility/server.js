const {SlashCommandBuilder} = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Info about server')
	async execute(interaction) {
		await interaction.reply(`This server is ${interaction.guilds.name} and has ${interaction.guld.memberCount} members.`);
	},
};
