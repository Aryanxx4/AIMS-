const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateOtp = require('../utils/generateOtp');
const transporter = require('../config/nodemailer');
const { protect, role } = require('../middleware/auth'); // We might need to adjust this


// @route   POST /api/users/login
// @desc    Initiate login by generating and sending OTP
router.post('/login', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Generate OTP
    const otp = generateOtp(6);
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // Update user with OTP and expiration
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    console.log(process.env.EMAIL_USER)

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to send OTP email.' });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ message: 'OTP sent to your email.' });
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/users/verify-otp
// @desc    Verify OTP and authenticate user
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: 'OTP is invalid or has expired.' });
    }

    // OTP is valid - authenticate user
    // Clear OTP and expiration
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT with user role
    const payload = {
        id: user.id,
        role: user.role, // Include the user's role
      };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
        token,
        user: {
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
        },
      });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/users/register
// @desc    Admin creates a new user (student or faculty)
// @access  Private (Admin only)
router.post('/register', protect, role(['admin']), async (req, res) => {
  const {
    name,
    email,
    role: userRole,
    facultyAdvisor,
    batch,
    branch,
    degree,
  } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !userRole) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Check if the role is valid
    if (!['student', 'faculty'].includes(userRole)) {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // If role is 'student', validate batch, branch, and degree
    if (userRole === 'student') {
      if (!batch || !branch || !degree || !facultyAdvisor) {
        return res.status(400).json({
          message: 'Please provide batch, branch, degree and faculty Advisor for students.',
        });
      }

      // Validate branch and degree values
      const validBranches = ['CSE', 'EE', 'Civil'];
      const validDegrees = ['BTECH', 'MTECH'];

      if (!validBranches.includes(branch)) {
        return res.status(400).json({ message: 'Invalid branch specified.' });
      }

      if (!validDegrees.includes(degree)) {
        return res.status(400).json({ message: 'Invalid degree specified.' });
      }

       // Validate faculty advisor if provided
      if (facultyAdvisor) {
        const advisor = await User.findOne({ _id: facultyAdvisor, role: 'faculty' });
        if (!advisor) {
          return res.status(400).json({ message: 'Invalid faculty advisor ID.' });
        }
      }
    }

    // Create new user
    user = new User({
      name,
      email,
      role: userRole,
      facultyAdvisor: facultyAdvisor || null,
      batch: userRole === 'student' ? batch : null,
      branch: userRole === 'student' ? branch : null,
      degree: userRole === 'student' ? degree : null,
    });

    // Save user to the database
    await user.save();

    res.status(201).json({ message: 'User registered successfully.', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET /api/users/profile
// @desc    Get the authenticated student's profile
// @access  Private (Students only)
router.get('/profile', protect, role(['student', 'faculty']), async (req, res) => {
  try {
    // Retrieve the user ID from the authenticated user
    const userId = req.user.id;

    // Fetch the user data from the database
    let user = await User.findById(userId)
      .select('-otp -otpExpires'); // Exclude sensitive fields

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Populate fields based on user role
    if (user.role === 'student') {
      // For students, populate 'facultyAdvisor'
      user = await user.populate('facultyAdvisor', 'name email');
    } else if (user.role === 'faculty') {
      // For faculty, populate additional fields if necessary
      // Example: user = await user.populate('department', 'name');
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).send('Server Error');
  }
});


// @route   GET /api/users/faculty-advisors
// @desc    Get a list of faculty advisors
// @access  Private - admin only
router.get('/faculty-advisors', protect, role(['admin']) ,async (req, res) => {
  try {
    // Fetch users with the role 'faculty'
    const facultyAdvisors = await User.find({ role: 'faculty' }).select('id name email');

    res.json(facultyAdvisors);
  } catch (err) {
    console.error("Error fetching faculty advisors:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});


/**
 * @route   GET /api/users/students
 * @desc    Get a list of all students
 * @access  Private (Admin only)
 */
router.get('/students', protect, role(['admin']), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select(
      'name email branch degree batch'
    );
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});






// Adjust existing routes as necessary

module.exports = router;