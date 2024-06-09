const { EmbedBuilder, Events, AuditLogEvent, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const Audit_Log = require("../../Schemas.js/auditlog");
const log_actions = require("../../Schemas.js/logactions");
const token = require("../../../encrypt").token(5);
const perm = require("../../../functions").perm;

module.exports = async (client) => {
    /*const { id, channel_id, guild_id, author, timestamp, type } = data;*/
    client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
      perm(oldMessage);
        if (oldMessage.content === newMessage.content) return;
        const data = await Audit_Log.findOne({
          Guild: oldMessage.guild.id
        })
        let logID;
        if (data) {
          logID = data.messageLog
        } else {
          return;
        }

        const ignoreChannels = ['1198787608503918684'];
        if (ignoreChannels.includes(oldMessage.channel.id)) return;

        const auditEmbed = new EmbedBuilder().setColor( 'Blue').setTimestamp().setFooter({ text: "Logging System"}).setThumbnail("https://maki.gg/emoji/pencil.png")
        const auditChannel = client.channels.cache.get(logID);
        const id = oldMessage.id;
        const guildID = oldMessage.guild.id;
        const channelID = oldMessage.channel.id;
        const buttons = new ButtonBuilder()
        .setLabel("Jump to")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://canary.discord.com/channels/${guildID}/${channelID}/${id}`);
        const row = new ActionRowBuilder().addComponents(buttons);
        const newText = newMessage.content;
        const oldText = oldMessage.content;
        const length1 = newMessage.length;
        const length2 = oldMessage.length;
        if (length1 >= 1024 && length2 >= 1024) {
          const LongAuditEmbed = new EmbedBuilder()
          .setTitle("Message Edited")
          .addFields({ name: 'Author:', value: `${newMessage.author.tag}`, inline: false})
          .addFields({ name: 'Channel:', value: `${newMessage.channel}`, inline: false})
          .setColor( 'Blue')
          .setTimestamp()
          .setFooter({ text: "Logging System"})
          const embedOld = new EmbedBuilder()
          .setTitle("Old Message")
          .setDescription(`${oldText}`)
          .setColor( 'Blue')
          .setTimestamp()
          .setFooter({ text: "Logging System"})
          const embedNew = new EmbedBuilder()
          .setTitle("New Message")
          .setDescription(`${newText}`)
          .setColor( 'Blue')
          .setTimestamp()
          .setFooter({ text: "Logging System"})
          await auditChannel.send({ embeds: [LongAuditEmbed, embedOld, embedNew], components: [row]});
        }
  
        try {
          auditEmbed.setTitle("Message Edited")
          .addFields({ name: 'Author:', value: `<@${newMessage.author.id}>`, inline: false})
          .addFields({ name: 'Channel:', value: `${newMessage.channel}`, inline: false})
          .addFields({ name: 'Old Message:', value: `${oldMessage.content}`, inline: false})
          .addFields({ name: 'New Message:', value: `${newMessage.content}`, inline: false})
          await auditChannel.send({ embeds: [auditEmbed], components: [row]}).catch((err) => {return;});
        } catch (error) {
          return;
        }
    })

}
