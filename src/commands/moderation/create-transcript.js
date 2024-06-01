const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('manual-transcript')
    .setDescription('Creates a transcript manually.'),
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(process.env.DISCORD_TICKET_MANAGER_ROLE)) return await interaction.reply({ content: `Invalid Permissions to take action within this ticket.`, ephemeral: true })

const channel = interaction.channel;
const transcriptChannel = interaction.client.channels.cache.get(process.env.TRANSCRIPT_CHANNEL);
const attachment = await discordTranscripts.createTranscript(channel);

        const embed = new EmbedBuilder()
    .setTitle(`Transcript Generated | ${channel.name}`)
    .setDescription('Your channel transcript has been attached below.')
    .setTimestamp()
    .setColor("Blue")

        await interaction.reply({ content: ':white_check_mark:  Transcript has been generated and sent to transcript logs.', ephemeral: true });
        await transcriptChannel.send({ embeds: [embed], ephemeral: false });
        await transcriptChannel.send({ files: [attachment] });
    }
}

