const { Events, EmbedBuilder } = require('discord.js');
const level = require("../../Schemas.js/level");
const levelRoles = {
	5: process.env.DISCORD_LEVEL_5,
    10: process.env.DISCORD_LEVEL_10,
    15: process.env.DISCORD_LEVEL_15,
    20: process.env.DISCORD_LEVEL_20,
    25: process.env.DISCORD_LEVEL_25,
    30: process.env.DISCORD_LEVEL_30,
    35: process.env.DISCORD_LEVEL_35,
    40: process.env.DISCORD_LEVEL_40
}; 
const ignoreChannels = ['1153803743247216741']; // 1153803743247216741 is safe cloud's spam channel

module.exports = async (client) => {
client.on(Events.MessageCreate, async (message) => { // Make sure to define Events at the top.
    const { guild, author, member } = message;

    if (!guild || author.bot) return;
    if (ignoreChannels.includes(`${message.channel.id}`)) return;

    let data = await level.findOne({ Guild: guild.id, User: author.id }).exec();

    if (!data) {
        data = await level.create({
            Guild: guild.id,
            User: author.id,
            XP: 0,
            Level: 0
        });
    }

	const channelID = process.env.DISCORD_LEVEL_UP;
	const channel = await guild.channels.cache.get(channelID);
    const give = 20;

    const requiredXP = ((140 * (data.Level + 1) * (data.Level + 1)) - (100 * (data.Level + 1)));

    if (data.XP + give >= requiredXP) {
        data.XP += give;
        data.Level += 1;


      // Addon:
        for (const [level, roleId] of Object.entries(levelRoles)) {
            const role = guild.roles.cache.get(roleId);
            if (data.Level >= parseInt(level) && !member.roles.cache.has(roleId)) {
                if (role) await member.roles.add(role);
            }
            if ((data.Level - 5) >= parseInt(level)) { // Only works if the gap between level roles is exactly 5, aka if gap is ever increased we need a new fix
                if (role) await member.roles.remove(role);
            }
        }
     
        await data.save();

        if (!channel) return;

        const embed = new EmbedBuilder();
        embed.setColor(0x789575)
        embed.setDescription(`${author} has leveled up to **Level ${data.Level}**!`);

        const invis_ping_prefix = "||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| _ _ _ _ _ _"
        channel.send({ embeds: [embed], content: `Do **/rank** and **/leaderboard** to know more! ${invis_ping_prefix}${author}` });
    } else {
        data.XP += give;
        await data.save();
        }
    });
}