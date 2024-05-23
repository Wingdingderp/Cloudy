const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  tickets: String,
  channelid: String,
  // Add more fields as needed
});

const User = mongoose.model('User', userSchema);

module.exports = User;