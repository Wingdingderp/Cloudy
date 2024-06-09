const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const levelSchema = require('../../Schemas.js/level');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('givexp')
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

            const lev = Math.floor((100+Math.sqrt(560 * amount+10000))/280);
            

            const Data = await levelSchema.findOne({ Guild: interaction.guild.id, User: user.id});

            if (!data) {
                levelSchema.create({
                    Guild: guildId,
                    User: user.id,
                    XP: amount,
                    Level: lev
                })
            };

            if (!Data) {
                interaction.reply({ content: `Gave **${user.username}** ${amount}XP`, ephemeral: true})
            } else {
                Data.Level = Math.floor((100+Math.sqrt(560 * (Data.XP + amount)+10000))/280);
                Data.XP += amount;
                Data.save();

                interaction.reply({ content: `Gave **${user.username}** ${amount}XP.`, ephemeral: true})
            }
        })
    }
}