const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { EmbedBuilder, AttachmentBuilder } = require(`discord.js`);
const levelSchema = require('../../Schemas.js/level');
const { Font, LeaderboardBuilder } = require("canvacord");

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`xp-leaderboard`)
    .setDescription(`This gets a servers xp leaderboard`),
    async execute (interaction) {

        const { guild, client } = interaction;

        Data = await levelSchema.find({ Guild: guild.id })

        if (!Data) {
        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`⚠️ No one is on the leaderboard yet..`)

        interaction.reply({embeds: [embed] })
        }

 // Fetch all users from the database
 let UserI = await levelSchema.find({ Guild: guild.id})
 let ususs = UserI.sort((a, b) => {
     if (b.Level !== a.Level) {
         return b.Level - a.Level; // First, sort by level
     } else {
         return b.XP - a.XP; // If levels are the same, sort by XP
     }
 })
 .slice(0, 10); // Keep only the top 10 users
 const name = `${interaction.guild.name}'s Leaderboard`;
 const leaderboardEntries = [];
 let rankNum = 1;

 // Build leaderboard entries
 for (const members of ususs) {
     const member = await client.users.fetch(members.User);
     const avatar = member.displayAvatarURL({ extension: "png", forceStatic: true });
     const username = member.tag;
     const displayName = member.displayName;
     const level = members.Level;
     const xp = members.XP;
     const rank = rankNum;

     leaderboardEntries.push({ avatar, username, displayName, level, xp, rank });
     rankNum++;
 }

 const totalMembers = interaction.guild.memberCount
  Font.loadDefault();
 const leaderboard = new LeaderboardBuilder()
 .setBackground("https://cdn.discordapp.com/attachments/1251654427107135621/1252258635929620520/Untitled26_20240617104837.png?ex=6671903c&is=66703ebc&hm=d394adb34545234a2ca70178775bde2ada76aa225a58bfa6ea2cc34dccb319ac&")
     .setHeader({
     title: name,
     image: interaction.guild.iconURL({ extension: "png", forceStatic: true }),
     subtitle: `${totalMembers} members`,
     })
     .setPlayers(leaderboardEntries)
     .setVariant("horizontal");
const leaderboardBuffer = await leaderboard.build({ format: "png" });

        const attachment = new AttachmentBuilder(leaderboardBuffer, { name: "leaderboard.png"});

        const lbembed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle('XP Leaderboard')
        .setImage("attachment://leaderboard.png")
        await interaction.reply({ embeds: [lbembed], files: [attachment] })
    }
}