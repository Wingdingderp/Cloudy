const { Schema, model } = require('mongoose');

let AutoRole = new Schema({
    Guild: String,
    RoleID: String,
    RoleName: String
})

module.exports = model("AutoRole", AutoRole);
