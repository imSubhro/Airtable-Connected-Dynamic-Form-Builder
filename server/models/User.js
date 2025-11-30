const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  airtableUserId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  accessToken: {
    type: String, // Encrypted in real app, plain for now or use encryption helper
    required: true
  },
  refreshToken: {
    type: String
  },
  tokenExpiry: {
    type: Date
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
