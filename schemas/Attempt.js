const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
  },
  section: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  correctAnswers: {
    type: Number,
    required: true,
  },
  wrongAnswers: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  weightedScore: {
    type: Number,
    required: true,
  },
  totalTime: {
    type: Number,
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Attempt', AttemptSchema);
