const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unbans a user from the server')
    .addUserOption(option => option.setName('user').setDescription('The user to unban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for unbanning this member').setRequired(false)),
    async execute(interaction, client) {

        const userID = interaction.options.getUser('user');

        if (!interaction.member.permissions.has(Permissions.BitField.Flags.BanMembers)) return await interaction.reply({ content: "You must have the ban members permission to use this command", ephemeral: true});
        if (interaction.member.id === ID) return await interaction.reply({ content: "You cannot unban yourself!", ephemeral: true});

        let reason = interaction.options.getString('reason');
        if (!reason) reason = "No reason given";

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark: ${userID} has been unbanned | ${reason}`)

        await interaction.guild.bans.fetch()
        .then(async bans => {

            if (bans.size == 0) return await interaction.reply({ content: "There is no one banned from this guild", ephemeral: true})
            let bannedID = bans.find(ban => ban.user.id == userID);
            if (!bannedID) return await interaction.reply({ content: "The ID stated is not banned from this server", ephemeral: true})

            await interaction.guild.bans.remove(userID, reason).catch(err => {
                return interaction.reply({ content: "I cannot unban this user"})
            })
        })

        await interaction.reply({ emeds: [embed] });
    }
}
