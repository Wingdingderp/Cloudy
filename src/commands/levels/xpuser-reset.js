const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require(`discord.js`);
const levelSchema = require('../../Schemas/level');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`xpuser-reset`)
    .setDescription(`Resets a members XP`)
    .addUserOption(option => option.setName('user').setDescription(`The member you want clear the xp of`).setRequired(true)),
    async execute (interaction) {

        const perm = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark:  You don't have permission to reset xp levels in this server`)
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [perm], ephemeral: true })

            const { guildId } = interaction;

            const target = interaction.options.getUser('user');

            levelSchema.deleteMany({ Guild: guildId, User: target.id,}, async (err, data) => {

                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`:white_check_mark:  ${target.tag}'s xp has been reset!`)

                await interaction.reply({ embeds: [embed] })
            })
    }
}