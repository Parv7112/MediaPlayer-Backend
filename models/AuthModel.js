const mongoose = require('mongoose');

const AuthSchema = new mongoose.Schema({
  uid: String,
  displayName: String,
  email: String,    
});

const AuthModel = mongoose.model('auth', AuthSchema);

module.exports = AuthModel;
