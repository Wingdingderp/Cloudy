const { Events, EmbedBuilder } = require('discord.js');
const starboard = require('../Schemas.js/starboardSchema');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute (reaction, user, client) {

        if (!reaction.message.guildId) return;

        var data = await starboard.findOne({ Guild: reaction.message.guildId});
        if (!data) return;
        else {
            if (reaction._emoji.name !== '⭐') return;

            var guild = await client.guilds.cache.get(reaction.message.guildId);
            var sendChannel = await guild.channels.fetch(data.Channel);
            var channel = await guild.channels.fetch(reaction.message.channelId);
            var message = await channel.messages.fetch(reaction.message.id);

            if (message.author.id == client.user.id) return;

            var newReaction = await message.reactions.cache.find(reaction => reaction.emoji.id === reaction._emoji.id);

            if (newReaction.count >= data.Count) {
                var msg = message.content || 'No content available';

                const embed = new EmbedBuilder()
                .setColor('Blurple')
                .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.avatarURL()}`})
                .setDescription(`${msg} \n\n**[Click to jump to message!](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})**`)
                .setTimestamp();

                const messageHadAttachment = message.attachments.first()

                if (messageHadAttachment) {
                    embed.setImage(messageHadAttachment.proxyURL)
                }

                await sendChannel.send({ content: `**⭐ ${newReaction.count} | ${channel}**`, embeds: [embed] }).then(async m => {
                    await m.react('⭐').catch(err => {});
                });
            }
        }
    }
}