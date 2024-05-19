const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const afkSchema = require('../../Schemas.js/afkSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription(`Go afk within your server`)
    .addSubcommand(command => command.setName('set').setDescription('Go afk within your server').addStringOption(option => option.setName('message').setDescription('The reason for going afk').setRequired(false)))
    .addSubcommand(command => command.setName('remove').setDescription('Unafk from your server')),
    async execute (interaction) {

        const { options } = interaction;
        const sub = options.getSubcommand();

        const Data = await afkSchema.findOne({ Guild: interaction.guild.id, User: interaction.user.id });

        switch (sub) {
            case 'set':

            if (Data) return await interaction.reply({ content: `You are already afk within this server`, ephemeral: true});
            else {
                const message = options.getString('message');
                const nickname = interaction.member.nickname || interaction.user.username;
                await afkSchema.create({
                    Guild: interaction.guild.id,
                    User: interaction.user.id,
                    Message: message,
                    Nickname: nickname
                })

                const name = `${nickname} [AFK]`;
                await interaction.member.setNickname(`${name}`).catch(err => {
                    console.log(err)
                    return;
                })

                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`:white_check_mark:  You are now afk within the server! Send a message or do /afk remove to remove your afk!`)

                await interaction.reply({ embeds: [embed], ephemeral: true});
            }

            break;

            case 'remove':

            if (!Data) return await interaction.reply({ content: `You are not afk within this server`, ephemeral: true});
            else {
                const nick = Data.Nickname;
                await afkSchema.deleteMany({ Guild: interaction.guild.id, User: interaction.user.id});

                await interaction.member.setNickname(`${nick}`).catch(err => {
                    return;
                })

                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`:white_check_mark:  Your afk has been removed!`)

                await interaction.reply({ embeds: [embed], ephemeral: true})
            }
        }
    }
}