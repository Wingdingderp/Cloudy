const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kiss")
        .setDescription("kiss another member")
        .addUserOption((option) => 
        option.setName("member")
        .setDescription("Who do you want to kiss?")
        .setRequired(true)),
    async execute(interaction) {
        const kisser = interaction.user.id;
        const kissed = interaction.options.getUser('member').id;
        const invis_ping_prefix = "||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| _ _ _ _ _ _"
        const gif_list = [`https://images-ext-1.discordapp.net/external/6NCMvjfecIx60AeoCq58cHwZOSXIEZxmGNhipOs45ME/https/maki.gg/emote/kiss/25.gif?width=896&height=500`, `https://images-ext-1.discordapp.net/external/ZpqnMpithL3sMX3mPdmouifWCBwxn0uhLgNavrdH4eY/https/maki.gg/emote/kiss/36.gif?width=971&height=547`, `https://tenor.com/view/frieren-sousou-no-frieren-frieren-beyond-journeys-end-anime-kiss-anime-elf-gif-1944987768966892138`, `https://media.tenor.com/ye6xtORyw_8AAAAM/2.gif`, `https://media.tenor.com/2ufYUI2sVFoAAAAM/kiss.gif`, `https://media1.tenor.com/m/Wgk_0iJebWUAAAAC/anime-girl-kiss-akademi-online.gif`, `https://media1.tenor.com/m/vhuon7swiOYAAAAC/rakudai-kishi-kiss.gif`];
        const rng = Math.floor(Math.random() * (gif_list.length));
        if (rng == (gif_list.length)) {rng = gif_list.length - 1};
        const embed = new EmbedBuilder().addFields({name: ` `, value: `**<@${kisser}> gave <@${kissed}> a kiss!**`}).setColor("Blue").setImage(`${gif_list[rng]}`)
        console.log(embed)
        await interaction.reply({
            embeds: [embed],
            content:`Do **/kiss** to kiss someone! ${invis_ping_prefix}<@${kissed}>`
        })
    }
}