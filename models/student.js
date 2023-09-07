const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String, 
    email: String,
    age: Number,
  mentors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mentor',
    },
  ], // An array of references to mentors for this student
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;