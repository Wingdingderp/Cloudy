const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField  } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Send the ticket system embed'),
    async execute(interaction) {
        if (!interaction.member.permissions.has([PermissionsBitField.Flags.Administrator])) return await interaction.reply({ content: 'Invalid permissions', ephemeral: true });
        const embed = new EmbedBuilder()
        .setTitle(`**Ticket System**`)
        .setDescription('Need help with something or want to report something you saw?\n Create a ticket to talk to us.\n To create a ticket click the 📩 button.')
        .setColor('Blue')
        .setAuthor({ name: `${interaction.guild.name}`})

        const ticket = new ButtonBuilder()
			.setCustomId('ticket')
            .setEmoji('📩')
			.setLabel('Create a Ticket!')
			.setStyle(ButtonStyle.Primary);
        
            const row = new ActionRowBuilder()
            .addComponents(ticket)

            interaction.deferReply();
            interaction.deleteReply();
            interaction.channel.send({ embeds: [embed], components: [row] })
    }
}