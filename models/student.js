const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user_id: {
    type: String,
    unique: true
  },
  name: {
  	type: String
  },
  age: {
  	type: Number,
  },
  location: {
    type: String
  },
  department: {
  	type: String
  }
});

const student = mongoose.model('students', studentSchema);

module.exports = student;