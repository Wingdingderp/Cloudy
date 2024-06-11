const { Events, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		//Error Handling
		try {
			const cmd = await command.execute(interaction, client);
		} catch (error) {
			console.log(error);
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true
			}).catch(err => {});


			//Error Flag System
			var guild = interaction.guild;
			var member = interaction.member;
			var channel = interaction.channel;
			var errorTime = `<t:${Math.floor(Date.now() / 1000)}:R>`;

			const channelID = process.env.DISCORD_ERROR_LOGGING
			const sendChannel = await guild.channels.cache.get(channelID)

			if (!channelID) return;

			const embed = new EmbedBuilder()
			.setColor('Red')
			.setTitle('⚠️ Flagged Error!')
			.setDescription("An error has been flagged while using a slash command.  All other forms of interaction will not be logged with this system!")
			.addFields({ name: "Error Command", value: `\`${interaction.commandName}\``})
			.addFields({ name: "Error Stack", value: `\`${error.stack}\``})
			.addFields({ name: "Error Message", value: `\`${error.message}\``})
			.addFields({ name : "Error Guild", value: `\`${guild.name} (${guild.id})\``})
			.addFields({ name : "Error User", value: `\`${member.user.username} (${member.id})\``})
			.addFields({ name : "Error Command Channel", value: `\`${channel.name} (${channel.id})\``})
			.addFields({ name: "Error Timestamp", value: `${errorTime}`})
			.setFooter({ text: "Error Flag System"})
			.setTimestamp();

			const msg = await sendChannel.send({ embeds: [embed] }).catch(err => {});
			
		}
	}
}