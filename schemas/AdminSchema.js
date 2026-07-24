const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  username: {
    type: 'string',
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: 'string',
    required: true,
  },
});
var Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
