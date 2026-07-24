const express = require('express');
const router = express.Router();
const score = require('../schemas/ScoreSchema');
const Settings = require('../schemas/SettingsSchema');

//home
router.get('/', async (req, res) => {
  let userScore = null;
  let competitionOn = true;
  
  const settings = await Settings.findOne({});
  if (settings) {
    competitionOn = settings.competitionOn;
  }

  if (req.session.user) {
    userScore = await score.findOne({ rollNumber: req.session.user.rollNumber });
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
