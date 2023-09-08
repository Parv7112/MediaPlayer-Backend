const mongoose = require('mongoose');

const MusicSchema = new mongoose.Schema({
  name: String,
  uniqueId: String,
  path: String,    
});

const MusicModel = mongoose.model('Audio', MusicSchema);

module.exports = MusicModel;
