const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType, PermissionsBitField, ButtonBuilder, ButtonStyle } = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
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

//Ticket System
const ticketcategory = process.env.TICKET_CATEGORY
const staffrole = process.env.DISCORD_TICKET_MANAGER_ROLE
const User = require('./src/Schemas.js/userSchema');


client.on(Events.InteractionCreate, async interaction => {
	if (interaction.customId === 'ticket') {
  
	const ticketmodal = new ModalBuilder()
	.setCustomId('ticketmodal')
	.setTitle('ticket')
  
	const q1 = new TextInputBuilder()
	.setCustomId('q1')
	.setLabel("What's the reason for this ticket?")
	.setStyle(TextInputStyle.Short);
  
  
  
  
	const q1m = new ActionRowBuilder().addComponents(q1);
	ticketmodal.addComponents(q1m);
  
	await interaction.showModal(ticketmodal);
	
  
	const filter = (interaction) => interaction.customId === 'ticketmodal';
  
	interaction
	.awaitModalSubmit({ filter, time: 60000 })
	.then(async (interaction) => {


	  const q1 = interaction.fields.getTextInputValue('q1'); 
	  const newChannelcreator = interaction.user
	  const newChannelcreatorid = interaction.user.id

      let ticketCounter = 1;

      let paddedNum = String(ticketCounter).padStart(4, '0'); // '0001'

	  const data = await User.findOne({ channelid: { $gt: 0 } })
	  if (data)  { 
		const embed = new EmbedBuilder()
		.setTitle('Ticket is already opened')
		.setDescription('You already have an opened ticket.')
		.setTimestamp()
		.setColor('Blue')
		await interaction.reply({ embeds: [embed], ephemeral: true })
		} else {

		  const newChannel = await interaction.guild.channels.create({
			name: `${paddedNum}-${interaction.user.tag}`,
			type: ChannelType.GuildText,
			parent: ticketcategory,
			permissionOverwrites: [
				{
					id: interaction.guild.id,
					deny: [PermissionsBitField.Flags.ViewChannel],
				},
				{
					id: interaction.user.id,
					allow: [PermissionsBitField.Flags.ViewChannel],
				},
				{
					id: staffrole, 
					allow: [PermissionsBitField.Flags.ViewChannel],
				}
			],
			
			});
            const data = await User.findOne({ username: interaction.user.tag })
            if (!data) {
			await User.create({
				username: interaction.user.tag,
				tickets: ticketCounter++,
				channelid: `${newChannel.id}`
			  })}

			const embed = new EmbedBuilder()
			.setTitle('Ticket')
			.setDescription(`Your ticket was just opened and can be found here: ${newChannel}.`)
			.setTimestamp()
			.setColor('Blue')
			await interaction.reply({ embeds: [embed], ephemeral: true })

			const close = new ButtonBuilder()
			.setCustomId('close')
			.setLabel('Close')
			.setEmoji('❌')
			.setStyle(ButtonStyle.Danger);

			const claim = new ButtonBuilder()
			.setCustomId('claim')
			.setLabel('Claim')
			.setEmoji('✅')
			.setStyle(ButtonStyle.Success);

			const transcript = new ButtonBuilder()
			.setCustomId('transcript')
			.setLabel('Transcript')
			.setEmoji('📒')
			.setStyle(ButtonStyle.Primary)

			const row = new ActionRowBuilder()
			.addComponents(close, claim, transcript)

			const embed2 = new EmbedBuilder()
			.setTitle('Ticket')
			.setDescription(`Hey ${newChannelcreator}! One of our staff members will get back to you sometime soon. Please take into consideration that mentioning people **IS NOT** allowed and might result into your ticket getting closed.\n\n**Reason for Contact**: ${q1}`)
			.setTimestamp()
			.setColor('Blue')
			await newChannel.send({embeds: [embed2], components: [row] })
		    }
		})
    }
})

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.customId === 'close') {

		const embed = new EmbedBuilder()
		.setTitle('Confirm')
		.setDescription('Are you sure you want to close this ticket?')
		.setTimestamp()
		.setFooter({ text: `Action taken by: ${interaction.user.tag}` })

		const yes = new ButtonBuilder()
		.setCustomId('yes')
		.setLabel('Yes')
		.setEmoji('✅')
		.setStyle(ButtonStyle.Secondary)
		const no = new ButtonBuilder()
		.setCustomId('no')
		.setLabel('No')
		.setStyle(ButtonStyle.Secondary)
		.setEmoji('❌')

		const row = new ActionRowBuilder()
		.addComponents(yes, no)

		await interaction.reply({ embeds: [embed], components: [row] })


	


	}
})

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.customId === 'yes') {
		if (!interaction.member.roles.cache.has(staffrole)) return await interaction.reply({ content: `Invalid Permissions to close the ticket.`, ephemeral: true })
		await User.updateOne({
            username: interaction.user.tag,
			channelid: `0`
		  })

		const embed2 = new EmbedBuilder()
		.setTitle('Transcript Generated')
		.setDescription('A ticket channel transcript has been attached')
		.setTimestamp()
		.setColor('Blue')
		const transcriptlogchannel = interaction.client.channels.cache.get(process.env.TRANSCRIPT_CHANNEL)
	
		const channel = interaction.channel; 
	
	
		const attachment = await discordTranscripts.createTranscript(channel);
		await transcriptlogchannel.send({ embeds: [embed2],  ephemeral: false})
		await transcriptlogchannel.send({ files: [attachment] })

		await interaction.channel.delete()

	}
})

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.customId === 'no') {
		if (!interaction.member.roles.cache.has(staffrole)) return await interaction.reply({ content: `Invalid Permissions to take action within this ticket.`, ephemeral: true })
		const embed = new EmbedBuilder()
	.setTitle('Action Cancelled')
	.setDescription('This ticket wont be closed.')
	.setTimestamp()
	.setColor('Blue')
	const yes = new ButtonBuilder()
	.setCustomId('yes')
	.setLabel('Yes')
	.setEmoji('✅')
	.setStyle(ButtonStyle.Secondary)
	.setDisabled(true)

	const no = new ButtonBuilder()
	.setCustomId('no')
	.setLabel('No')
	.setEmoji('❌')
	.setStyle(ButtonStyle.Secondary)
	.setDisabled(true)


	const row = new ActionRowBuilder()
	.addComponents(yes, no)

		await interaction.message.edit({ embeds: [embed], ephemeral: false, components: [row] })
		await interaction.reply({ content: `Action has been taken`, ephemeral: true})

	}
})


client.on(Events.InteractionCreate, async interaction => {
	if (interaction.customId === 'claim') {
		if (!interaction.member.roles.cache.has(staffrole)) return await interaction.reply({ content: `Invalid Permissions to take action within this ticket.`, ephemeral: true })

		const embed = new EmbedBuilder()
		.setTitle('Ticket Claimed')
		.setDescription(`Your ticket has been claimed by ${interaction.user}`)
		.setTimestamp()
		.setColor('Green')
		await interaction.reply({ content: 'The ticket has now been claimed', ephemeral: true })
		await interaction.channel.send({ embeds: [embed] })


		const close = new ButtonBuilder()
		.setCustomId('close')
		.setLabel('Close')
		.setEmoji('🔞')
		.setStyle(ButtonStyle.Secondary);

		const claim = new ButtonBuilder()
		.setCustomId('claim')
		.setLabel('Claim')
		.setEmoji('✅')
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(true);

		const transcript = new ButtonBuilder()
		.setCustomId('transcript')
		.setLabel('Transcript')
		.setEmoji('📒')
		.setStyle(ButtonStyle.Secondary)

		const row = new ActionRowBuilder()
		.addComponents(close, claim, transcript)

		await interaction.message.edit({ components: [row], ephemeral: false })


	}
})


client.on(Events.InteractionCreate, async interaction => {
	if (interaction.customId === 'transcript') {
		if (!interaction.member.roles.cache.has(staffrole)) return await interaction.reply({ content: `Invalid Permissions to take action within this ticket.`, ephemeral: true })
		const embed = new EmbedBuilder()
	.setTitle('Transcript Generated')
	.setDescription('Your channel transcript has been attached below.')
	.setTimestamp()
	.setColor('Green')
	await interaction.reply({ content: `Transcript has been generated`, ephemeral: true })

	const channel = interaction.channel; 


	const attachment = await discordTranscripts.createTranscript(channel);


	await interaction.channel.send({ embeds: [embed],  ephemeral: false})
	await interaction.channel.send({ files: [attachment] })

	}
})

