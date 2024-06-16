const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pat")
        .setDescription("pat another member")
        .addUserOption((option) => 
        option.setName("member")
        .setDescription("Who do you want to pat?")
        .setRequired(true)),
    async execute(interaction) {
        const patter = interaction.user.id;
        const patted = interaction.options.getUser('member').id;
        const invis_ping_prefix = "||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| _ _ _ _ _ _"
        const gif_list = [``];
        const rng = Math.floor(Math.random() * (gif_list.length));
        if (rng == (gif_list.length)) {rng = gif_list.length - 1};
        const embed = new EmbedBuilder().addFields({name: ` `, value: `**<@${patter}> gave <@${patted}> a pat!**`}).setColor("Blue").setImage(`${gif_list[rng]}`)
        console.log(embed)
        await interaction.reply({
            embeds: [embed],
            content:`Do **/pat** to pat someone! ${invis_ping_prefix}<@${patted}>`
        })
    }
}