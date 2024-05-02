const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get a user\'s avatar')
        .addUserOption((option) => //creates new slash command option
        option.setName('user')
        .setDescription('The user who\'s avatar you want')
        .setRequired(false)
    ),

    async execute(interaction) {
        const { channel, client, options, member } = interaction;
        let user = interaction.options.getUser('user') || interaction.member; //Sets user to the response to user option or to the member running command
        let userAvatar = user.displayAvatarURL({ size: 512 }); //Displays user avatar with dimensions 512x512

        const embed = new EmbedBuilder()
        .setColor(0x0000FF)
        .setTitle(`${user}'s Avatar`)
        .setImage(`${userAvatar}`);

        const button = new ButtonBuilder()
        .setLabel('Avatar Link')
        .setStyle(ButtonStyle.Link)
        .setURL(`${user.avatarURL({ size: 512 })}`);
        
        const row = new ActionRowBuilder().addComponents(button);

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });
    },
};