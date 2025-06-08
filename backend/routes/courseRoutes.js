const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect, role } = require('../middleware/auth');
const User = require('../models/User');


// @route   POST /api/courses/
// @desc    Faculty creates a new course
// @access  Private (Faculty only)
router.post('/', protect, role(['faculty']), async (req, res) => {
  const {
    courseCode,
    title,
    description,
    branches,
    batches,
    degrees,
  } = req.body;

  try {
    // Validate required fields
    if (!courseCode || !title || !branches || !batches || !degrees) {
      return res.status(400).json({
        message:
          'Please provide courseCode, title, branches, batches, and degrees.',
      });
    }

    // Validate branches, batches, and degrees
    const validBranches = ['CSE', 'EE', 'Civil'];
    const validDegrees = ['BTECH', 'MTECH'];

    // Ensure branches are valid
    for (const branch of branches) {
      if (!validBranches.includes(branch)) {
        return res.status(400).json({ message: 'Invalid branch specified.' });
      }
    }

    // Ensure degrees are valid
    for (const degree of degrees) {
      if (!validDegrees.includes(degree)) {
        return res.status(400).json({ message: 'Invalid degree specified.' });
      }
    }

    // Check if course code already exists
    let course = await Course.findOne({ courseCode });
    if (course) {
      return res.status(400).json({ message: 'Course code already exists.' });
    }

    // Create new course
    course = new Course({
      courseCode,
      title,
      description,
      instructor: req.user.id,
      // Set target students
      branches,
      batches,
      degrees,
      status: 'approved', // Awaiting admin approval
    });

    // Save course to the database
    await course.save();

    res.status(201).json({
      message: 'Course created successfully. Awaiting admin approval.',
      course,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/courses/available
// @desc    Get available courses for the authenticated student
// @access  Private (Students only)
router.get('/available', protect, role(['student']), async (req, res) => {
  try {
    // Get the student's batch, branch, and degree
    const student = await User.findById(req.user.id);

    if (!student) {
      return res.status(400).json({ message: 'Student not found.' });
    }

    const { batch, branch, degree } = student;

    // Find courses that match the student's batch, branch, and degree
    const courses = await Course.find({
      status: 'approved',
      branches: branch,
      batches: batch,
      degrees: degree,
    }).populate(
      'instructor',
      'name email'
    );

    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET /api/courses/pending
// @desc    Get all pending courses for admin approval
// @access  Private (Admin only)

router.get('/pending', protect, role(['admin']), async (req, res) => {
  try {
    const pendingCourses = await Course.find({ status: 'pending' }).populate(
      'instructor',
      'name email'
    );

    res.json(pendingCourses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   PUT /api/courses/:id/approve
// @desc    Approve a course
// @access  Private (Admin only)

router.put('/:id/approve', protect, role(['admin']), async (req, res) => {
  try {
    const courseId = req.params.id;

    // Find the course by ID
    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Check if the course is already approved
    if (course.status === 'approved') {
      return res.status(400).json({ message: 'Course is already approved.' });
    }

    // Update the course status to 'approved'
    course.status = 'approved';
    await course.save();

    res.json({ message: 'Course approved successfully.', course });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET /api/courses/my-courses
// @desc    Get the faculty's floated courses
// @access  Private (Faculty only)
router.get('/my-courses', protect, role(['faculty']), async (req, res) => {
  try {
    // Find courses where the instructor field matches the authenticated user's ID
    const courses = await Course.find({ instructor: req.user.id });
    // Return the courses array
    res.json(courses);
  } catch (err) {
    console.error('Error fetching faculty courses:', err);
    res.status(500).send('Server Error');
  }
});



module.exports = router;

