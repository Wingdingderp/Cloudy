const { EmbedBuilder, Events, AuditLogEvent, codeBlock } = require('discord.js');
const Audit_Log = require("../../Schemas.js/auditlog");
const countingSchema = require('../../Schemas.js/countingSchema');
const Client = require("discord.js");
const log_actions = require("../../Schemas.js/logactions");
const token = require("../../../encrypt").token(5);
const perm = require("../../../functions").perm;

module.exports = async (client) => {
    // Message Delete
    client.on(Events.MessageDelete, async (message) => {
        perm(message);
        try {
            let messageSend = {
                embeds: [],
                components: [],
            }
            const data = await Audit_Log.findOne({ Guild: message.guild.id }).catch((err) => {
                return;
            });

            if (!data) return; 

            const logID = data.messageLog;   
            const auditChannel = client.channels.cache.get(logID);
            const countingData = await countingSchema.findOne({ Guild: message.guild.id });
            const countingChannel = client.channels.cache.get('1275225559273570354')
            const iscountingChannel = [`1275225559273570354`];
            const number = countingData.Count
            const nextNumber = number + 1
            const countingMsg = codeBlock(message.content)

            if (!auditChannel) {
                console.error("Audit channel not found.");
                return;
            }

            if (iscountingChannel.includes(`${message.channel.id}`)) {
                await countingChannel.send({ content: `⚠️ ${message.author} has deleted a message: ${countingMsg} The next number is **${nextNumber}**`})
                return;
            } 

            const auditEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTimestamp()
            .setThumbnail("https://maki.gg/emoji/wastebasket.png")
            .setFooter({ text: `Logging System` });

            message.embeds.forEach(embed => {
                messageSend.embeds.push(embed)
            });

            if (message.components && message.components.length > 0) {
                message.components.forEach(component => {

                    component.components.forEach(button => {
                        button.disabled = true;
                    });

                    messageSend.components.push(component)
                });
            }

            auditEmbed.addFields({name: "Message Content:", value: message.content || "No content.", inline: false});

            auditEmbed
            .setTitle("Message Deleted")
            .addFields({name: "Channel", value: `${message.channel}`, infline: false})
            .addFields({name: "Author:", value: `<@${message.author.id}>`, inline: false})
            .addFields({name: "Message ID", value: `${message.id}`, inline: true})

            if (message.mentions && message.mentions.members.size > 0) {
                const mentionList = message.mentions.members.map(member => `<@${member.id}>`).join(", ");
                auditEmbed.addFields({ name: "Mentions:", value: mentionList });
            }

            const messageHadAttachment = message.attachments.first()

            if (messageHadAttachment) {
                auditEmbed.setThumbnail(messageHadAttachment.proxyURL)
            }

            messageSend.embeds.push(auditEmbed)

            await auditChannel.send(messageSend);
        } catch (err) {
            console.error("Error in messageDelete event:", err);
        }
    });
};
