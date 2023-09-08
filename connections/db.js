const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/env');

const connectDB = () => {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB successfully");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });

  mongoose.connection.on('disconnected', () => {
    console.log("Disconnected from MongoDB");
  });
};

module.exports = connectDB;
