const express = require('express');
const router = express.Router();
const score = require('../schemas/ScoreSchema');
const Settings = require('../schemas/SettingsSchema');

// middleware function to check if user logged in or not
function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    res.redirect('/users/register');
  } else {
    next();
  }
}

// GET: Unified continuous game
router.get('/play', isAuthenticated, async (req, res) => {
  // Check if competition is ON
  const settings = await Settings.findOne({});
  if (settings && settings.competitionOn === false) {
    return res.render('home/home', {
      layout: 'main',
      title: 'Home',
      message: 'The competition is currently closed.',
      style: 'style.css'
    });
  }

  // Get user's current progress
  let userScore = await score.findOne({ rollNumber: req.session.user.rollNumber });
  if (!userScore) {
    userScore = new score({
      rollNumber: req.session.user.rollNumber,
      username: req.session.user.username,
      score: 0,
      weightedScore: 0,
      accuracy: 0,
      time: 0,
      currentSection: 1,
      completionStatus: 'In Progress'
    });
    await userScore.save();
  } else if (userScore.completionStatus === 'Completed') {
     return res.redirect('/game/end');
  }

  res.render('game/play', {
    layout: 'main',
    title: '3xploit Competition',
    style: 'game.css',
    session: req.session,
    rollNumber: req.session.user.rollNumber,
    username: req.session.user.username,
    currentSection: userScore.currentSection,
    currentScore: userScore.score
  });
});

// POST: API to securely update score from frontend
router.post('/api/score', isAuthenticated, async (req, res) => {
  const { additionalScore, timeSpent, sectionCompleted, passed, correctAnswers, totalQuestions } = req.body;
  
  let userScore = await score.findOne({ rollNumber: req.session.user.rollNumber });
  if (!userScore || userScore.completionStatus === 'Completed') {
    return res.status(400).json({ error: 'Invalid operation' });
  }

  // Update metrics
  userScore.score += (additionalScore || 0);
  userScore.time += (timeSpent || 0);
  
  // Calculate accuracy based on cumulative or this section
  if (totalQuestions > 0) {
    let currentAcc = (correctAnswers / totalQuestions) * 100;
    // Simple average if moving through sections, or just keep latest if we track per section.
    // For simplicity, we just use the latest section's accuracy as part of the weighted score.
    userScore.accuracy = currentAcc;
  }

  // Server-side Weighted Score Calculation
  // Example formula: (Score * 10) + (Accuracy * 5) - (Time / 10)
  userScore.weightedScore = Math.max(0, (userScore.score * 10) + (userScore.accuracy * 5) - (userScore.time / 10));

  if (sectionCompleted && passed) {
    userScore.currentSection += 1;
    if (userScore.currentSection > 4) {
      userScore.completionStatus = 'Completed';
      userScore.completedAt = Date.now();
    }
  }

  await userScore.save();

  res.json({ success: true, currentSection: userScore.currentSection, completionStatus: userScore.completionStatus, weightedScore: userScore.weightedScore });
});

// GET: End of game screen
router.get('/end', isAuthenticated, async (req, res) => {
  let userScore = await score.findOne({ rollNumber: req.session.user.rollNumber });
  res.render('game/end', {
    layout: 'main',
    title: 'Competition Completed',
    style: 'game.css',
    session: req.session,
    finalScore: userScore ? userScore.weightedScore : 0
  });
});

module.exports = router;
