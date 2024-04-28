const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder, ChannelType } = require('discord.js')
const ticket = require('../../Schemas/ticketSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Manage the ticket system')
    .addSubcommand(command => command.seName('send').setDescription('Send the ticket message').addStringOption(option => option.setName('name').setDescription('The name for the open select menu content').setRequired(true)).addStringOption(option => option.setName('message').setDescription('A custom message to add to the embed').setRequired(false)))
    .addSubcommand(command => command.setName('setup').setDescription('Setup the ticket category').addChannelOption(option => option.setName('category').setDescription('The category to send tickets in').addChannelType(ChannelType.GuildCategory).setRequired(true)))
    .addSubcommand(command => command.setName('remove').setDescription('Disable the ticket system'))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute (interaction) {

        const { options } = interaction;
        const sub = options.getSubcommand();
        const data = await ticket.findOne({ Guild: interaction.guild.id});

        switch (sub) {
            case 'send':
                if (!data) return await interaction.reply({ content: `⚠️ You have to do /ticket setup before you can send a ticket message...`, ephemeral: true });
                const name = options.getString('name');
                var message = options.getString('message') || 'Create a ticket to talk with the server staff! One you select below, use the input to describe why you are creating this ticket';

                const select = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                    .setCustomId('ticketCreateSelect')
                    .setPlaceHolder(`🌎 ${name}`)
                    .setMinValues(1)
                    .addOptions(
                        {
                            label: 'Create your ticket',
                            description: 'Click to begin the ticket creation process',
                            value: 'createTicket'
                        }
                    )
                );

                const embed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle(`✨ Create a ticket!`)
                .setDescription(message + ' some emoji')
                .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}`});
        }
    }
}