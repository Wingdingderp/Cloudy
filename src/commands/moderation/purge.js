const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
 
module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Purge messages from the channel')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to purge')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('filter')
        .setDescription('Filter options for purging')
        .setRequired(true)
        .addChoices(
          { name: 'All', value: 'all' },
          { name: 'Links', value: 'links' },
          { name: 'Bot Messages', value: 'bot' },
          { name: 'Invites', value: 'invites' },
          { name: 'Attachments', value: 'attachments' },
          { name: 'Images', value: 'images' },
        )),
 
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      const noPermissionEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setFooter({ text: 'Parrot' })
        .setTitle('Permission Error')
        .setDescription('You do not have the required permissions to use this command.')
        .setTimestamp();
 
      return interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
    }
 
    const amount = interaction.options.getInteger('amount');
    const filter = interaction.options.getString('filter');
    const channel = interaction.channel;
 
    if (amount < 1 || amount > 100) {
      const invalidAmountEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setFooter({ text: 'Moderation System' })
        .setTitle('Invalid Amount')
        .setDescription('Please specify a valid number of messages to purge (1-100).')
        .setTimestamp();
 
      return interaction.reply({ embeds: [invalidAmountEmbed], ephemeral: true });
    }
 
    let messages;
 
    try {
      switch (filter) {
        case 'links':
          messages = await channel.messages.fetch({ limit: amount });
          messages = messages.filter(msg => msg.content.includes('http://') || msg.content.includes('https://'));
          break;
        case 'bot':
          messages = await channel.messages.fetch({ limit: amount });
          messages = messages.filter(msg => msg.author.bot);
          break;
        case 'invites':
          messages = await channel.messages.fetch({ limit: amount });
          messages = messages.filter(msg => /discord\.gg\/\w+/i.test(msg.content));
          break;
        case 'attachments':
          messages = await channel.messages.fetch({ limit: amount });
          messages = messages.filter(msg => msg.attachments.size > 0);
          break;
        case 'images':
          messages = await channel.messages.fetch({ limit: amount });
          messages = messages.filter(msg => msg.attachments.some(attachment => attachment.name.match(/\.(png|jpe?g|gif)$/i)));
          break;
        case 'all':
        default:
          messages = await channel.messages.fetch({ limit: amount });
          break;
      }
 
      if (messages.size === 0) {
        const noMessagesEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setFooter({ text: 'Parrot' })
          .setTitle('No Messages to Purge')
          .setDescription('There are no messages in the channel to purge.')
          .setTimestamp();
 
        return interaction.reply({ embeds: [noMessagesEmbed], ephemeral: true });
      }
 
      await channel.bulkDelete([...messages.values()], true);
      const purgeSuccessEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setFooter({ text: 'Parrot' })
        .setTitle('Purge Successful')
        .setDescription(`Successfully purged ${messages.size} message(s).`)
        .setTimestamp();
 
      interaction.reply({ embeds: [purgeSuccessEmbed], ephemeral: true });
    } catch (error) {
      console.error('Error purging messages:', error);
      const purgeErrorEmbed = new EmbedBuilder()
        .setFooter({ text: 'Parrot' })
        .setColor('#FF0000')
        .setTitle('Purge Error')
        .setDescription('An error occurred while purging messages.')
        .setTimestamp();
 
      interaction.reply({ embeds: [purgeErrorEmbed], ephemeral: true });
    }
  },
};
 