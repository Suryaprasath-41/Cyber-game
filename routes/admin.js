const express = require('express');
const router = express.Router();
const Admin = require('../schemas/AdminSchema');
const Score = require('../schemas/ScoreSchema');
const Settings = require('../schemas/SettingsSchema');
const bcrypt = require('bcrypt');

// Admin Auth Middleware
function isAdmin(req, res, next) {
  if (req.session.admin) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

// GET: Admin Login
router.get('/login', async (req, res) => {
  if (req.session.admin) return res.redirect('/admin/dashboard');

  // Ensure default admin exists
  const existingAdmin = await Admin.findOne({ username: 'admin' });
  if (!existingAdmin) {
    const defaultPassword = await bcrypt.hash('admin123', 10);
    const newAdmin = new Admin({ username: 'admin', password: defaultPassword });
    await newAdmin.save();
  }

  res.render('client/login', {
    title: 'Admin Login',
    style: 'auth.css',
    action: '/admin/login',
    isAdminLogin: true // We can use this to tweak the form if we want, or just reuse it
  });
});

// POST: Admin Login
router.post('/login', async (req, res) => {
  // Using rollNumber field name because we reused the login form, but for admin it's username
  var username = req.body.rollNumber; 
  var password = req.body.password;

  try {
    const adminUser = await Admin.findOne({ username: username });
    if (adminUser) {
      const match = await bcrypt.compare(password, adminUser.password);
      if (match) {
        req.session.admin = true;
        return res.redirect('/admin/dashboard');
      }
    }
    res.render('client/login', {
      error: 'Invalid Admin Credentials',
      title: 'Admin Login',
      style: 'auth.css',
      action: '/admin/login'
    });
  } catch (e) {
    console.log(e);
  }
});

// GET: Admin Logout
router.get('/logout', (req, res) => {
  req.session.admin = false;
  res.redirect('/admin/login');
});

// GET: Admin Dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
  const settings = await Settings.findOne({}) || await (new Settings()).save();
  
  const search = req.query.search || '';
  let query = {};
  if (search) {
    query = {
      $or: [
        { rollNumber: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ]
    };
  }

  const scores = await Score.find(query).sort({ weightedScore: -1 }).lean();

  res.render('admin/dashboard', {
    layout: 'main',
    title: 'Admin Dashboard',
    style: 'leaderboard.css',
    scores: scores,
    search: search,
    competitionOn: settings.competitionOn
  });
});

// POST: Toggle Competition
router.post('/toggle-competition', isAdmin, async (req, res) => {
  let settings = await Settings.findOne({});
  if (!settings) settings = new Settings();
  
  settings.competitionOn = !settings.competitionOn;
  await settings.save();
  
  res.redirect('/admin/dashboard');
});

// GET: Export CSV
router.get('/export', isAdmin, async (req, res) => {
  const scores = await Score.find({}).sort({ weightedScore: -1 }).lean();
  let csv = 'Roll Number,Name,Score,Accuracy (%),Time (s),Weighted Score,Current Section,Status\n';
  
  scores.forEach(s => {
    csv += `"${s.rollNumber}","${s.username}",${s.score},${s.accuracy},${s.time},${s.weightedScore},${s.currentSection},"${s.completionStatus}"\n`;
  });
  
  res.header('Content-Type', 'text/csv');
  res.attachment('competition_results.csv');
  return res.send(csv);
});

module.exports = router;
