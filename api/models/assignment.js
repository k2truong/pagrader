import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  input: String,
  name: String,
  path: String,
  bonusDate: String,
  repo: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Assignment', assignmentSchema);
