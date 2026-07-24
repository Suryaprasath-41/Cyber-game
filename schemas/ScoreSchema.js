const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  rollNumber: {
    type: 'string',
    required: true,
    trim: true,
  },
  username: {
    type: 'string',
    required: true,
    trim: true,
  },
  score: {
    type: 'number',
    required: true,
    default: 0
  },
  weightedScore: {
    type: 'number',
    required: true,
    default: 0
  },
  accuracy: {
    type: 'number',
    required: true,
    default: 0
  },
  time: {
    type: 'number',
    required: true,
    default: 0,
  },
  currentSection: {
    type: 'number',
    required: true,
    default: 1
  },
  completionStatus: {
    type: 'string',
    default: 'In Progress'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});
var Score = mongoose.model('Score', ScoreSchema);
module.exports = Score;
