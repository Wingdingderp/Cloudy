const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { EmbedBuilder, AttachmentBuilder, PermissionsBitField, Embed } = require(`discord.js`);
const levelSchema = require('../../Schemas.js/level');
const pagination = require('../../functions/pagination');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`xp-leaderboard`)
    .setDescription(`This gets a servers xp leaderboard`),
    async execute (interaction) {

        const { guild, client } = interaction;

        const embed1 = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark:  No one is on the leaderboard yet..`)
        
        let Data = await levelSchema.find({ Guild: guild.id})
            .sort({
                XP: -1,
                Level: -1
            })
            .limit(100)
        console.log(Data)

        var pageLength = 2;
        var embeds = [];
        var Dataset = [];

        for (let user of Data) {
            const embed = new EmbedBuilder().setTitle(`**${guild.name}'s XP Leaderboard:**`).setColor("Blue")
            if (Dataset.length < pageLength) {
                Dataset = Dataset.concat([user])
            } else if (Dataset.length === pageLength) {
                for (let counter = 0; counter < pageLength; ++counter) {
                    let { User, XP, Level } = Dataset[counter];
                    
                    const value = await client.users.fetch(User) || "Unknown Member"
                    const member = value.tag;
                    embed.addFields({name: `**${counter + 1}. ${member}**`, value: `Level: ${Level}\nXP: ${XP}`}).setColor("Blue");
                    if (counter === (pageLength - 1)) {
                        Dataset = [user];
                    };
                };
                embeds = embeds.concat([embed]);
            };
        };

        if (!Data) return await interaction.reply({ embeds: [embed1] });
        await pagination(interaction, embeds);
    }
}