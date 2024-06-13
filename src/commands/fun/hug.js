const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("hug")
        .setDescription("hug another member")
        .addUserOption((option) => 
        option.setName("member")
        .setDescription("Who do you want to hug?")
        .setRequired(true)),
    async execute(interaction) {
        const hugger = interaction.user.id;
        const hugged = interaction.options.getUser('member').id;
        const invis_ping_prefix = "||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| _ _ _ _ _ _"
        const gif_list = [`https://images-ext-1.discordapp.net/external/os4yJKggfiHOEv5EqamxHsT63kKjmS0LBgb2lFrpAJU/https/maki.gg/emote/hug/5.gif?width=899&height=475`, `https://images-ext-1.discordapp.net/external/5METGXObZXiUgKR7HLE1WY2_jZDcymszCcX_P7hW-IA/https/maki.gg/emote/hug/29.gif?width=896&height=500`, `https://images-ext-1.discordapp.net/external/Ad8HZOR1LP7bo75gFhQv7eMLrL10zdbMzgPkhbGoBqM/https/maki.gg/emote/hug/52.gif?width=971&height=984`, `https://images-ext-1.discordapp.net/external/8R5dx5nlFzbmNYsZLeBluE01SbKONcHxJhcMDglyKPE/https/maki.gg/emote/hug/50.gif?width=899&height=505`, `https://images-ext-1.discordapp.net/external/0An2cI_BLP0CCkbi8z-RpFPqHsNufvM46EOB7nVjLZo/https/maki.gg/emote/hug/18.gif?width=899&height=455`, `https://images-ext-1.discordapp.net/external/-pQKPeF3RUvTWinirTpi6Nt3faIkXVQKGQ9AI9vR0-Y/https/maki.gg/emote/hug/36.gif?width=899&height=467`, `https://images-ext-1.discordapp.net/external/XOvV_AyvEVgWvIcrt8bOjLHO8TWHXHv34LYdW28B0xk/https/maki.gg/emote/hug/35.gif?width=863&height=485`, `https://images-ext-1.discordapp.net/external/UyPHF7qkEd_VbAIIAUxcvQ2d4zST9lIWGjrVXTQuFGY/https/maki.gg/emote/hug/34.gif?width=896&height=500`, `https://images-ext-1.discordapp.net/external/KDhCsgnxs9cQDpGKxhrkmHr0Lq17DTG5XxdljIKV-t0/https/maki.gg/emote/hug/4.gif?width=896&height=500`, `https://images-ext-1.discordapp.net/external/a0xlS7Tq66-ELdZk7pAsjJWnZ2u6F4CX9QG8xnaQnWE/https/maki.gg/emote/hug/47.gif?width=863&height=485`, `https://images-ext-1.discordapp.net/external/BkGqj3u97oZH4np2FYJLV2R0zn5KqiFPNo3IntUpSdE/https/maki.gg/emote/hug/23.gif?width=899&height=471`, `https://images-ext-1.discordapp.net/external/N6JBXBkgN6nE3du_Om8aTiXHTms9J8-JuyNHWULcmVI/https/maki.gg/emote/hug/27.gif?width=1259&height=709`, `https://images-ext-1.discordapp.net/external/7AfLlkixPocGnfnNOc7OOm0-Iqlj4OABQw5AWDDUleY/https/maki.gg/emote/hug/32.gif?width=863&height=485`, `https://images-ext-1.discordapp.net/external/82oc9Y95A-adqhEeDCRIWDg5hMXBS21dOjIuQ4tJXIc/https/maki.gg/emote/hug/15.gif?width=899&height=467`, `https://images-ext-1.discordapp.net/external/5APCMDTVQunouIAnywMM7-xurhye1-7N52EzN0QNNGo/https/maki.gg/emote/hug/49.gif?width=899&height=503`];
        const rng = Math.floor(Math.random() * (gif_list.length));
        if (rng == (gif_list.length)) {rng = gif_list.length - 1};
        const embed = new EmbedBuilder().addFields({name: ` `, value: `**<@${hugger}> gave <@${hugged}> a hug!**`}).setColor("Blue").setImage(`${gif_list[rng]}`)
        console.log(embed)
        await interaction.reply({
            embeds: [embed],
            content:`Do **/hug** to hug someone! ${invis_ping_prefix}<@${hugged}>`
        })
    }
}