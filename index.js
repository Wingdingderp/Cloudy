const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, AuditLogEvent, EmbedBuilder } = require('discord.js');
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

//Join Role
const autoRole = require('./src/Schemas/AutoRole');

client.on(Events.GuildMemberAdd, async (member, guild) => {

	const role = await autoRole.findOne({ Guild: member.guild.id });
	if (!role) return;
	const giverole = member.guild.roles.cache.get(role.RoleID);
	member.roles.add(giverole);
})

//**Moderation Logs

//Channel Create
client.on(Events.ChannelCreate, async channel => {

	channel.guild.fetchAuditLogs({
		type: AuditLogEvent.ChannelCreate
	})
	.then(async audit => {
		const { executor } = audit.entries.first()

		const name = channel.name;
		const id = channel.id;
		let type = channel.type;

		if (type == 0) type ='Text'
		if (type == 2) type = 'Voice'
		if (type == 13) type = 'Stage'
		if (type == 15) type = 'Form'
		if (type == 5) type = 'Announcement'
		if (type == 4) type = 'Category'

		const channelID = process.env.DISCORD_CHANNEL_LOG;
		const mChannel = await channel.guild.channels.cache.get(channelID);

		const embed = new EmbedBuilder()
		.setColor("Green")
		.setTitle("Channel Created")
		.addFields({ name: "Channel Name", value: `${name} (<#${id}>)`, inline: false})
		.addFields({ name: "Channel Type", value: `${type}`, inline: false})
		.addFields({ name: "Channel ID", value: `${id}`, inline: false})
		.addFields({ name: "Created By", value: `${executor.tag}`, inline: false})
		.setTimestamp()
		.setFooter({ text: "Mod Logging System"})

		mChannel.send({ embeds: [embed] })
	})
})

//Channel Delete
client.on(Events.ChannelDelete, async channel => {

	channel.guild.fetchAuditLogs({
		type: AuditLogEvent.ChannelDelete
	})
	.then(async audit => {
		const { executor } = audit.entries.first()

		const name = channel.name;
		const id = channel.id;
		let type = channel.type;

		if (type == 0) type ='Text'
		if (type == 2) type = 'Voice'
		if (type == 13) type = 'Stage'
		if (type == 15) type = 'Form'
		if (type == 5) type = 'Announcement'
		if (type == 4) type = 'Category'

		const channelID = process.env.DISCORD_CHANNEL_LOG;
		const mChannel = await channel.guild.channels.cache.get(channelID);

		const embed = new EmbedBuilder()
		.setColor("Red")
		.setTitle("Channel Deleted")
		.addFields({ name: "Channel Name", value: `${name}`, inline: false})
		.addFields({ name: "Channel Type", value: `${type}`, inline: false})
		.addFields({ name: "Channel ID", value: `${id}`, inline: false})
		.addFields({ name: "Deleted By", value: `${executor.tag}`, inline: false})
		.setTimestamp()
		.setFooter({ text: "Mod Logging System"})

		mChannel.send({ embeds: [embed] })
	})
})


//Thread Created
client.on(Events.ThreadCreate, async thread => {

	thread.guild.fetchAuditLogs({
		type: AuditLogEvent.ThreadCreate
	})
	.then(async audit => {
		const { executor } = audit.entries.first()

		const name = thread.name;

		const channelID = process.env.DISCORD_CHANNEL_LOG;
		const mChannel = await client.thread.fetch(channelID);

		const embed = new EmbedBuilder()
		.setColor("Green")
		.setTitle("Thread Created")
		.addFields({ name: "Thread Name", value: `${name} (<#${id}>)`, inline: false})
		.addFields({ name: "Thread ID", value: `${id}`, inline: false})
		.addFields({ name: "Created By", value: `${executor.tag}`, inline: false})
		.setTimestamp()
		.setFooter({ text: "Mod Logging System"})

		mChannel.send({ embeds: [embed] })
	})
})

//Thread Deleted
client.on(Events.ThreadDelete, async thread => {

	thread.guild.fetchAuditLogs({
		type: AuditLogEvent.ThreadDelete
	})
	.then(async audit => {
		const { executor } = audit.entries.first()

		const name = thread.name;

		const channelID = process.env.DISCORD_CHANNEL_LOG;
		const mChannel = await client.thread.fetch(channelID);

		const embed = new EmbedBuilder()
		.setColor("Red")
		.setTitle("Thread Deleted")
		.addFields({ name: "Thread Name", value: `${name} (<#${id}>)`, inline: false})
		.addFields({ name: "Thread ID", value: `${id}`, inline: false})
		.addFields({ name: "Deleted By", value: `${executor.tag}`, inline: false})
		.setTimestamp()
		.setFooter({ text: "Mod Logging System"})

		mChannel.send({ embeds: [embed] })
	})
})


//Ban Logs
client.on(Events.GuildBanAdd, async member => {

	member.guild.fetchAuditLogs({
		type: AuditLogEvent.GuildBanAdd
	})
	.then(async audit => {
		const { executor } = audit.entries.first()

		const name = member.user.name;
		const id = member.user.id;


		const channelID = process.env.DISCORD_MODERATION_LOG;
		const mChannel = await channel.guild.channels.cache.get(channelID);

		const embed = new EmbedBuilder()
		.setColor("Red")
		.setTitle("Member Banned")
		.addFields({ name: "Member Name", value: `${name} (<@${id})`, inline: false})
		.addFields({ name: "Member ID", value: `${id}`, inline: false})
		.addFields({ name: "Banned By", value: `${executor.tag}`, inline: false})
		.setTimestamp()
		.setFooter({ text: "Mod Logging System"})

		mChannel.send({ embeds: [embed] })
	})
})

//Unban Logs
client.on(Events.GuildBanRemove, async member => {

	member.guild.fetchAuditLogs({
		type: AuditLogEvent.GuildBanRemove
	})
	.then(async audit => {
		const { executor } = audit.entries.first()

		const name = member.user.name;
		const id = member.user.id;


		const channelID = process.env.DISCORD_MODERATION_LOG;
		const mChannel = await channel.guild.channels.cache.get(channelID);

		const embed = new EmbedBuilder()
		.setColor("Red")
		.setTitle("Member Unbanned")
		.addFields({ name: "Member Name", value: `${name} (<@${id})`, inline: false})
		.addFields({ name: "Member ID", value: `${id}`, inline: false})
		.addFields({ name: "Unbanned By", value: `${executor.tag}`, inline: false})
		.setTimestamp()
		.setFooter({ text: "Mod Logging System"})

		mChannel.send({ embeds: [embed] })
	})
})

//Kick Logs
client.on(Events.MemberKick, async member => {

	member.guild.fetchAuditLogs({
		type: AuditLogEvent.MemberKick
	})
	.then(async audit => {
		const { executor } = audit.entries.first()

		const name = member.user.name;
		const id = member.user.id;

		const channelID = process.env.DISCORD_MODERATION_LOG;
		const mChannel = await channel.guild.channels.cache.get(channelID);

		const embed = new EmbedBuilder()
		.setColor("Red")
		.setTitle("Member Kicked")
		.addFields({ name: "Member Name", value: `${name} (<@${id})`, inline: false})
		.addFields({ name: "Member ID", value: `${id}`, inline: false})
		.addFields({ name: "Kicked By", value: `${executor.tag}`, inline: false})
		.setTimestamp()
		.setFooter({ text: "Mod Logging System"})

		mChannel.send({ embeds: [embed] })
	})
})

//Message Delete
client.on(Events.MessageDelete, async message => {

	message.guild.fetchAuditLogs({
		type: AuditLogEvent.MessageDelete
	})
	.then(async audit => {
		const { executor } = audit.entries.first()

		const mes = message.content;

		if (!mes) return;

		const channelID = process.env.DISCORD_MESSAGES_LOG;
		const mChannel = await message.guild.channels.cache.get(channelID);

		const embed = new EmbedBuilder()
		.setColor("Red")
		.setTitle("Message Deleted")
		.addFields({ name: "Message Content", value: `${mes}`, inline: false})
		.addFields({ name: "Message Channel", value: `${message.channel}`, inline: false})
		.addFields({ name: "Deleted By", value: `${executor.tag}`, inline: false})
		.setTimestamp()
		.setFooter({ text: "Mod Logging System"})

		mChannel.send({ embeds: [embed] })
	})
})

//Message Edit
client.on(Events.MessageUpdate, async (member, newMessage, message) => {

	member.guild.fetchAuditLogs({
		type: AuditLogEvent.MessageUpdate
	})
	.then(async audit => {
		const { executor } = audit.entries.first()

		const mes = message.content;

		if (!mes) return;

		const channelID = process.env.DISCORD_MESSAGES_LOG;
		const mChannel = await client.channels.fetch(channelID);

		const embed = new EmbedBuilder()
		.setColor("Blue")
		.setTitle("Message Edited")
		.addFields({ name: "Old Message", value: `${mes}`, inline: false})
		.addFields({ name: "New Message", value: `${newMessage}`, inline: false})
		.addFields({ name: "Message Channel", value: `${message.channel}`, inline: false})
		.addFields({ name: "Edited By", value: `${executor.tag}`, inline: false})
		.setTimestamp()
		.setFooter({ text: "Mod Logging System"})

		mChannel.send({ embeds: [embed] })
	})
})

//Member Roles Update
/*
client.on('guildMemberUpdate', (oldMember, newMember) => {
    let txtChannel = client.channels.cache.get(process.env.DISCORD_MEMBER_LOG);
    let oldRoleIDs = [];
    oldMember.roles.cache.each(role => {
        console.log(role.name, role.id);
        oldRoleIDs.push(role.id);
    });
    let newRoleIDs = [];
    newMember.roles.cache.each(role => {
        console.log(role.name, role.id);
        newRoleIDs.push(role.id);
    });
    //check if the newRoleIDs had one more role, which means it added a new role
    if (newRoleIDs.length > oldRoleIDs.length) {
        function filterOutOld(id) {
            for (var i = 0; i < oldRoleIDs.length; i++) {
                if (id === oldRoleIDs[i]) {
                    return false;
                }
            }
            return true;
        }
        let onlyRole = newRoleIDs.filter(filterOutOld);

        let IDNum = onlyRole[0];
        //fetch the link of the icon name
        //NOTE: only works if the user has their own icon, else it'll return null if user has standard discord icon
        let icon = newMember.user.avatarURL();
        
        const newRoleAdded = new EmbedBuilder()
            .setTitle('Role added')
            .setAuthor(`${newMember.user.tag}`, `${icon}`)
            .setDescription(`<@&${IDNum}>`)
            .setFooter(`ID: ${IDNum}`)
            .setTimestamp()
    
        txtChannel.send(newRoleAdded);
    }
})
*/

//Role Create
client.on(Events.GuildRoleCreate, async role => {

	role.guild.fetchAuditLogs({
		type: AuditLogEvent.GuildRoleCreate
	})
	.then(async audit => {
		const { executor } = audit.entries.first()

		const name = role.name;
		const id = role.id;

		const channelID = process.env.DISCORD_ROLE_LOG;
		const mChannel = await role.guild.channels.cache.get(channelID);

		const embed = new EmbedBuilder()
		.setColor("Green")
		.setTitle("Role Created")
		.addFields({ name: "Role Name", value: `${name} (<@${id}>)`, inline: false})
		.addFields({ name: "Role ID", value: `${id}`, inline: false})
		.addFields({ name: "Created By", value: `${executor.tag}`, inline: false})
		.setTimestamp()
		.setFooter({ text: "Mod Logging System"})

		mChannel.send({ embeds: [embed] })
	})
})

//Role Updated
/*
client.on(Events.GuildRoleUpdate, async (role, oldRole) => {

	role.guild.fetchAuditLogs({
		type: AuditLogEvent.GuildRoleUpdate
	})
	.then(async audit => {
		const { executor } = audit.entries.first()

		const name = role.name;
		const id = role.id;

		const channelID = process.env.DISCORD_ROLE_LOG;
		const mChannel = await role.guild.channels.cache.get(channelID);

		const embed = new EmbedBuilder()
		.setColor("Blue")
		.setTitle("Role Updated")
		.addFields({ name: "Old Role Name", value: `${oldRole}`, inline: false})
		.addFields({ name: "New Role Name", value: `${name} (<@${id}>)`, inline: false})
		.addFields({ name: "Role ID", value: `${id}`, inline: false})
		.addFields({ name: "Created By", value: `${executor.tag}`, inline: false})
		.setTimestamp()
		.setFooter({ text: "Mod Logging System"})

		mChannel.send({ embeds: [embed] })
	})
})
*/

//Webhook Created
client.on(Events.WebhookCreate, async webhook => {

	channel.guild.fetchAuditLogs({
		type: AuditLogEvent.WebhookCreate
	})
	.then(async audit => {
		const { executor } = audit.entries.first()

		const name = channel.name;
		const id = channel.id;
		let type = channel.type;

		const channelID = process.env.DISCORD_SERVER_LOG;
		const mChannel = await webhook.guild.channels.cache.get(channelID);

		const embed = new EmbedBuilder()
		.setColor("Green")
		.setTitle("Channel Created")
		.addFields({ name: "Channel Name", value: `${name} (<#${id}>)`, inline: false})
		.addFields({ name: "Channel Type", value: `${type}`, inline: false})
		.addFields({ name: "Channel ID", value: `${id}`, inline: false})
		.addFields({ name: "Created By", value: `${executor.tag}`, inline: false})
		.setTimestamp()
		.setFooter({ text: "Mod Logging System"})

		mChannel.send({ embeds: [embed] })
	})
})