const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const starboard = require('../../Schemas.js/starboardschema');

module.exports = {
    mod: true,
    data: new SlashCommandBuilder()
    .setName('starboard')
    .setDescription('Starboard system')
    .addSubcommand(command => command.setName('setup').setDescription('Setup the starboard system').addChannelOption(option => option.setName('channel').setDescription('The channel to send the starred messages into').setRequired(true)).addIntegerOption(option => option.setName('star-count').setDescription('The least number of stars a message needs to be added')))
    .addSubcommand(command => command.setName('disable').setDescription('Disable the starboard system'))
    .addSubcommand(command => command.setName('check').setDescription('Check the current starboard system status')),
    async execute (interaction) {

        const { options } = interaction;
        const sub = options.getSubcommand();

        async function sendMessage (message) {
            const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(message);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        var data = await starboard.findOne({ Guild: interaction.guild.id});
        switch (sub) {
            case 'setup':
                if (data) {
                    return await sendMessage(`⚠️ Looks like the starboard system is already setup... once a message gets \`${data.Count}\` ⭐'s, it will be sent in <#${data.Channel}>`);
                } else {
                    var channel = options.getChannel('channel');
                    var count = options.getInteger('star-count') || 3;

                    await starboard.create({
                        Guild: interaction.guild.id,
                        Channel: channel.id,
                        Count: count
                    }),

                    await sendMessage(`🌎 I have setup the starboard system. Once a message gets \`${count}\` ⭐'s, it will be sent in ${channel}.`);
                }
            break;
            case 'disable':
                if (!data) {
                    return await sendMessage(`⚠️ Looks like there is no starboard system setup.`);
                } else {
                    await starboard.deleteOne({Guild: interaction.guild.id});
                    await sendMessage(`🌎 I have disabled your starboard system.`);
                }
            break;
            case 'check':
                if (!data) {
                    return await sendMessage(`⚠️ Looks like there is no starboard system setup.`);
                } else {
                    var string = `**Star Channel:** <#${data.Channel}> \n**Required Stars:** \`${data.Count}\``;
                    await sendMessage(`⭐ **Your Starboard System** \n\n${string}`);
                }
        }
    }
}