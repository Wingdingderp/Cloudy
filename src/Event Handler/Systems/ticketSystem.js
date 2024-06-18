const { Events, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType, PermissionsBitField, ButtonBuilder, ButtonStyle, GatewayIntentBits } = require('discord.js');
const ticketcategory = process.env.TICKET_CATEGORY
const staffrole = process.env.DISCORD_TICKET_MANAGER_ROLE
const tickets = require('../../Schemas.js/ticketSchema');
const discordTranscripts = require('discord-html-transcripts')

module.exports = async (client) => {
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
	  doc = await tickets.findOne({ Guild: interaction.guild.id })
	  if (!doc) {
		id = 0
	  } else {
		id = doc.get("id")
	  }
	  nextID = id + 1;

		  const newThread = await interaction.channel.threads.create({
			name: `${nextID.toString().padStart(4, '0')}-${interaction.user.tag}`,
			type: ChannelType.PrivateThread,
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

			const Data = await tickets.findOne({ Guild: interaction.guild.id })
			if (!Data) {
				tickets.create({
					Guild: interaction.guild.id,
					id: nextID
				})
			} else {
			await tickets.findOneAndUpdate({ Guild: interaction.guild.id}, { id: nextID })
		}

			const embed = new EmbedBuilder()
			.setTitle('Ticket')
			.setDescription(`Your ticket was just opened and can be found here: ${newThread}.`)
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
			await newThread.send({content: `||<@here>||`, embeds: [embed2], components: [row] })
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


		const embed2 = new EmbedBuilder()
		.setTitle(`Transcript Generated | ${interaction.channel.name}`)
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
		await interaction.reply({ content: `No action has been taken`, ephemeral: true})

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
		.setEmoji('❌')
		.setStyle(ButtonStyle.Danger);

		const claim = new ButtonBuilder()
		.setCustomId('claim')
		.setLabel('Claim')
		.setEmoji('✅')
		.setStyle(ButtonStyle.Success)
		.setDisabled(true);

		const transcript = new ButtonBuilder()
		.setCustomId('transcript')
		.setLabel('Transcript')
		.setEmoji('📒')
		.setStyle(ButtonStyle.Primary)

		const row = new ActionRowBuilder()
		.addComponents(close, claim, transcript)

		await interaction.message.edit({ components: [row], ephemeral: false })


	}
})


client.on(Events.InteractionCreate, async interaction => {
	if (interaction.customId === 'transcript') {
		if (!interaction.member.roles.cache.has(staffrole)) return await interaction.reply({ content: `Invalid Permissions to take action within this ticket.`, ephemeral: true })

		const embed = new EmbedBuilder()
	.setTitle(`Transcript Generated | ${interaction.channel.name}`)
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
}