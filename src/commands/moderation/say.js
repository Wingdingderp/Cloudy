const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Say a messsage as the bot.')
    .addStringOption(option => option.setName('message').setDescription('Let Cloudy send a message.').setRequired(true))
    .addChannelOption(option => option.setName('channel').setDescription('Channel to send this message in.').setRequired(false)),
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return await interaction.reply({ content: "You do not have permission to run this command.", ephemeral: true});

        const message = interaction.options.getString('message')
        const otherchannel = interaction.options.getChannel('channel')

        if (!otherchannel) {
            interaction.deferReply();
            interaction.deleteReply();
            interaction.channel.send({ content: `${(message)}` });
        } else {
            interaction.deferReply();
            interaction.deleteReply();
            otherchannel.send({ content: `${(message)}`});
            const sendmsg = await interaction.channel.send({ content: '`Sent!`' })
            setTimeout(() => {
                sendmsg.delete();
            }, 4000)
        }
    }
}
