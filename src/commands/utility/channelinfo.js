const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require("discord.js");
 
const MAX_CHANNELS_PER_EMBED = 5;
 
module.exports = {
  admin: true,
  data: new SlashCommandBuilder()
    .setName("channels-list")
    .setDescription("List all channels!")
    .setDMPermission(false),
  async execute(interaction, client) {
    const guild = interaction.guild;
    await guild.members.fetch();
    let channels = guild.channels.cache.filter(x => x.type === 0, y => y.type === 4)
 
    const channelsArray = Array.from(channels.values());
 
    for (let i = 0; i < channelsArray.length; i += MAX_CHANNELS_PER_EMBED) {
      const channelsChunk = channelsArray.slice(i, i + MAX_CHANNELS_PER_EMBED);

      msg = channelsChunk.map((r) => `<#${r.id}> | **${r.topic?? 'No Description Provided.'}**`).join("\n");
 
      await interaction.channel.send({ content: `${msg}` });
    }
  }
}