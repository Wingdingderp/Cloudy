const { Events } = require('discord.js');
const afkSchema = require('../../Schemas.js/afkSchema');

module.exports = async (client) => {
client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;

    const check = await afkSchema.findOne({ Guild: message.guild.id, User: message.author.id});
    if (check) {
        const nick = check.Nickname;
        await afkSchema.deleteMany({ Guild: message.guild.id, User: message.author.id});

        await message.member.setNickname(`${nick}`).catch(err => {
            console.log(err)
            return;
        })

        const m1 = await message.reply({ content: `Welcome back, ${message.author}! I have removed your afk`, ephemeral: true});
        setTimeout(() => {
            m1.delete();
        }, 4000)
    } else {

        const members = message.mentions.users.first();
        if (!members) return;
        const Data = await afkSchema.findOne({ Guild: message.guild.id, User: members.id});
        if (!Data) return;

        const member = message.guild.members.cache.get(members.id);
        const msg = Data.Message || `No Reason Given`;

        if (message.content.includes(members)) {
            const m = await message.reply({ content: `${member.user.tag} is currently AFK: ${msg}`, mention_author: false});
            }
        }
    })
}