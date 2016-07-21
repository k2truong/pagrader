import mongoose from 'mongoose';
// import bcrypt from 'bcrypt-nodejs';

const repoSchema = new mongoose.Schema({
  username: String,
  description: String,
  language: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Repo', repoSchema);
