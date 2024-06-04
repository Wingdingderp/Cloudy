const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
 
const MAX_CHANNELS_PER_EMBED = 50;
 
module.exports = {
  admin: true,
  data: new SlashCommandBuilder()
    .setName("channels-list")
    .setDescription("List all channels!")
    .setDMPermission(false),
  async execute(interaction, client) {
    const guild = interaction.guild;
    await guild.members.fetch();
    let channels = guild.channels.cache;
 
    const channelsArray = Array.from(channels.values());
 
    channelsArray.sort((a, b) => b.position - a.position);
 
    const embeds = [];
 
    for (let i = 0; i < channelsArray.length; i += MAX_CHANNELS_PER_EMBED) {
      const channelsChunk = channelsArray.slice(i, i + MAX_CHANNELS_PER_EMBED);

      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("Server channels")
        .setDescription(
          channelsChunk.map((r) => `<#${r.id}> | **${r.topic?? 'No Description Provided.'}**`).join("\n")
        );
 
      embeds.push(embed);
    }
 
      interaction.reply({content: "All the server channels are below", ephemeral: true})
 
    for (const embed of embeds) {
      await interaction.channel.send({ embeds: [embed] });
    }
  },
};