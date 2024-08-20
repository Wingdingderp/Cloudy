const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const countingSchema = require('../../Schemas.js/countingSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('count-set')
    .setDescription('Set the number for the counting system.')
    .addIntegerOption(option => option
        .setName('count-number')
        .setDescription('The number to set for the counting system.')
        .setRequired(true)
        .setMinValue(1)
    ),

    async execute(interaction) {
         if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have the required permissions to use this command.'})}

    const countingData = await countingSchema.findOne({ Guild: interaction.guild.id });
    const number = interaction.options.getInteger('count-number');
    const nextNumber = number + 1

    const embed = new EmbedBuilder()
    .setTitle('Counting System has been OVERRIDED!')
    .setDescription(`${interaction.user} has used a command to change the number in this counting channel! \n The next number is **${nextNumber}**`)
    .setTimestamp()
    .setFooter({ text: 'Counting System' })
    .setColor('Blue');

    await interaction.reply({ embeds: [embed] });

    countingData.Count = number;
    countingData.LastUser = null;
    await countingData.save();
    }
}