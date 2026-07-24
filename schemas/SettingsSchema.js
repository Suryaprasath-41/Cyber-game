const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SettingsSchema = new Schema({
  competitionOn: {
    type: 'boolean',
    required: true,
    default: true
  }
});
var Settings = mongoose.model('Settings', SettingsSchema);
module.exports = Settings;
