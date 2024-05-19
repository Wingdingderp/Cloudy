const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config()

const client = new Client({ intents: [ Object.keys(GatewayIntentBits), GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent ] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'src/commands/.');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'src/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

// Leave Message //
const welcomeschema = require("./src/Schemas.js/welcomeschema");
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
        .setFooter({ text: `👋 Cast your goobyes`})
        .setTimestamp()
        .setAuthor({ name: `👋 Member Left`})
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')
 
        const welmsg = await channelwelcome.send({ embeds: [embedleave]}).catch(err);
        welmsg.react('👋');
    }
})
 
// Welcome Message //
const roleschema = require("./src/Schemas.js/autorole");
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
         .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')
 
        const embedwelcomedm = new EmbedBuilder()
         .setColor("DarkBlue")
         .setTitle('Welcome Message')
         .setDescription( `> Welcome to ${member.guild.name}!`)
         .setFooter({ text: `👋 Get cozy and enjoy :)`})
         .setTimestamp()
         .setAuthor({ name: `👋 Welcome to the Server!`})
         .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')
 
        const levmsg = await channelwelcome.send({ embeds: [embedwelcome]});
        levmsg.react('👋');
        member.send({ embeds: [embedwelcomedm]}).catch(err => console.log(`Welcome DM error: ${err}`))
 
    } 
})

//AFK System
const afkSchema = require('./src/Schemas.js/afkSchema');
client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;

    const check = await afkSchema.findOne({ Guild: message.guild.id, User: message.author.id});
    if (check) {
        const nick = check.Nickname;
        await afkSchema.deleteMany({ Guild: message.guild.id, User: message.author.id});

        await message.member.setNickname(`${nick}`).catch(err => {
            return;
        })

        const m1 = await message.send({ content: `Welcome back, ${message.author}! I have removed your afk`, ephemeral: true});
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
            const m = await message.send({ content: `${member.user.tag} is currently AFK: ${msg}`});
        }
    }
})


//Level System
const levelRoles = {
	5: process.env.DISCORD_LEVEL_5,
    10: process.env.DISCORD_LEVEL_10,
    15: process.env.DISCORD_LEVEL_15,
    20: process.env.DISCORD_LEVEL_20
}; 

const level = require("./src/Schemas.js/level");
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
    const give = 1;

    const requiredXP = data.Level * data.Level * 20 + 20;

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

//Starboard System
const starboard = require('./src/Schemas.js/starboardschema');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute (reaction, user, client) {

        if (!reaction.message.guildId) return;

        var data = await starboard.findOne({ Guild: reaction.message.guildId });
        if (!data) return;
        else {
            if (reaction._emoji.name !== '⭐') return;

            var guild = await client.guilds.cache.get(reaction.message.guildId);
            var sendChannel = await guild.channels.fetch(data.Channel);
            var channel = await guild.channels.fetch(reaction.message.channelId);
            var message = await channel.messages.fetch(reaction.message.id);

            if (message.author.id == client.user.id) return;

            var newReaction = await message.reactions.cache.find(reaction => reaction.emoji.id === reaction._emoji.id);

            if (newReaction.count >= data.Count) {
                var msg = message.content || 'No content available';

                const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.avatarURL()}` })
                .setDescription(`${msg} \n\n**[Click to jump to message!](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})**`)
                .setTimestamp();

                await sendChannel.send({ content: `**⭐ ${newReaction.count} | ${channel}**`, embeds: [embed] }).then(async m => {
                    await m.react('⭐').catch(err => {});
                });
                
            }
        }
    }
}
