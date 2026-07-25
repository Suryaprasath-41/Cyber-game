const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  competitionStatus: {
    type: Boolean,
    default: true,
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);
