const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  username: { type: String,},
  fullname: { type: String },
  email: { type: String, unique: true },
  apikeys:{ type: String,},
  apisecret:{ type: String,},
  requestToken: { type: String, },
  password: { type: String  },
  isAccountConnected: { type: Boolean, default: false,  },
  Admin: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});



module.exports = mongoose.model('User', userSchema);
