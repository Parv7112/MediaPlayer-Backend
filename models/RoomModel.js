const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  participants: {
    type: Array,
    default: [],
  }
});

const RoomModel = mongoose.model('Room', RoomSchema);

module.exports = RoomModel;
