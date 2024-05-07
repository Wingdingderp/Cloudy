const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const levelSchema = require('../../Schemas.js/level');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setxp')
    .setDescription('Give a user specified amount of XP.')
    .addUserOption(option => option.setName('user').setDescription('Specified user will be given specified amount of XP.').setRequired(true))
    .addNumberOption(option => option.setName('amount').setDescription('The amount of XP you want to give specified user.').setRequired(true)),
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});

        const user = interaction.options.getUser('user');
        const amount = interaction.options.getNumber('amount');

        const { guildId } = interaction;

        levelSchema.findOne({ Guild: interaction.guild.id, User: user.id}, async (err, data) => {

            if (err) throw err;
    
            if (!data) return await interaction.reply({ content: `${user} needs to have **earned** past XP in order to add to their XP.`, ephemeral: true})

            const give = amount;

            const Data = await levelSchema.findOne({ Guild: interaction.guild.id, User: user.id});

            if (!Data) return;

             const requiredXP = Data.Level * Data.Level * 20 + 20;
            Data.XP += give;
            Data.save();

            interaction.reply({ content: `Gave **${user.username}** **${amount}**XP.`, ephemeral: true})
        })
    }
}