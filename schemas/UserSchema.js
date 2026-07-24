const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  rollNumber: {
    type: 'string',
    required: true,
    unique: true,
    trim: true,
  },
  username: {
    type: 'string',
    required: true,
    trim: true,
  },
  password: {
    type: 'string',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
var User = mongoose.model('User', UserSchema);
module.exports = User;
