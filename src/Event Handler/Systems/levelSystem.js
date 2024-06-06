const { Events, EmbedBuilder } = require('discord.js');
const level = require("../../Schemas.js/level");
const levelRoles = {
	5: process.env.DISCORD_LEVEL_5,
    10: process.env.DISCORD_LEVEL_10,
    15: process.env.DISCORD_LEVEL_15,
    20: process.env.DISCORD_LEVEL_20
}; 

module.exports = async (client) => {
client.on(Events.MessageCreate, async (message) => { // Make sure to define Events at the top.
    const { guild, author, member } = message;

    if (!guild || author.bot) return;

    let data = await level.findOne({ Guild: guild.id, User: author.id }).exec();

    if (!data) {
        data = await level.create({
            Guild: guild.id,
            User: author.id,
            XP: 0,
            Level: 0
        });
    }

	const channelID = process.env.LEVEL_UP;
	const channel = await guild.channels.cache.get(channelID);
    const give = 20;

    const requiredXP = ((140 * data.Level * data.Level) - (100 * data.Level)) - ((140 * (data.Level-1) * (data.Level-1)) - (100 * (data.Level-1)));

    if (data.XP + give >= requiredXP) {
        data.XP += give;
        data.Level += 1;


      // Addon:
        for (const [level, roleId] of Object.entries(levelRoles)) {
            if (data.Level >= parseInt(level) && !member.roles.cache.has(roleId)) {
                const role = guild.roles.cache.get(roleId);
                if (role) await member.roles.add(role);
            }
        }
     
        await data.save();

        if (!channel) return;

        const embed = new EmbedBuilder();
        embed.setColor('Random')
        embed.setDescription(`${author} has leveled up to **Level ${data.Level}**!`);

        channel.send({ embeds: [embed] });
    } else {
        data.XP += give;
        await data.save();
        }
    });
}