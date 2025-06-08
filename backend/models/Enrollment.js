const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  status: {
    type: String,
    enum: ['instructor_approval_pending', 'advisor_approval_pending', 'enrolled', 'dropped'],
    default: 'instructor_approval_pending',
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  grade: String, // or Number, if you track grades
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);