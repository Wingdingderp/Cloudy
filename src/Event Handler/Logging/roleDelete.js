const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const Audit_Log = require("../../Schemas.js/auditlog");
const log_actions = require("../../Schemas.js/logactions");
const token = require("../../../encrypt").token(5);
const perm = require("../../../functions").perm;

module.exports = async (client) => {
    //Role Delete
    client.on(Events.GuildRoleDelete, async (role) => {
        perm(role);
        const auditEmbed = new EmbedBuilder().setColor( 'Blue').setTimestamp().setFooter({ text: "Logging System"})
        const data = await Audit_Log.findOne({
            Guild: role.guild.id,
        })
        let logID;
        if (data) {
            logID = data.Channel
        } else {
            return;
        }
        const auditChannel = client.channels.cache.get(logID);
        auditEmbed.setTitle("Role Removed").addFields(
            {name: "Role Name:", value: role.name, inline: false},
            {name: "Role ID:", value: role.id, inline: false}
        )
        await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
    })

}