const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display available slash commands'),
  async execute(interaction, client) {
    const commands = interaction.client.commands;
    const commandList = commands.map((command) => `**/${command.data.name}**: ${command.data.description}`).join('\n');

    const embed = new EmbedBuilder()
        .setTitle(`Available Commands!`)
        .setDescription(`\n\n${commandList}`)

        await interaction.reply({ embeds: [embed] })
  }
};
