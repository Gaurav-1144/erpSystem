const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  emailid: { type: String, required: true, unique: true },
  mobileno: { type: String, required: true },
  dob:{ type: String, required: true },
  photo:{ type: String, required: true },
  joiningdate:{ type: String, required: true },
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
