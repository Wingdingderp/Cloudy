const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const Audit_Log = require("../../Schemas.js/auditlog");
const log_actions = require("../../Schemas.js/logactions");
const token = require("../../../encrypt").token(5);
const perm = require("../../../functions").perm;

module.exports = async (client) => {
    //Role Create
    client.on(Events.GuildRoleCreate, async (role) => {
        perm(role);
        const data = await Audit_Log.findOne({
            Guild: role.guild.id
        })
        let logID;
        if (data) {
            logID = data.roleLog
        } else {
            return;
        }

        if (!role.iconURL) {
            thumbnail = ("https://maki.gg/emoji/new.png")
        } else {
            thumbnail = role.iconURL
        }
            
        const auditEmbed = new EmbedBuilder().setColor( 'Blue').setTimestamp().setFooter({ text: "Logging System"})
        const auditChannel = client.channels.cache.get(logID);
        auditEmbed.setTitle("Role Created").addFields(
            {name: "Role Name:", value: role.name, inline: false},
            {name: "Role ID:", value: role.id, inline: false}
        )
        .setThumbnail(thumbnail)
        
        await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
    })

}