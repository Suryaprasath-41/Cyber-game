const express = require('express');
const router = express.Router();
const supabase = require('../database/supabase');

//home
router.get('/', async (req, res) => {
  let userScore = null;
  let competitionOn = true;
  
  const { data: settings } = await supabase.from('settings').select('*').limit(1).maybeSingle();
  if (settings) {
    competitionOn = settings.competitionOn;
  }

  if (req.session.user) {
    const { data: fetchedScore } = await supabase
      .from('scores')
      .select('*')
      .eq('rollNumber', req.session.user.rollNumber)
      .maybeSingle();
    userScore = fetchedScore;
  }

  res.render('home/home', {
    layout: 'main',
    title: 'Home',
    session: req.session,
    username: req.session.user ? req.session.user.username : null,
    userScore: userScore,
    competitionOn: competitionOn,
    style: 'style.css',
    script: 'scrolldown.js',
  });
});

// GET: Leaderboard route (if any)
router.get('/leaderboard', async (req, res) => {
  const { data: scores } = await supabase.from('scores').select('*').order('weightedScore', { ascending: false }).limit(100);
  res.render('leaderboard/leaderboard', {
    layout: 'main',
    title: 'Leaderboard',
    style: 'leaderboard.css',
    session: req.session,
    scores: scores || []
  });
});

module.exports = router;
