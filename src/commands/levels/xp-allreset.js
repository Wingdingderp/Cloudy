const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require(`discord.js`);
const levelSchema = require('../../Schemas.js/level');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`xpall-reset`)
    .setDescription(`Resets ALL of the servers XP levels`),
    async execute (interaction) {

        const perm = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark:  You don't have permission to reset xp levels in this server`)
        if (interaction.user.id !== '320649517592739841' && interaction.user.id !== '760223211610308628') return await interaction.reply({ embeds: [perm], ephemeral: true })

            const { guildId } = interaction;

            levelSchema.deleteMany({ Guild: guildId}, async (err, data) => {

                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`:white_check_mark:  The xp system in your server has been reset!`)

                await interaction.reply({ embeds: [embed] })
            })
    }
}