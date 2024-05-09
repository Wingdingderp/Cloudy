const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require("discord.js");
const counting = require('../../Schemas.js/countingschema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('counting')
    .setDescription(`Manage your counting system`)
    .addSubcommand(command => command.setName('setup').setDescription('Setup the counting system').addChannelOption(option => option.setName('channel').setDescription('The channel for the counting system').addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand(command => command.setName('disable').setDescription('Disable the counting system')),
    async execute (interaction) {

        const { options } = interaction;
        const sub = options.getSubcommand()
        const data = await counting.findOne({ Guild: interaction.guild.id});

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You don't have perms to manage the counting system.`, ephemeral: true })
        
        switch (sub) {
            case 'setup':

            if (data) {
                return await interaction.reply({ content: `You have already setup the counting system here`, ephemeral: true})
            } else {
                const channel = interaction.options.getChannel('channel');
                await counting.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id,
                    Number: 1
                });

                const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`⌚ The counting system has been setup! Go to ${channel} and start at number 1!`)

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            break;
            case 'disable':
            
            if (!data) {
                return await interaction.reply({ content: `You don't have a counting system setup yet`, ephemeral: true })
            } else {
                await counting.deleteOne({
                    Guild: interaction.guild.id,
                });

                const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`👉 The counting system has been disabled for this server`)
            }
        }
    }
}