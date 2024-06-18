const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField  } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ticket').setDescription('Ticket System')
    .addSubcommand(command => command.setName('send').setDescription('Send the ticket system embed!'))
    .addSubcommand(command => command.setName('mbr-add').setDescription('Add a member to the current ticket').addUserOption(option => option.setName('member').setDescription('The member you want to add to the ticket').setRequired(true)))
    .addSubcommand(command => command.setName('mbr-remove').setDescription('Remove a member from the current ticket').addUserOption(option => option.setName('member').setDescription('The member you want to remove from the ticket').setRequired(true))),
    async execute(interaction) {
        if (!interaction.member.permissions.has([PermissionsBitField.Flags.Administrator])) return await interaction.reply({ content: 'Invalid permissions', ephemeral: true });

            const sub = interaction.options.getSubcommand();

            switch (sub) {
                case 'send':
                    const sendEmbed = new EmbedBuilder()
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
                        interaction.channel.send({ embeds: [sendEmbed], components: [row] })
            break;
                case 'mbr-add':
                    const addThread = interaction.channel
                    const addMember = interaction.options.getUser('member');
                    await addThread.members.add(addMember.id);
                    
                    const addEmbed = new EmbedBuilder()
                    .setTitle(`Ticket System`)
                    .setDescription(`:white_check_mark:  ${addMember} has been successfully added to this ticket.`)
            
                    await interaction.reply({ embeds: [addEmbed], ephemeral: true })
            break;
                case 'mbr-remove':
                    const rmThread = interaction.channel
                    const rmMember = interaction.options.getUser('member');
                    await rmThread.members.add(rmMember.id);
                    
                    const embed = new EmbedBuilder()
                    .setTitle(`Ticket System`)
                    .setDescription(`:white_check_mark:  ${rmMember} has been successfully removed from this ticket.`)
            
                    await interaction.reply({ embeds: [embed], ephemeral: true })
            }
    }
}