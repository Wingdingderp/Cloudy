const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setname('purge')
    .setdescription('Deletes an amount of messages')
    .addNumberOption((option) =>
    option.setName('count')
    .setDescription('How many messages will be deleted')
    .setRequired(true)
    .setMinValue(1)
    .setMaxValue(100)
    ),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "You cannot purge messages", ephemeral: true});
        const { channel, client, options, member } = interaction;
        const count = interaction.options.getNumber('count');
        interaction.channel.bulkDelete(count)
        
        if (count == 1) {
            const embed = new EmbedBuilder()
            .setColor(0x0000FF)
            .setTitle(`Purged ${count} message!`)
            .setDescription(`Command ran by ${interaction.member.displayName}`)
        }
        else {
            const embed = new EmbedBuilder()
            .setColor(0x0000FF)
            .setTitle(`Purged ${count} messages!`)
            .setDescription(`Command ran by ${interaction.member.displayName}`) 
        }
        await interaction.reply({ embeds: [embed] });
    }
}