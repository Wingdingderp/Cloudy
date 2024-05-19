const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const autoRole = require('../../Schemas.js/autorole')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('autorole_disable')
    .setDescription('Disable the auto role system for the server.'),
    async execute (interaction) {

        const data = await autoRole.findOne({ Guild: interaction.guild.id });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return await interaction.reply({ content: "You do not have permission to run this command."});

        if (!data) {
            return await interaction.reply({ content: 'No Auto Role has been set.'})
        } else {
            autoRole.deleteMany({ Guild: interaction.guild.id}, async  (err, data) => {
                if (err) throw err;

                const embed = new EmbedBuilder()
                .setColor('#00c7fe')
                .setDescription(`Succesfully disabled **auto roles** in this server.`)
                .setFooter({ text: `${interaction.guild.name}` })
                .setTimestamp()

                return interaction.reply({ embeds: [embed] })
            })
        }
    }
}