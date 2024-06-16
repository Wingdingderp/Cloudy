const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("slap")
        .setDescription("slap another member")
        .addUserOption((option) => 
        option.setName("member")
        .setDescription("Who do you want to slap?")
        .setRequired(true)),
    async execute(interaction) {
        const slapper = interaction.user.id;
        const slapped = interaction.options.getUser('member').id;
        const invis_ping_prefix = "||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| _ _ _ _ _ _"
        const gif_list = [``];
        const rng = Math.floor(Math.random() * (gif_list.length));
        if (rng == (gif_list.length)) {rng = gif_list.length - 1};
        const embed = new EmbedBuilder().addFields({name: ` `, value: `**<@${slapper}> gave <@${slapped}> a slap!**`}).setColor("Blue").setImage(`${gif_list[rng]}`)
        console.log(embed)
        await interaction.reply({
            embeds: [embed],
            content:`Do **/slap** to slap someone! ${invis_ping_prefix}<@${slapped}>`
        })
    }
}