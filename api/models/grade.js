import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  assignment: mongoose.Schema.Types.ObjectId,
  studentId: String,
  grade: String,
  comment: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Grade', gradeSchema);
