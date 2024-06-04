const { Events, EmbedBuilder  } = require('discord.js');
const roleschema = require("../../Schemas.js/autorole");

module.exports = async (client) => {
client.on(Events.GuildMemberAdd, async (member, err) => {
 
    const welcomedata = await welcomeschema.findOne({ Guild: member.guild.id });
 
    if (!welcomedata) return;
    else {
 
        const channelID = welcomedata.Channel;
        const channelwelcome = member.guild.channels.cache.get(channelID)
        const roledata = await roleschema.findOne({ Guild: member.guild.id });
 
        if (roledata) {
            const giverole = await member.guild.roles.cache.get(roledata.Role)
 
            member.roles.add(giverole).catch(err => {
                console.log('Error received trying to give an auto role!');
            })
        }
 
        const embedwelcome = new EmbedBuilder()
         .setColor("DarkBlue")
         .setTitle(`${member.user.username} has arrived\nto the Server!`)
         .setDescription( `> Welcome ${member} to the Server!`)
         .setFooter({ text: `👋 Get cozy and enjoy :)`})
         .setTimestamp()
         .setAuthor({ name: `👋 Welcome to the Server!`})
         .setThumbnail('https://cdn.discordapp.com/attachments/1209222106278006787/1243557911469490256/IMG_0922.png?ex=66548c0e&is=66533a8e&hm=e123af3fe457c3858851f5d90ea21037e2a86f4c70e50344520f125d407415da&')
 
        const embedwelcomedm = new EmbedBuilder()
         .setColor("DarkBlue")
         .setTitle('Welcome Message')
         .setDescription( `> Welcome to ${member.guild.name}!`)
         .setFooter({ text: `👋 Get cozy and enjoy :)`})
         .setTimestamp()
         .setAuthor({ name: `👋 Welcome to the Server!`})
         .setThumbnail('https://cdn.discordapp.com/attachments/1209222106278006787/1243557911469490256/IMG_0922.png?ex=66548c0e&is=66533a8e&hm=e123af3fe457c3858851f5d90ea21037e2a86f4c70e50344520f125d407415da&')
 
        const welmsg = await channelwelcome.send({ embeds: [embedwelcome]});
        member.send({ embeds: [embedwelcomedm]}).catch(err => console.log(`Welcome DM error: ${err}`))
 
        } 
    })
}