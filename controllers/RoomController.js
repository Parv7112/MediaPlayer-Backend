const express = require('express');
const RoomModel = require('../models/RoomModel');
const AuthModel = require('../models/AuthModel')

const RoomController = {
  createRoom: async (req, res) => {
    const { name, number } = req.body;

    const newRoomId = generateRandomRoomId();

    const newRoom = new RoomModel({
      name,
      number,
      roomId: newRoomId,
      participants: [],
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
      const room = await RoomModel.findOne({ roomId }).populate('participants'); // Ensure 'participants' field is populated
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      res.json({ room });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch room details' });
    }
  },


  joinRoom: async (req, res) => {
    const { roomId, uid } = req.body;

    try {
      const room = await RoomModel.findOne({ roomId });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      room.participants = room.participants || [];
      room.participants.push(participantId);

      await room.save();

      // Check if participants array exists and add the participant
      if (!room.participants) {
        room.participants = [uid];
      } else if (!room.participants.includes(uid)) {
        room.participants.push(uid);
      }

      // Save the updated room data
      await room.save();

      res.json({ message: 'Joined the room successfully', data: room });
    } catch (error) {
      console.error('Error joining room:', error);
      res.status(500).json({ error: 'Failed to join room' });
    }
  },

  addParticipant: async (req, res) => {
    try {
      const { roomId, participant } = req.body;
  
      // Find the room by its ID
      const room = await RoomModel.findOne({ roomId });
  
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
  
      // Check if the participant's email exists in the AuthModel
      const userWithEmail = await AuthModel.findOne({ email: participant.email });
  
      if (!userWithEmail) {
        return res.status(404).json({ error: 'User with email not found' });
      }
  
      // Now that you have the user document with email, you can access their uid
      const uid = userWithEmail.uid;
  
      // Add the user's UID, displayName, and email to the participants array
      if (!room.participants) {
        room.participants = [{ uid, displayName: participant.displayName, email: participant.email }];
      } else {
        // Check if the participant already exists in the array
        const existingParticipant = room.participants.find((p) => p.uid === uid);
  
        if (!existingParticipant) {
          room.participants.push({ uid, displayName: participant.displayName, email: participant.email });
        }
      }
  
      // Save the updated room document
      await room.save();
  
      res.json({ success: true, message: 'Participant added to the room' });
    } catch (error) {
      console.error('Error adding participant:', error);
      res.status(500).json({ success: false, message: 'Failed to add participant' });
    }
  },    
  
  
  

};

function generateRandomRoomId() {
  return Math.floor(Math.random() * 100000).toString();
}

module.exports = RoomController;
