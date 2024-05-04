const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');


const autoRole = require('../../Schemas/AutoRole')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setautorole')
    .setDescription('Set the auto role for the server.')
    .addRoleOption(option => option.setName('role').setDescription('The role to be given when someone joining the server.').setRequired(true)),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return await interaction.reply({ content: "You do not have permission to run this command."});


        const role = interaction.options.getRole('role');


        autoRole.findOne({ Guild: interaction.guild.id}, async (err, data) => {
            if (err) throw err;

            if (!data) {
                autoRole.create({
                    Guild: interaction.guild.id,
                    RoleID: role.id,
                    RoleName: role.name
                })

                const embed = new EmbedBuilder()
                .setColor('#00c7fe')
                .setDescription(`${role} has been successfully set as a join role.`)
                .setFooter({ text: `${interaction.guild.name}` })
                .setTimestamp()

                return interaction.reply({ embeds: [embed] });

            } else {
                await interaction.reply({ content: 'Join role has already been set up.'})
            }
        })
    }
}
