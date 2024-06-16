const { EmbedBuilder } = require('discord.js');
const countingSchema = require('../Schemas.js/countingSchema');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        const countingData = await countingSchema.findOne({ Guild: message.guild.id });
        if (!countingData) return;

        if (message.channel.id !== countingData.Channel) return;

        const number = parseInt(message.content);

        if (isNaN(number) || number.toString() !== message.content) return;

        const member = message.member;
        const lastUser = countingData.LastUser

        if (lastUser === message.author.id) {
            const soloCountEmbed = new EmbedBuilder()
        .setTitle('You cannot count solo!')
        .setDescription(`You cannot count on your own!`)
        .setColor('Red')
        .setTimestamp()
        .setFooter({ text: 'Wrong Number' });

    await message.channel.send({ embeds: [soloCountEmbed] });
    await message.react('❌')

    countingData.Count = 0;
    countingData.LastUser = null;
    await countingData.save();
        }

        if (countingData.Count === 0) {
            if (number !== 1) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Incorrect Number')
                    .setDescription('You must type 1 before continuing onto other numbers.')
                    .setTimestamp()
                    .setFooter({ text: `Incorrect Number At` })
                    .setColor('Red');

                await message.channel.send({ embeds: [errorEmbed] });
                await message.react('⚠️')
                return;
            }
        }

        if (number === countingData.Count + 1) {
            countingData.LastUser = message.author.id
            countingData.Count++;
            await countingData.save();

            await message.react('✅');

            // Check if the quarter goal has been reached
            if (countingData.Count === Math.floor(countingData.MaxCount / 4)) {
                const quarterGoalEmbed = new EmbedBuilder()
                    .setTitle('Quarter Goal Reached!')
                    .setDescription(`You have reached a quarter of the goal. Keep going! Only ${countingData.MaxCount - countingData.Count} numbers left!`)
                    .setTimestamp()
                    .setFooter({ text: 'Quarter Goal Reached' })
                    .setColor('Blue');

                await message.channel.send({ embeds: [quarterGoalEmbed] });
            }

            // Check if the halfway goal has been reached
            if (countingData.Count === Math.floor(countingData.MaxCount / 2)) {
                const halfwayGoalEmbed = new EmbedBuilder()
                    .setTitle('Halfway Goal Reached!')
                    .setDescription(`You are halfway to the goal. ${countingData.MaxCount - countingData.Count} numbers left to reach the goal!`)
                    .setTimestamp()
                    .setFooter({ text: 'Halfway Goal Reached' })
                    .setColor('Purple');

                await message.channel.send({ embeds: [halfwayGoalEmbed] });
            }

            // Check if the maximum count has been reached
            if (countingData.Count === countingData.MaxCount) {
                const congratulationsEmbed = new EmbedBuilder()
                    .setTitle('Congratulations!')
                    .setDescription(`${message.author.username}, you have reached the goal of **${countingData.MaxCount}**! Well done!`)
                    .setTimestamp()
                    .setFooter({ text: 'Game Complete' })
                    .setColor('Gold');

                const congratsReact = await message.channel.send({ embeds: [congratulationsEmbed] });
                congratsReact.react('🏆');

                countingData.Count = 0;
                await countingData.save();
            }
        } else {
            const wrongNumberEmbed = new EmbedBuilder()
                .setTitle('Wrong Number')
                .setDescription(`${message.author.username} has ruined the fun at number **${countingData.Count}**.`)
                .setColor('Red')
                .setTimestamp()
                .setFooter({ text: 'Wrong Number' });

            await message.channel.send({ embeds: [wrongNumberEmbed] });
            await message.react('❌')

            countingData.Count = 0;
            countingData.LastUser = null;
            await countingData.save();
        }
 
    },
};