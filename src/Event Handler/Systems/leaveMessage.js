const { Events, EmbedBuilder } = require('discord.js');
const welcomeschema = require("../../Schemas.js/welcomeschema");

module.exports = async (client) => {
client.on(Events.GuildMemberRemove, async (member, err) => {
 
    const leavedata = await welcomeschema.findOne({ Guild: member.guild.id });
 
    if (!leavedata) return;
    else {
 
        const channelID = leavedata.Channel;
        const channelwelcome = member.guild.channels.cache.get(channelID);
 
        const embedleave = new EmbedBuilder()
        .setColor("DarkBlue")
        .setTitle(`${member.user.username} has left`)
        .setDescription( `> ${member} has left the Server`)
        .setFooter({ text: `👋 Cast your goodbyes`})
        .setTimestamp()
        .setAuthor({ name: `👋 Member Left`})
        .setThumbnail('https://cdn.discordapp.com/attachments/1209222106278006787/1243557911712497715/IMG_0923.png?ex=66548c0e&is=66533a8e&hm=d7da4452408c2aa432bf222bb7be6aa0d8999c2231ce8231ce5e256eb821bcf4&')
 
        const levmsg = await channelwelcome.send({ embeds: [embedleave]}).catch(err);
        }
    })
}