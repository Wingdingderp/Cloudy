const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const Giveaway = require('../../Schemas.js/giveawaySchema'); 
const {generateRandomCode, convertToMilliseconds, convertUnix} = require("../../../functions")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Manage giveaways')
        .addSubcommand(subcommand =>
            subcommand.setName('start')
                .setDescription('Start a new giveaway')
                .addStringOption(option => option.setName('duration').setDescription('Select an Input').setRequired(true).addChoices(
                    { name: "15 Minutes", value: "900000" },
                    { name: "30 Minutes", value: "1800000" },
                    { name: "45 Minutes", value: "2700000" },
                    { name: "6 Hours", value: "21600000" },
                    { name: "12 Hours", value: "43200000" },
                    { name: "1 Day", value: "86400000" },
                    { name: "2 Days", value: "172800000" },
                    { name: "3 Days", value: "259200000" },
                    { name: "4 Days", value: "345600000" },
                    { name: "5 Days", value: "432000000" },
                    { name: "6 Days", value: "518400000" },
                    { name: "7 Days", value: "604800000" }                
                ))
                .addStringOption(option => option.setName('prize').setDescription('Prize of the giveaway').setRequired(true))
                .addIntegerOption(option => option.setName('winners').setDescription('Number of winners').setRequired(true))
                .addChannelOption(option => option.setName('channel').setDescription('Channel to post the giveaway').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand.setName('end')
                .setDescription('End an existing giveaway')
                .addStringOption(option => option.setName('giveaway_id').setDescription('ID of the giveaway to end').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand.setName('reroll')
                .setDescription('Reroll a giveaway')
                .addStringOption(option => option.setName('giveaway_id').setDescription('ID of the giveaway to reroll').setRequired(true))
                .addIntegerOption(option => option.setName('winners').setDescription('Number of new winners').setRequired(true))
        ),

    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            await interaction.reply({
                content: "You are not allowed to execute this command. Missing Permission(s): ManageMembers",
                ephemeral: true
            })
        } else {
            switch (subcommand) {
                case 'start':
                    await startGiveaway(interaction, client);
                    break;
                case 'end':
                    await endGiveaway(interaction, client);
                    break;
                case 'reroll':
                    await rerollGiveaway(interaction, client);
                    break;
                default:
                    await interaction.reply({ content: 'Invalid subcommand', ephemeral: true });
            }
        }
    }
};

async function startGiveaway(interaction, client) {
    const duration = parseInt(interaction.options.getString('duration'));
    const prizex = interaction.options.getString('prize');
    const winnersCountX = interaction.options.getInteger('winners');
    const channel = interaction.options.getChannel('channel');

    const ms = parseInt(duration);

    const unix = convertUnix(ms);

    const endTimeX = new Date(Date.now() + ms + 3600000);
    const endTimeX2 = new Date(Date.now() + ms);

    const code = generateRandomCode(5)

    const embed = new EmbedBuilder()
        .setTitle("🎉 Giveaway 🎉")
        .setDescription(`Prize: ${prizex}\nEnds: <t:${Math.trunc(endTimeX2.getTime()/1000)}:R> \nWinners: ${winnersCountX}`)
        .setFooter({ text: `ID: ${code}` })
        .setColor(0x00FFFF);

    const sentMessage = await channel.send({ embeds: [embed], components: [] });

    await Giveaway.create({
        guildId: interaction.guild.id,
        channelId: channel.id,
        messageId: sentMessage.id,
        endTime: endTimeX,
        prize: prizex,
        winnersCount: winnersCountX,
        participants: [],
        id: code,
        ended: false
    });

    const joinButton = new ButtonBuilder()
        .setCustomId(`giveaway-join-${code}`)
        .setLabel('Join Giveaway')
        .setStyle(ButtonStyle.Primary);

    const actionRow = new ActionRowBuilder().addComponents(joinButton);

    await sentMessage.edit({ components: [actionRow] })

    await interaction.reply({ content: 'Giveaway started!', ephemeral: true });
}


async function endGiveaway(interaction, client) {
    const giveawayId = interaction.options.getString('giveaway_id');
    const giveaway = await Giveaway.findOne({id: giveawayId});

    if (!giveaway) {
        return interaction.reply({ content: "Giveaway not found.", ephemeral: true });
    }

    // Select winners
    const winners = selectWinners(giveaway.participants, giveaway.winnersCount);
    const winnersText = winners.map(winner => `<@${winner}>`).join(', ');
    const announcement = `🎉 The giveaway has ended! Congratulations to the winners: ${winnersText}`;

    // Fetch the giveaway message
    try {
        const channel = await client.channels.fetch(giveaway.channelId);
        const message = await channel.messages.fetch(giveaway.messageId);

        const embed = new EmbedBuilder({ description: "ENDED" })
        await message.edit({ embeds: [embed], components: [] }); // Remove buttons

        // Announce the winners in the same channel
        await channel.send(announcement);
    } catch (error) {
        console.error("Error ending giveaway:", error);
        return interaction.reply({ content: "There was an error ending the giveaway.", ephemeral: true });
    }

    // Update the giveaway as ended in the database
    giveaway.ended = true;
    await giveaway.save();

    await interaction.reply({ content: "Giveaway ended successfully.", ephemeral: true });
}

function selectWinners(participants, count) {
    // Shuffle array and pick 'count' winners
    let shuffled = participants.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}



async function endGiveaway(interaction, client) {
    const giveawayId = interaction.options.getString('giveaway_id');
    const newWinnersCount = interaction.options.getInteger('winners');

    const giveaway = await Giveaway.findOne({ id: giveawayId });
    if (!giveaway) {
        return interaction.reply({ content: 'Giveaway not found.', ephemeral: true });
    }

    const winners = selectWinners(giveaway.participants, newWinnersCount || giveaway.winnersCount);
    const winnersText = winners.map(winner => `<@${winner}>`).join(', ');
    const announcement = `🎉 The giveaway has ended! Congratulations to the winners: ${winnersText}`;

    try {
        const channel = await client.channels.fetch(giveaway.channelId);
        const message = await channel.messages.fetch(giveaway.messageId);

        const embed = new EmbedBuilder({ description: "ENDED" })
            .setFooter({ text: `ID: ${giveaway.id}` }); // Include giveaway ID in the footer
        await message.edit({ embeds: [embed], components: [] });

        await channel.send(announcement);
    } catch (error) {
        console.error("Error ending giveaway:", error);
        return interaction.reply({ content: "There was an error ending the giveaway.", ephemeral: true });
    }

    giveaway.ended = true;
    await giveaway.save();

    await interaction.reply({ content: "Giveaway ended successfully.", ephemeral: true });
}

async function rerollGiveaway(interaction, client) {
    const giveawayId = interaction.options.getString('giveaway_id');
    const newWinnersCount = interaction.options.getInteger('winners');

    const giveaway = await Giveaway.findOne({ id: giveawayId });
    if (!giveaway) {
        return interaction.reply({ content: 'Giveaway not found.', ephemeral: true });
    }

    const newWinners = selectWinners(giveaway.participants, newWinnersCount);
    const winnersText = newWinners.map(winner => `<@${winner}>`).join(', ');
    const announcement = `🎉 New winners: ${winnersText}!`;

    const channel = await client.channels.fetch(giveaway.channelId);
    await channel.send(announcement);

    await interaction.reply({ content: 'Giveaway rerolled!', ephemeral: true });
}