const express = require('express');
const router = express.Router();
const user = require('../schemas/UserSchema');
const bcrypt = require('bcrypt');

// middleware function to check if user logged in or not
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    res.redirect('/game/play');
  } else {
    next();
  }
}

router.get('/login', isAuthenticated, (req, res) => {
  res.render('client/login', {
    title: 'Login',
    style: 'auth.css',
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// GET: Register route
router.get('/register', isAuthenticated, (req, res) => {
  res.render('client/register', {
    title: 'Register',
    style: 'auth.css',
  });
});

// Post method for login form
router.post('/login', async (req, res) => {
  var rollNumber = req.body.rollNumber;
  var password = req.body.password;

  try {
    const existingUser = await user.findOne({ rollNumber: rollNumber });
    if (existingUser) {
      const match = await bcrypt.compare(password, existingUser.password);
      if (match) {
        req.session.authenticated = true;
        req.session.user = {
          rollNumber: existingUser.rollNumber,
          username: existingUser.username,
        };
        req.session.cookie.expires = false;
        res.redirect('/game/play');
        return;
      }
    }
    
    res.render('client/login', {
      error: 'Invalid Roll Number or Password',
      title: 'Login',
      style: 'auth.css',
    });
  } catch (e) {
    console.log(e);
  }
});

// Post method for registration form
router.post('/register', async (req, res) => {
  var rollNumber = req.body.rollNumber;
  var password = req.body.password;
  var username = req.body.username;

  if (!rollNumber || !username || !password) {
    return res.render('client/register', {
      error: 'Enter all the required fields below',
      title: 'Register',
      style: 'auth.css',
    });
  }

  const existingRoll = await user.findOne({ rollNumber: rollNumber });
  if (existingRoll) {
    return res.render('client/register', {
      error: 'Roll Number already exists !!',
      title: 'Register',
      style: 'auth.css',
    });
  }
  
  const existingName = await user.findOne({ username: username });
  if (existingName) {
    return res.render('client/register', {
      error: 'This name is already taken',
      title: 'Register',
      style: 'auth.css',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  var newUser = new user({
    rollNumber: rollNumber,
    username: username,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    console.log('User registered successfully');

    req.session.authenticated = true;
    req.session.user = {
      rollNumber: rollNumber,
      username: username,
    };
    req.session.cookie.expires = false;

    res.redirect('/game/play');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
