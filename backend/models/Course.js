const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    unique: true,
    required: true,
  },
  title: String,
  description: String,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending',
  },
  // Add these fields to specify target students
  branches: [
    {
      type: String,
      enum: ['CSE', 'EE', 'Civil'],
    },
  ],
  batches: [Number], // e.g., [2022, 2023]
  degrees: [
    {
      type: String,
      enum: ['BTECH', 'MTECH'],
    },
  ],
});

module.exports = mongoose.model('Course', courseSchema);