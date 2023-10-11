const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
  subject: { type: String, required: true },
  from: { type: String, required: true },
  // Add other relevant email properties
});

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
