const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const Audit_Log = require("../../Schemas.js/auditlog");
const log_actions = require("../../Schemas.js/logactions");
const token = require("../../../encrypt").token(5);
const perm = require("../../../functions").perm;

module.exports = async (client) => {
        //Channel Delete
        client.on(Events.ChannelDelete, async (channel) => {
            perm(channel);
            const auditEmbed = new EmbedBuilder().setColor( 'Blue').setTimestamp().setFooter({ text: "Logging System"})
            const data = await Audit_Log.findOne({
                Guild: channel.guild.id,
            })
            let logID;
            if (data) {
                logID = data.Channel
            } else {
                return;
            }
            const auditChannel = client.channels.cache.get(logID);
            auditEmbed.setTitle("Channel Deleted").addFields(
                {name: "Channel Name:", value: channel.name, inline: false},
                {name: "Channel ID:", value: channel.id, inline: false}
            )
    
            
            try {
                await auditChannel.send({ embeds: [auditEmbed]})
            } catch (error) {
                return;
            }
        })

}