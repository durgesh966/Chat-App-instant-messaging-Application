const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  from: String,
  to: String,
  message: String
});

module.exports = mongoose.model('Chat', chatSchema);