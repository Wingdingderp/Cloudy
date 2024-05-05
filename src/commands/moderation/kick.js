const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('kick a user from the server')
    .addUserOption((option) =>
    option.setName('user')
    .setDescription('what user do you want to kick')
    .setRequired(true)
    )
    .addStringOption((option) =>
    option.setName('reason')
    .setDescription('why are you kicking them')
    .setRequired(false)
    )
    .addBooleanOption((option) =>
    option.setName('hide reason')
    .setDescription('Hide the reason from the kicked party, default false')
    .setRequired(false)
    ),
    async execute(interaction) {

        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.fetch(user.id);
        const reason = interaction.options.getString('reason') || 'no reason provided';
        const hidden = interaction.options.getBoolean('hide reason') || false;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: `You must have the moderate members perm to use this command`, ephemeral: true});
        if (!member) return await interaction.reply({ content: 'The user mentioned is no logner within the server', ephemeral: true});
        if (!member.kickable) return await interaction.reply({ content: 'I cannot kick this user! That is because either their role or themselves are above me!', ephemeral: true});
        if (interaction.member.id === member.id) return await interaction.reply({ content: 'You cannot kick yourself!', ephemeral: true});
        if (member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You cannot kick a person with the admin permission', ephemeral: true});

        member.kick(reason);

        const embed = new EmbedBuilder()
        .setColor('Blue')
        .setTitle(`Kicked ${member.displayName}\nreason: ${reason}`)
        .setDescription(`Command ran by ${interaction.member.displayName}`);

        const dmEmbed = new EmbedBuilder()
        .setColor('Blue')
        .setTitle(`Kicked from ${interaction.guild.name} by ${interaction.member.displayName}`);
        if (hidden == false) {
            dmEmbed.setDescription(`Reason: ${reason}`)
        }
        else {
            dmEmbed.setDescription('No reason provided')
        };


        await member.send({
            embeds: [dmEmbed]
        }).catch(err => {
            return;
        });
        await interaction.reply({
            embeds: [embed]
        });
    }

}