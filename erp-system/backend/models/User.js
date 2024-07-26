const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  emailid: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'admin'], required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
