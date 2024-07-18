const { model, Schema } = require("mongoose");

let schema = new Schema({
    Guild: String,
    messageLog: String,
    channelLog: String,
    moderationLog: String, // Each Log Channel, add more if needed
    memberLog: String,
    roleLog: String,
    serverLog: String,
    inviteLog: String,
});

module.exports = model("audit_log", schema);