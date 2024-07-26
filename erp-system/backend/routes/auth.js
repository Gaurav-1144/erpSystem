const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { emailid, password, role } = req.body;

  if (!emailid || !password || !role) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  const existingUser = await User.findOne({ emailid });
  if (existingUser) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const newUser = new User({ emailid, password: hash, role });
  await newUser.save();

  res.json(newUser);
});

// Login
router.post('/login', async (req, res) => {
  const { emailid, password } = req.body;

  if (!emailid || !password ) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  const user = await User.findOne({emailid});
  if (!user) {
    return res.status(400).json({ msg: 'User does not exist' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id}, 'jwtSecret', {
    expiresIn: 3600,
  });

  res.json({ token, user });
});


// Get employee details (employees can get their own details; admins can get all employees)
router.get('/userdetails', async (req, res) => {
  const { emailid} = req.query;

  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'jwtSecret');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.role === 'admin') {
      // Admins can see all employees
      if (emailid == user.emailid) {
        const employees = await User.find({ role: 'employee' });
        return res.json(employees);
      } else {
        return res.status(403).json({ msg: 'Access denied' });
      }  
    } else if (user.role === 'employee') {
 
      // Employees can see their own details
      if ( emailid !== user.emailid) {
        return res.status(403).json({ msg: 'Access denied' });
      }
      const employee = await User.findOne({ role: 'employee', emailid: emailid });
      return res.json(employee);
    } else {
      return res.status(403).json({ msg: 'Access denied1' });
    }
  } catch (e) {
    return res.status(400).json({ msg: 'Token is not valid' });
  }
});


// Insert or update employee details
router.put('/profile', async (req, res) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'jwtSecret');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const { emailid, mobileno, dob, photo, joiningdate } = req.body;
    console.log(emailid === user.emailid);
    console.log(user.role);
    if(emailid == user.emailid) {
      if (user.role === 'admin' || user.role === 'employee' && emailid == user.emailid) {
        const updatedUser = await Profile.findOneAndUpdate(
          { emailid },
          { emailid, mobileno, dob, photo, joiningdate },
          { new: true, upsert: true, runValidators: true }
        );
  
        return res.json(updatedUser);
      } else {
        return res.status(403).json({ msg: 'Access denied' });
      }
    } else {
      return res.status(403).json({ msg: 'Access denied' });
    }
   
  } catch (e) {
    return res.status(400).json({ msg: 'Token is not valid' });
  }
});



module.exports = router;