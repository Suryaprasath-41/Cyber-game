const express = require('express');
const router = express.Router();
const supabase = require('../database/supabase');
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

  // Ensure required admins exist
  const adminUsers = ['CSBS', 'Samyukth'];
  for (const user of adminUsers) {
    const { data: existingAdmin } = await supabase.from('admins').select('*').eq('username', user).maybeSingle();
    if (!existingAdmin) {
      const defaultPassword = await bcrypt.hash('smart', 10);
      await supabase.from('admins').insert([{ username: user, password: defaultPassword }]);
    }
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
    const { data: adminUser } = await supabase.from('admins').select('*').eq('username', username).maybeSingle();
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
  let { data: settings } = await supabase.from('settings').select('*').limit(1).maybeSingle();
  if (!settings) {
    const { data: newSettings } = await supabase.from('settings').insert([{ competitionOn: true }]).select().single();
    settings = newSettings || { competitionOn: true };
  }
  
  const search = req.query.search || '';
  let query = supabase.from('scores').select('*').order('weightedScore', { ascending: false });
  
  if (search) {
    query = query.or(`rollNumber.ilike.%${search}%,username.ilike.%${search}%`);
  }

  const { data: scores } = await query;

  res.render('admin/dashboard', {
    layout: 'main',
    title: 'Admin Dashboard',
    style: 'leaderboard.css',
    scores: scores || [],
    search: search,
    competitionOn: settings.competitionOn
  });
});

// POST: Toggle Competition
router.post('/toggle-competition', isAdmin, async (req, res) => {
  let { data: settings } = await supabase.from('settings').select('*').limit(1).maybeSingle();
  if (!settings) {
    const { data: newSettings } = await supabase.from('settings').insert([{ competitionOn: false }]).select().single();
    settings = newSettings;
  } else {
    await supabase.from('settings').update({ competitionOn: !settings.competitionOn }).eq('id', settings.id);
  }
  
  res.redirect('/admin/dashboard');
});

// GET: Export CSV
router.get('/export', isAdmin, async (req, res) => {
  const { data: scores } = await supabase.from('scores').select('*').order('weightedScore', { ascending: false });
  
  let csv = 'Roll Number,Name,Score,Accuracy (%),Time (s),Weighted Score,Current Section,Status\n';
  
  (scores || []).forEach(s => {
    csv += `"${s.rollNumber}","${s.username}",${s.score},${s.accuracy},${s.time},${s.weightedScore},${s.currentSection},"${s.completionStatus}"\n`;
  });
  
  res.header('Content-Type', 'text/csv');
  res.attachment('competition_results.csv');
  return res.send(csv);
});

module.exports = router;
