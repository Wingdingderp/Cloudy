const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const MAX_ROLES_PER_EMBED = 50;

module.exports = {
  admin: true,
  data: new SlashCommandBuilder()
    .setName("roles-list")
    .setDescription("Find the total number of users with each role")
    .setDMPermission(false),
  async execute(interaction, client) {
    const guild = interaction.guild;
    await guild.members.fetch();
    let roles = guild.roles.cache;

    if (!roles) {
      return await interaction.reply("No roles found in this server.");
    }

    const rolesArray = Array.from(roles.values());

    rolesArray.sort((a, b) => b.position - a.position);

    const embeds = [];

    for (let i = 0; i < rolesArray.length; i += MAX_ROLES_PER_EMBED) {
      const rolesChunk = rolesArray.slice(i, i + MAX_ROLES_PER_EMBED);

      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("Server Roles")
        .setDescription(
          rolesChunk.map((r) => `<@&${r.id}> | **${r.members.size}**`).join("\n")
        );

      embeds.push(embed);
    }
      
      interaction.reply({content: "All the server roles is below", ephemeral: true})

    for (const embed of embeds) {
      await interaction.channel.send({ embeds: [embed] });
    }
  },
};