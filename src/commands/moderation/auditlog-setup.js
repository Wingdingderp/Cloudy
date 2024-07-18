const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Embed } = require("discord.js");
const Schema = require("../../Schemas.js/auditlog");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("auditlog-setup")
    .setDescription("Setup the audit log system in your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => option.setName("message-log").setDescription("The channel for the Message Log").setRequired(true))
    .addChannelOption(option => option.setName("channel-log").setDescription("The channel for the Channel Log").setRequired(true))
    .addChannelOption(option => option.setName("moderation-log").setDescription("The channel for the Moderation Log").setRequired(true))
    .addChannelOption(option => option.setName("member-log").setDescription("The channel for the Member Log").setRequired(true))
    .addChannelOption(option => option.setName("role-log").setDescription("The channel for the Role Log").setRequired(true))
    .addChannelOption(option => option.setName("server-log").setDescription("The channel for the Server Log").setRequired(true))
    .addChannelOption(option => option.setName("invite-log").setDescription("The channel for the Invite Log").setRequired(true)),

    async execute (interaction) {
        const {options, guild} = interaction;
        const msgLog = options.getChannel("message-log");
        const chLog = options.getChannel("channel-log");
        const modLog = options.getChannel("moderation-log");
        const mbrLog = options.getChannel("member-log");
        const roleLog = options.getChannel("role-log");
        const serverLog = options.getChannel("server-log");
        const invLog = options.getChannel("invite-log");

        const data = await Schema.findOne({
            Guild: guild.id,
        });
        if (data) {
            return await interaction.reply("You have already a audit log system here!")
        }
        const embed = new EmbedBuilder()
        .setTitle("Audit Log Setup")
        .setDescription(`Your Audit Log has been Setup!`)
        .setFooter({ text: "Nexus Utils Audit Log System" })
        .setColor('Blue')

        await Schema.create({
            Guild: guild.id,
            messageLog: msgLog.id,
            channelLog: chLog.id,
            moderationLog: modLog.id,
            memberLog: mbrLog.id,
            roleLog: roleLog.id,
            serverLog: serverLog.id,
            inviteLog: invLog.id
        });

        return await interaction.reply({
            embeds: [embed],
        })
    }
}