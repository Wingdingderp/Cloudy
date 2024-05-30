const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription('Set a user\'s nickname')
    .addUserOption((user) =>
    option.setName('user')
    .setDescription('Who\'s nickname do you want to set')
    .setRequired(true))
    .addStringOption((newNick) =>
    option.setName('nickname')
    .setDescription('The user\'s new nickname')
    .setRequired(true)),

    async execute (interaction) {

        if (!message.guild.me.permissions.has(PermissionsBitField.Flags.ManageNicknames)) return await interaction.reply('I don\'t have permission to change nicknames!')
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) return await interaction.reply('You don\'t have the ManageNicknames permission!')

        const user = interaction.option.getUser('user');
        const member = await interaction.guild.members.fetch(user.id);
        const oldName = member.displayName;
        const nickname = interaction.option.getString('nickname');
        member.setNickname(nickname);

        const embed = new EmbedBuilder()
        embed.setTitle('**Changed a user\'s nickname!**')
        .setDescription(`${oldName}\'s nickname was changed to ${nickname}!`)
        .setColor('Blue')

        await interaction.reply({ embeds: [embed] })
    }
}