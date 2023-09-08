const express = require('express');
const RoomModel = require('../models/RoomModel');

const RoomController = {
  createRoom: async (req, res) => {
    const { name, number } = req.body;

    const newRoomId = generateRandomRoomId();

    const newRoom = new RoomModel({
      name,
      number,
      roomId: newRoomId,
    });

    try {
      await newRoom.save();

      res.json({ roomId: newRoomId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to  room' });
      console.log(err)
    }
  },

  getRoom: async (req, res) => {
    const { roomId } = req.params;

    try {
      const room = await RoomModel.findOne({ roomId });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      res.json({ room });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch room details' });
    }
  },

  joinRoom: async (req, res) => {
    const { roomId } = req.body;
  
    try {
      const room = await RoomModel.findOne({ roomId });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      
      res.json({ message: 'Joined the room successfully' , roomId});
    } catch (error) {
      res.status(500).json({ error: 'Failed to join room' });
    }
  },

};

function generateRandomRoomId() {
  return Math.floor(Math.random() * 100000).toString();
}

module.exports = RoomController;
