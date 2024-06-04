const { EmbedBuilder, Events } = require('discord.js');
const Audit_Log = require('../../Schemas.js/auditlog');
const { perm } = require('../../../functions');

module.exports = async (client) => {
    client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
        console.log("GuildMemberUpdate event triggered");  

        if (!perm(oldMember)) {
             console.log("Permission check failed");  
             return;
         }

         const auditEmbed = new EmbedBuilder()
             .setColor('Red')
             .setTimestamp()
             .setFooter({ text: 'Logging System' });

         const data = await Audit_Log.findOne({ Guild: oldMember.guild.id }).catch(err => {
             console.error("Error fetching Audit_Log:", err);
             return null;
         });

         if (!data || !data.memberLog) {
             console.log("No channel data found or no channel set");  
             return;
         }

         const auditChannel = client.channels.cache.get(data.memberLog);
         if (!auditChannel) {
             console.log("Audit channel not found"); 
             return;
         }

         const changes = [];

         if (oldMember.nickname !== newMember.nickname) {
             changes.push(`Nickname: \`${oldMember.nickname || 'None'}\` → \`${newMember.nickname || 'None'}\``);
         }

         if (!oldMember.roles.cache.equals(newMember.roles.cache)) {
             const oldRoles = oldMember.roles.cache.map(role => role.name).join(', ');
             const newRoles = newMember.roles.cache.map(role => role.name).join(', ');
             changes.push(`\n <@${newMember.id}>\n\n **Changes:**\nRoles: \`${oldRoles}\` → \`${newRoles}\``);
         }

         if (changes.length === 0) {
             console.log("No changes detected");  
             return;
         }

         auditEmbed
             .setTitle('Member Updated')
             .setThumbnail(newMember.displayAvatarURL())
             .addFields({ name: '**Member:**', value: changes.join('\n') });

         await auditChannel.send({ embeds: [auditEmbed] }).catch(err => {
             console.error('Failed to send audit log message:', err);
         });
    });
};
