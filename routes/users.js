const express = require('express');
const router = express.Router();
const supabase = require('../database/supabase');
const bcrypt = require('bcrypt');

// middleware function to check if user logged in or not
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    res.redirect('/game/play');
  } else {
    next();
  }
}

router.get('/login', (req, res) => {
  if (req.session) req.session.destroy();
  res.clearCookie('connect.sid');
  res.render('client/login', {
    title: 'Login',
    style: 'auth.css',
  });
});

router.get('/logout', (req, res) => {
  if (req.session) req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
});

// GET: Register route
router.get('/register', (req, res) => {
  if (req.session) req.session.destroy();
  res.clearCookie('connect.sid');
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
    const { data: existingUser, error } = await supabase
      .from('users')
      .select('*')
      .eq('rollNumber', rollNumber)
      .maybeSingle();

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
    res.status(500).send('Server Error');
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

  try {
    const { data: existingRoll } = await supabase
      .from('users')
      .select('rollNumber')
      .eq('rollNumber', rollNumber)
      .maybeSingle();

    if (existingRoll) {
      return res.render('client/register', {
        error: 'Roll Number already exists !!',
        title: 'Register',
        style: 'auth.css',
      });
    }
    
    const { data: existingName } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (existingName) {
      return res.render('client/register', {
        error: 'This name is already taken',
        title: 'Register',
        style: 'auth.css',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error: insertError } = await supabase
      .from('users')
      .insert([
        {
          rollNumber: rollNumber,
          username: username,
          password: hashedPassword,
        },
      ]);

    if (insertError) {
      console.log('Error inserting user:', insertError);
      throw insertError;
    }

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
    res.status(500).send('Server Error');
  }
});

module.exports = router;
