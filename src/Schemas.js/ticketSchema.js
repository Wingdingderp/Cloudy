const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  id: Number,
  Guild: String,
});

const tickets = mongoose.model('tickets', ticketSchema);

module.exports = tickets;