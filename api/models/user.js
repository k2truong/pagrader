import mongoose from 'mongoose';
// import bcrypt from 'bcrypt-nodejs';

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
