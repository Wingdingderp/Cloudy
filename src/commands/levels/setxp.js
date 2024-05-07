const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

const User = require('../../Schemas/level');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setxp')
    .setDescription('Set the xp of a user')
    .addUserOption((option) =>
    option
        .setName('user')
        .setDescription('The user to set the xp of')
        .setRequired(true)
    )
    .addNumberOption((option) => 
    option
        .setName('xp')
        .setDescription('The xp to set the user to')
        .setRequired(true)
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const member = interaction.options.getMember('member');
        const newLvl = interaction.options.getNumber('level')

        let user;

        const guildId = member.guild.id;
        const userId = member.user.id

        user = await User.findOne({ guildId, userId })

        try {

            await User.findOneAndUpdate(
                {
                    guildId,
                    userId,
                },
                {
                    level: newLvl,
                    xp: 0
                },
                { upsert: true, new: true}
            ).then(() => interaction.reply({content: `Successfully changed ${member.username}'s rank / level to ${newLvl}`}))
        } catch (err) {
            console.log(err)
        }

    }
}