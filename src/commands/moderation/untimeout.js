const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Untimes out a server member')
    .addUserOption(option => option.setName('user').setDescription('The user you want to untime out').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for untiming out the user')),
    async execute (interaction) {

        const timeUser = interaction.options.getUser('user');
        const timeMember = await interaction.guild.members.fetch(timeUser.id);
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: `You must have the moderate members perm to use this command`, ephemeral: true});
        if (!timeMember) return await interaction.reply({ content: 'The user mentioned is no logner within the server', ephemeral: true});
        if (!timeMember.kickable) return await interaction.reply({ content: 'I cannot untimeout this user! That is because either their role or themselves are above me!', ephemeral: true});
        if (interaction.member.id === timeMember.id) return await interaction.reply({ content: 'You cannot untimeout yourself!', ephemeral: true});
        if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You cannot untimeout a person with the admin permission', ephemeral: true});

        let reason = interaction.options.getString('reason') || 'No reason given';

        await timeMember.timeout(null, reason);

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark:  ${timeUser.tag}'s timeout has been **removed** | ${reason}`)

        const dmEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark: You have been **untimed out** in ${interaction.guild.name} | ${reason}`)
        
        await timeMember.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        })

        await interaction.reply({ embeds: [embed] });
        
    }
}