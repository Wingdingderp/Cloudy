const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const countingSchema = require('../../Schemas.js/countingSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('counting-setup')
        .setDescription(`Setup a counting system for your guild`)
        .setDMPermission(false)
        .addChannelOption(option => option
            .setName('channel')
            .setDescription(`Please indicate the channel where you would like the counting messages to be sent.`)
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
        .addIntegerOption(option => option
            .setName('max-count')
            .setDescription(`The maximum number you want the server members to count up to (default 1000)`)
            .setRequired(false)
            .setMinValue(1)
        )
        .addIntegerOption(option => option
            .setName('quarter-goal')
            .setDescription(`The quarter goal number (optional)`)
            .setRequired(false)
            .setMinValue(1)
        )
        .addIntegerOption(option => option
            .setName('halfway-goal')
            .setDescription(`The halfway goal number (optional)`)
            .setRequired(false)
            .setMinValue(1)
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return await interaction.reply({
                content: `The counting system cannot be set up because you do not have the necessary permissions to do so.`,
                ephemeral: true
            });
        }

        const channel = interaction.options.getChannel('channel');
        const maxCount = interaction.options.getInteger('max-count') || 1000;
        const quarterGoal = interaction.options.getInteger('quarter-goal');
        const halfwayGoal = interaction.options.getInteger('halfway-goal');

        countingSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
            if (data) {
                return await interaction.reply({
                    content: 'You already have a counting system in place. To restart it, use the `/counting-disable` command.',
                    ephemeral: true
                });
            }

            const countingData = {
                Guild: interaction.guild.id,
                Channel: channel.id,
                Count: 0,
                MaxCount: maxCount
            };

            if (quarterGoal) {
                countingData.QuarterGoal = quarterGoal;
            }

            if (halfwayGoal) {
                countingData.HalfwayGoal = halfwayGoal;
            }

            countingSchema.create(countingData);

            let replyContent = `The counting system has been successfully implemented within ${channel}. The maximum count is set to ${maxCount}.`;

            if (quarterGoal) {
                replyContent += `\nA quarter goal has been set at ${quarterGoal}.`;
            }

            if (halfwayGoal) {
                replyContent += `\nA halfway goal has been set at ${halfwayGoal}.`;
            }

            await interaction.reply({
                content: replyContent,
                ephemeral: true
            });
        });
    }
};