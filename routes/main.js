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


module.exports = router;
