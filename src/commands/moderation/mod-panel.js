const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("mod-panel")
    .setDescription("Moderate a user with this panel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => option
        .setName("target")
        .setDescription("the target of the actions")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("reason")
        .setDescription("the reason for your action")
        .setRequired(true)
    ),

    async execute (interaction, client) {
        const {guild, options} = interaction;
        const target = options.getMember("target");
        const reason = options.getString("reason") || "No Reason given";

        if (target === interaction.user) {
            return await interaction.reply({
                content: "You cant moderate yourself!",
                ephemeral: true
            })
        }

        //timeout row
        const tRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("1")
            .setLabel("TO 5 Minutes")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("2")
            .setLabel("TO 10 Minutes")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("3")
            .setLabel("TO 1 Hour")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("4")
            .setLabel("TO 1 Day")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("5")
            .setLabel("TO 1 Week")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
        )

        //mod row
        const Row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("ban")
            .setLabel("Ban")
            .setEmoji("🔨")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("kick")
            .setLabel("Kick")
            .setEmoji("🔨")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("untimeout")
            .setEmoji("✅")
            .setLabel("Untimeout")
            .setStyle(ButtonStyle.Success),
        )

        const embed = new EmbedBuilder()
        .setTitle("Moderation Panel")
        .setDescription(`This is the panel to moderate <@${target.id}>!`)
        .addFields(
            {name: "Name:", value: `${target.username}`, inline: true},
            {name: "User ID:", value: `${target.id}`, inline: true},
            {name: "User:", value: `<@${target.id}>`, inline: true},
            {name: "Avatar URL:", value: `[Avatar](${await target.displayAvatarURL()})`, inline: true},
            {name: "Reason:", value: `${reason}`, inline: false}
        )
        .setThumbnail(await target.displayAvatarURL())
        .setTimestamp()

        const msg = await interaction.reply({
            embeds: [embed],
            components: [Row, tRow]
        });

        const collector = msg.createMessageComponentCollector();

        const embed2 = new EmbedBuilder()
        .setTimestamp()
        .setFooter({ text: `Moderator: ${interaction.user.username}`})

        collector.on('collect', async i => {
            if (i.customId === "ban") {
                if (!i.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                    return await i.reply({
                        content: "You cant **BAN** Members!",
                        ephemeral: true
                    })
                }

                await interaction.guild.members.ban(target, {reason});

                embed2.setTitle("Ban").setDescription(`You have been banned in ${i.guild.name}! || **Reason:** ${reason}`)

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });;

                await i.reply({ content: `<@${target.id}> has been banned!`, ephemeral: true});
            }

            if (i.customId === "untimeout") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true})

                await target.timeout(null);

                embed2.setTitle("Untimeout").setDescription(`You have been untimeouted in ${i.guild.name}! || **Reason:** ${reason}`);

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });;

                await i.reply({ content: `<@${target.id}> has been untimeouted!`, ephemeral: true});
            }

            if (i.customId === "kick") {
                if (!i.member.permissions.has(PermissionFlagsBits.KickMembers)) return await i.reply({ content: "You dont have the permission to **KICK** Members!", ephemeral: true});

                await interaction.guild.members.ban(target, {reason});

                embed2.setTitle("Kick").setDescription(`You have been kicked in ${i.guild.name}! || **Reason:** ${reason}`)

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> has been kicked!`, ephemeral: true});
            }

            if (i.customId === "1") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(300000, reason).catch(err => {
                    return i.reply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed2.setTitle("Timeout").setDescription(`You have been timeouted for **5 Minutes** || **Reason:** ${reason}`);

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> has been timeouted for **5 Minutes**`, ephemeral: true});
            }

            if (i.customId === "2") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(600000, reason).catch(err => {
                    return i.reply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed2.setTitle("Timeout").setDescription(`You have been timeouted for **10 Minutes** || **Reason:** ${reason}`);

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> has been timeouted for **10 Minutes**`, ephemeral: true});
            }

            if (i.customId === "3") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(3600000, reason).catch(err => {
                    return i.reply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed2.setTitle("Timeout").setDescription(`You have been timeouted for *1 Hour** || **Reason:** ${reason}`);

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> has been timeouted for **1 Hour**`, ephemeral: true});
            }

            if (i.customId === "4") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(86400000, reason).catch(err => {
                    return i.reply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed2.setTitle("Timeout").setDescription(`You have been timeouted for **1 Day** || **Reason:** ${reason}`);

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> has been timeouted for **1 Day**`, ephemeral: true});
            }

            if (i.customId === "5") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(604800000, reason).catch(err => {
                    return i.reply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed2.setTitle("Timeout").setDescription(`You have been timeouted for **1 Week** || **Reason:** ${reason}`);

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> has been timeouted for **1 Week**`, ephemeral: true});
            }

            
        })
    }
}