const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const Audit_Log = require("../../Schemas.js/auditlog");
const log_actions = require("../../Schemas.js/logactions");
const token = require("../../../encrypt").token(5);
const perm = require("../../../functions").perm;

module.exports = async (client) => {
        //Channel Create
        client.on(Events.ChannelCreate, async (channel) => {
            perm(channel);
            const data = await Audit_Log.findOne({
                Guild: channel.guild.id
            })
            let logID;
            if (data) {
                logID = data.channelLog
            } else {
                return;
            }
            const auditEmbed = new EmbedBuilder().setColor( 'Blue').setTimestamp().setFooter({ text: "Logging System"})
            const auditChannel = client.channels.cache.get(logID);
            auditEmbed.setTitle("Channel Created").addFields(
                {name: "Channel Name:", value: channel.name, inline: false},
                {name: "Channel ID:", value: channel.id, inline: false}
            )
            await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
        });
}