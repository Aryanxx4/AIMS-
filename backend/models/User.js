const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ['admin', 'faculty', 'student'],
    required: true,
  },
  facultyAdvisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // Add these fields for students
  batch: Number,   // e.g., 2023
  branch: {
    type: String,
    enum: ['CSE', 'EE', 'Civil'],
  },
  degree: {
    type: String,
    enum: ['BTECH', 'MTECH'],
  },
  // Fields for OTP-based login, if still applicable
  otp: String,
  otpExpires: Date,
});

module.exports = mongoose.model('User', userSchema);