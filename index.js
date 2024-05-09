const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config()
const mongoose = require('mongoose');

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
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

// Login to MongoDB
(async () => {
	try {
	  mongoose.set('strictQuery', false);
	  await mongoose.connect(process.env.mongoURL);
	  console.log('Connected to MongoDB.');
	}
  catch (err) {
	  console.log(err);
	}
})();

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

//Counting
const counting = require("./src/Schemas.js/countingschema");
client.on(Events.MessageCreate, async message => {
    if (!message.guild) return;
    if (message.author.bot) return;

    const data = await counting.findOne({ Guild: message.guild.id});
    if (!data) return;
    else {

        if (message.channel.id !== data.Channel) return;

        const number = Number(message.content);

        if (number !== data.Number) {
            return message.react(`❌`);
        } else if (data.LastUser === message.author.id) {
            message.react(`❌`);
            const msg = await message.reply(`❌ Someone else has to count that number!`);

            setTimeout(async () => {
                await msg.delete();
            }, 5000);
        } else {
            await message.react(`✅`);

            data.LastUser = message.author.id;
            data.Number++;
            await data.save();
        }

    }
});
