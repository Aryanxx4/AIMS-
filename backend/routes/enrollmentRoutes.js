const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const { protect, role } = require('../middleware/auth');


// @route   POST /api/enrollments/
// @desc    Student registers for a course
// @access  Private (Students only)
router.post('/', protect, role(['student']), async (req, res) => {
  const { courseId } = req.body;

  try {
    // Check if course exists and is approved
    const course = await Course.findById(courseId);

    if (!course || course.status !== 'approved') {
      return res.status(400).json({ message: 'Invalid course.' });
    }

    // Get the student's batch, branch, and degree
    const student = await User.findById(req.user.id);

    if (!student) {
      return res.status(400).json({ message: 'Student not found.' });
    }

    const { batch, branch, degree } = student;

    // Check if the course is offered to the student's batch, branch, and degree
    if (
      !course.branches.includes(branch) ||
      !course.batches.includes(batch) ||
      !course.degrees.includes(degree)
    ) {
      return res.status(400).json({ message: 'Course not offered to you.' });
    }

    // Check if already enrolled or enrollment pending
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (existingEnrollment) {
      if(existingEnrollment.status !== 'pending'){
        return res.status(400).json({ message: 'Already enrolled or enrollment pending.' });
      }
      else{
        existingEnrollment.status = 'instructor_approval_pending';
        await existingEnrollment.save();
      }
    }

    // Create a new enrollment with status 'pending'
    const enrollment = new Enrollment({
      student: req.user.id,
      course: courseId,
      status: 'instructor_approval_pending',
    });

    await enrollment.save();

    res.status(201).json({ message: 'Enrollment request sent.', enrollment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET /api/enrollments/my-courses
// @desc    Get the student's enrolled and completed courses
// @access  Private (Students only)
router.get('/my-courses', protect, role(['student']), async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('course','-status')
      .populate('student', 'name email');

    console.log(enrollments);
    // Separate courses into 'ongoing' and 'completed'
    const ongoingCourses = enrollments
    .filter((enrollment) => !enrollment.isCompleted)
    .map((enrollment) => {
      enrollment.course.status = enrollment.status; // Add status directly to the course object
      return enrollment.course;
    });

    const completedCourses = enrollments
    .filter((enrollment) => enrollment.isCompleted)
    .map((enrollment) => {
      enrollment.course.status = enrollment.status; // Add status directly to the course object
      return enrollment.course;
    });

    res.json({ ongoingCourses, completedCourses });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   PUT /api/enrollments/:id/complete
// @desc    Mark a student's enrollment as completed
// @access  Private (Faculty or Admin)
router.put('/:id/complete', protect, role(['faculty']), async (req, res) => {
  try {
    const enrollmentId = req.params.id;

    // Find the enrollment
    let enrollment = await Enrollment.findById(enrollmentId).populate('course');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found.' });
    }

    const courseInstructor = enrollment.course.instructor.toString();
    if (courseInstructor !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    
    // Mark the enrollment as completed
    enrollment.isCompleted = true;
    await enrollment.save();

    res.json({ message: 'Enrollment marked as completed.', enrollment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET /api/enrollments/instructor/pending
// @desc    Get all pending enrollment requests for instructor's courses
// @access  Private (Faculty only)
router.get('/instructor/pending', protect, role(['faculty']), async (req, res) => {
  try {
    // Find courses taught by the current faculty member
    const courses = await Course.find({ instructor: req.user.id });

    // Extract course IDs
    const courseIds = courses.map((course) => course._id);

    // Find enrollments with status 'pending' for these courses
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
      status: 'instructor_approval_pending',
    })
      .populate('student', 'name email')
      .populate('course', 'courseCode title');

    res.json(enrollments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   PUT /api/enrollments/instructor/approve/:enrollmentId
// @desc    Instructor approves an enrollment request
// @access  Private (Faculty only)
router.put('/instructor/approve/:enrollmentId', protect, role(['faculty']), async (req, res) => {
  try {
    const enrollmentId = req.params.enrollmentId;

    // Find the enrollment
    const enrollment = await Enrollment.findById(enrollmentId).populate('course');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment request not found.' });
    }

    // Ensure that the course is taught by the current instructor
    if (enrollment.course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Check current status
    if (enrollment.status !== 'instructor_approval_pending') {
      return res.status(400).json({ message: 'Enrollment request is not pending instructor approval.' });
    }

    // Update the enrollment status to 'advisor_approval_pending'
    enrollment.status = 'advisor_approval_pending';
    await enrollment.save();

    res.json({ message: 'Enrollment request approved by instructor.', enrollment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// @route   GET /api/enrollments/advisor/pending
// @desc    Get all enrollment requests needing advisor's approval
// @access  Private (Faculty only)
router.get('/advisor/pending', protect, role(['faculty']), async (req, res) => {
  try {
    // Find students who have the current faculty member as their advisor
    const advisees = await User.find({ facultyAdvisor: req.user.id, role: 'student' });

    // Extract advisee IDs
    const adviseeIds = advisees.map((student) => student._id);

    // Find enrollments with status 'instructor_approved' for these students
    const enrollments = await Enrollment.find({
      student: { $in: adviseeIds },
      status: 'advisor_approval_pending',
    })
      .populate('student', 'name email')
      .populate('course', 'courseCode title');

    res.json(enrollments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// @route   PUT /api/enrollments/advisor/approve/:enrollmentId
// @desc    Faculty advisor approves an enrollment request
// @access  Private (Faculty only)
router.put('/advisor/approve/:enrollmentId', protect, role(['faculty']), async (req, res) => {
  try {
    const enrollmentId = req.params.enrollmentId;

    // Find the enrollment
    const enrollment = await Enrollment.findById(enrollmentId).populate('student');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment request not found.' });
    }

    // Ensure that the student is an advisee of the current faculty member
    if (enrollment.student.facultyAdvisor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Check current status
    if (enrollment.status !== 'advisor_approval_pending') {
      return res.status(400).json({ message: 'Enrollment request is not pending advisor approval.' });
    }

    // Update the enrollment status to 'enrolled'
    enrollment.status = 'enrolled';
    await enrollment.save();

    res.json({ message: 'Enrollment request approved by faculty advisor.', enrollment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   PUT /api/enrollments/drop
// @desc    Student drops a course
// @access  Private (Students only)
router.put('/drop', protect, role(['student']), async (req, res) => {

  const { courseId } = req.body;
  try {
    const studentId = req.user.id;

    // Find the enrollment
    const enrollment = await await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found.' });
    }

    // Check if the enrollment belongs to the authenticated student
    if (enrollment.student.toString() !== studentId) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Check if the course is already completed
    if (enrollment.isCompleted) {
      return res.status(400).json({ message: 'Cannot drop a completed course.' });
    }

    // Optionally, enforce a drop deadline
    // Assuming the Course model has a 'dropDeadline' field
    // const currentDate = new Date();
    // if (currentDate > enrollment.course.dropDeadline) {
    //   return res.status(400).json({ message: 'Cannot drop course after the deadline.' });
    // }

    // Update the enrollment status to 'dropped'
    enrollment.status = 'dropped';
    await enrollment.save();

    res.json({ message: 'Course dropped successfully.', enrollment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
