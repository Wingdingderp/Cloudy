const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const Audit_Log = require("../../Schemas.js/auditlog");
const log_actions = require("../../Schemas.js/logactions");
const token = require("../../../encrypt").token(5);
const perm = require("../../../functions").perm;

module.exports = async (client) => {
    //Invite Delete
    client.on(Events.InviteDelete, async (invite) => {
        perm(invite);
      
        const data = await Audit_Log.findOne({
            Guild: invite.guild.id 
        })
        let logID;
        if (data) {
            logID = data.inviteLog
        } else {
            return;
        }
        const auditEmbed = new EmbedBuilder().setColor( 'Blue').setTimestamp().setFooter({ text: "Logging System"})
        const auditChannel = client.channels.cache.get(logID);

        const usr = invite.inviterId ? null : "NO ID FOUND";
      
        auditEmbed.setTitle("Invite Deleted").addFields(
            {name: "User:", value: `<@${usr}>`, inline: false},
            {name: "Invite Code:", value: `${invite.code}`, inline: false},
            {name: "Expires at:", value: `${invite.expiresAt}`, inline: false},
            {name: "Created at:", value: `${invite.createdAt}`, inline: false},
            {name: "Channel:", value: `<#${invite.channelId}>`, inline: false},
            {name: "Max Uses:", value: `${invite.maxUses}`, inline: false},
            {name: "URL", value: `${invite.url}`}
        )
        .setThumbnail("https://maki.gg/emoji/wastebasket.png")
        await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
    })

}