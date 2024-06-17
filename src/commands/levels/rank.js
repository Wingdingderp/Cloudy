const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { EmbedBuilder, AttachmentBuilder } = require(`discord.js`);
const levelSchema = require('../../Schemas.js/level');
const { RankCardBuilder, Font } = require("canvacord");

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`rank`)
    .setDescription(`Gets a members rank in the server`)
    .addUserOption(option => option.setName('user').setDescription(`The member you want to check the rank of`).setRequired(false)),
    async execute (interaction) {
        const { options, user, guild } = interaction;

        const Member = options.getMember('user') || user;

        const member = guild.members.cache.get(Member.id);
        
        const mention = '@'
        const fullMention = mention + member.user.username

        const Data = await levelSchema.findOne({ Guild: guild.id, User: member.id });

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark:  ${member} has not gained any XP yet`)

        if (!Data) return await interaction.reply({ embeds: [embed] });

        await interaction.deferReply();

        const Required = ((140 * (Data.Level + 1) * (Data.Level + 1)) - (100 * (Data.Level + 1))) - ((140 * Data.Level * Data.Level) - (100 * Data.Level));
        const Progress = Data.XP - ((140 * Data.Level * Data.Level) - (100 * Data.Level));
        
        const Sorted = await levelSchema.find({ Guild: guild.id})
            .sort({
                XP: -1,
                Level: -1
            })

        Font.loadDefault(20);

        const rank = new RankCardBuilder()
        .setAvatar(member.displayAvatarURL({ forseStatic: true}))
        .setBackground('https://cdn.discordapp.com/attachments/1251654427107135621/1252258635929620520/Untitled26_20240617104837.png?ex=6671903c&is=66703ebc&hm=d394adb34545234a2ca70178775bde2ada76aa225a58bfa6ea2cc34dccb319ac&')
        .setCurrentXP(Progress)
        .setRequiredXP(Required)
        .setRank(findRank(Sorted, member), "Rank", false)
        .setLevel(Data.Level, "Level")
        .setDisplayName(interaction.guild.name)
        .setUsername(fullMention)

        const Card = await rank.build();

        const attachment = new AttachmentBuilder(Card, { name: "rank.png"});

        const embed2 = new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`${member.user.username}'s Level / Rank`)
        .setImage("attachment://rank.png")

        await interaction.editReply({ embeds: [embed2], files: [attachment] })
    }
}

function findRank(sorted, member) {
    let rankNumber = 0;
    for (let counter = 0; counter < sorted.length; ++counter) {
        let { User, XP, Level } = sorted[counter];
        const testIfMember = User;
        console.log(`${testIfMember}, ${member}`)
        rankNumber = rankNumber + 1
        if (testIfMember == member) {
            return rankNumber;
        };
    };
}